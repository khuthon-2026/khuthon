import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { ShaderMaterial } from "three";
import { AdditiveBlending, Vector3 } from "three";

type IslandWaterEffectProps = {
  position: [number, number, number];
  scale?: [number, number];
  intensity?: number;
  seed?: number;
};

export function IslandWaterEffect({
  position,
  scale = [1.55, 1.2],
  intensity = 1,
  seed = 0
}: IslandWaterEffectProps) {
  const baseRef = useRef<ShaderMaterial>(null);
  const glowRef = useRef<ShaderMaterial>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (baseRef.current) {
      baseRef.current.uniforms.uTime.value = t;
      baseRef.current.uniforms.uSeed.value = seed;
      baseRef.current.uniforms.uIntensity.value = intensity;
    }
    if (glowRef.current) {
      glowRef.current.uniforms.uTime.value = t;
      glowRef.current.uniforms.uSeed.value = seed;
      glowRef.current.uniforms.uIntensity.value = intensity;
    }
  });

  // 조정 포인트(디자인/성능):
  // - scale: 섬보다 살짝 큰 타원 크기
  // - intensity: 전체 존재감(0.6~1.2 권장)
  // - fragmentShader의 alpha/feather/ripple 파라미터로 더 잔잔하게/더 또렷하게 조절
  const sharedUniforms = {
    uTime: { value: 0 },
    uSeed: { value: seed },
    uIntensity: { value: intensity },
    uInner: { value: new Vector3(0.06, 0.42, 0.52) }, // blue-green
    uOuter: { value: new Vector3(0.02, 0.12, 0.18) } // deep navy
  };

  const vertexShader = `
    precision highp float;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    precision highp float;
    uniform float uTime;
    uniform float uSeed;
    uniform float uIntensity;
    uniform vec3 uInner;
    uniform vec3 uOuter;
    varying vec2 vUv;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7)) + uSeed * 12.3) * 43758.5453123);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    void main() {
      vec2 uv = vUv * 2.0 - 1.0;
      float r = length(uv);

      // 중심은 살짝 밝고, 가장자리는 부드럽게 사라짐
      float feather = smoothstep(0.98, 0.55, r);

      // 잔잔한 동심원 리플(크기 변화는 작게)
      float t = uTime * 0.55 + uSeed * 4.0;
      float rings = sin((r * 16.0 - t) * 2.2) * 0.5 + 0.5;
      rings = pow(rings, 6.0) * 0.18;

      // 미세 왜곡(유기적 물결)
      float warp = noise(uv * 2.6 + vec2(t * 0.12, -t * 0.1)) * 0.10;
      float ripple = (rings + warp) * feather;

      vec3 color = mix(uOuter, uInner, smoothstep(0.85, 0.0, r));
      float alpha = (0.12 + ripple * 0.55) * feather * uIntensity;

      gl_FragColor = vec4(color, alpha);
    }
  `;

  return (
    <group position={position} rotation-x={-Math.PI / 2}>
      <mesh scale={[scale[0], 1, scale[1]]} renderOrder={2}>
        <circleGeometry args={[1.0, 80]} />
        <shaderMaterial
          ref={baseRef}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
          uniforms={sharedUniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      </mesh>
      <mesh scale={[scale[0] * 1.25, 1, scale[1] * 1.25]} position={[0, -0.001, 0]} renderOrder={1}>
        <circleGeometry args={[1.0, 80]} />
        <shaderMaterial
          ref={glowRef}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
          uniforms={sharedUniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      </mesh>
    </group>
  );
}


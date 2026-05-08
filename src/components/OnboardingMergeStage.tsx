import { Suspense, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import type { AnimationAction, AnimationClip } from "three";
import { Box3, LoopRepeat, MathUtils, Mesh, PerspectiveCamera, Vector3, type Group } from "three";

export const AFTER_MAIN_MERGE_GLB = "/models/onboarding/after-main-merge.glb";
export const AFTER_MIDDLE_MERGE_GLB = "/models/onboarding/after-middle-merge.glb";
export const AFTER_SUB_MERGE_GLB = "/models/onboarding/after-sub-merge.glb";

/** 현재 온보딩 단계별: 대분류·중분류·소분류 전환 연출 */
export type OnboardingMergeGlbVariant = "main" | "middle" | "sub";

function glbUrlForVariant(variant: OnboardingMergeGlbVariant) {
  if (variant === "main") return AFTER_MAIN_MERGE_GLB;
  if (variant === "middle") return AFTER_MIDDLE_MERGE_GLB;
  return AFTER_SUB_MERGE_GLB;
}

function normalizeMergeScene(scene: Group) {
  const cloned = scene.clone(true) as Group;
  const box = new Box3().setFromObject(cloned);
  const size = new Vector3();
  const center = new Vector3();
  box.getSize(size);
  box.getCenter(center);
  cloned.position.sub(center);
  /* 탑 시점에서는 중심 맞춤만 유지 — 아래쪽으로 과도하게 띄우면 디스크·옆면이 더 도드라짐 */

  cloned.traverse((child) => {
    if (!(child instanceof Mesh)) return;
    child.castShadow = false;
    child.receiveShadow = true;
  });

  const maxDim = Math.max(size.x, size.y, size.z, 0.001);
  const normalizeScale = 2.82 / maxDim;
  return { scene: cloned, normalizeScale };
}

function SceneBackdrop() {
  const { scene } = useThree();
  useEffect(() => {
    scene.background = null;
    return undefined;
  }, [scene]);
  return null;
}

/** 전면(+Z 방향)·눈높이에 가까운 영웅 샷 — 위에서 깔 보는 구도가 아님 */
function MergeCameraRig({ subjectEyeY }: { subjectEyeY: number }) {
  const camera = useThree((state) => state.camera);

  useLayoutEffect(() => {
    if (!(camera instanceof PerspectiveCamera)) {
      return;
    }
    camera.near = 0.05;
    camera.far = 90;
    camera.fov = 35;
    camera.up.set(0, 1, 0);
    const tgt = new Vector3(0.04, subjectEyeY, -0.12);
    camera.position.set(0.12, subjectEyeY + 0.86, 5.45);
    camera.lookAt(tgt);
    camera.updateProjectionMatrix();
  }, [camera, subjectEyeY]);

  return null;
}

function MergeSubject({ variant }: { variant: OnboardingMergeGlbVariant }) {
  const url = glbUrlForVariant(variant);
  const gltf = useGLTF(url) as unknown as { scene: Group; animations: AnimationClip[] };
  const rootRef = useRef<Group>(null);

  const prepared = useMemo(() => normalizeMergeScene(gltf.scene), [gltf.scene]);

  const { actions } = useAnimations(gltf.animations, rootRef);

  useEffect(() => {
    const playable = Object.values(actions).filter(Boolean) as AnimationAction[];
    if (!playable.length) {
      return undefined;
    }

    playable.forEach((action) => {
      action.reset();
      action.clampWhenFinished = false;
      action.setLoop(LoopRepeat, Infinity);
      action.fadeIn(0.12).play();
    });

    return () => {
      playable.forEach((action) => {
        action.fadeOut(0.2);
      });
    };
  }, [actions, variant, url]);

  /** Y축 주위, 위(+Y)에서 내려다본 기준 반시계 90° */
  const rotY_CCW90 = MathUtils.degToRad(90);

  return (
    <group ref={rootRef}>
      <group rotation={[0, rotY_CCW90, 0]} scale={prepared.normalizeScale}>
        <primitive object={prepared.scene} />
      </group>
    </group>
  );
}

function MergeLights() {
  return (
    <>
      <ambientLight intensity={0.48} color="#e3f6f9" />
      <directionalLight position={[5.4, 4.95, 6.85]} intensity={2.06} color="#fff8ef" />
      <directionalLight position={[-4.42, 1.82, -2.85]} intensity={1.38} color="#9fe7f5" />
    </>
  );
}

const MERGE_SUBJECT_WORLD_Y = 2.88;

function MergeScene({ variant }: { variant: OnboardingMergeGlbVariant }) {
  /** 월드에서 섬의 대략적 ‘가슴높이’ — 노멀라이즈된 메쉬 중심을 기준 */
  const subjectEyeY = MERGE_SUBJECT_WORLD_Y + 0.18;
  return (
    <>
      <SceneBackdrop />
      <MergeLights />
      <MergeCameraRig subjectEyeY={subjectEyeY} />
      <group position={[0, MERGE_SUBJECT_WORLD_Y, -0.06]}>
        <MergeSubject variant={variant} />
      </group>
    </>
  );
}

export function OnboardingMergeCanvas({ variant }: { variant: OnboardingMergeGlbVariant }) {
  return (
    <Canvas
      className="merge-core-webgl-canvas"
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      camera={{
        position: [0.12, 3.94, 5.45],
        fov: 35,
        near: 0.05,
        far: 90
      }}
      style={{ touchAction: "none" }}
    >
      <Suspense fallback={null}>
        <MergeScene variant={variant} />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload(AFTER_MAIN_MERGE_GLB);
useGLTF.preload(AFTER_MIDDLE_MERGE_GLB);
useGLTF.preload(AFTER_SUB_MERGE_GLB);

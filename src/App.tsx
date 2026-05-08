import { LoginScreen } from "./components/LoginScreen";
import { OnboardingFlow } from "./components/OnboardingFlow";
import { KeywordReveal } from "./components/KeywordReveal";
import { UploadScreen } from "./components/UploadScreen";
import { WorldScreen } from "./components/WorldScreen";
import { BgmPlayer } from "./components/BgmPlayer";
import { useAppStore } from "./store/useAppStore";

export default function App() {
  const screen = useAppStore((state) => state.screen);

  if (screen === "login") {
    return (
      <>
        <BgmPlayer />
        <LoginScreen />
      </>
    );
  }

  if (screen === "onboarding") {
    return (
      <>
        <BgmPlayer />
        <OnboardingFlow />
      </>
    );
  }

  if (screen === "keywords") {
    return (
      <>
        <BgmPlayer />
        <KeywordReveal />
      </>
    );
  }

  if (screen === "upload") {
    return (
      <>
        <BgmPlayer />
        <UploadScreen />
      </>
    );
  }

  return (
    <>
      <BgmPlayer />
      <WorldScreen mode={screen === "myIsland" ? "myIsland" : "world"} />
    </>
  );
}

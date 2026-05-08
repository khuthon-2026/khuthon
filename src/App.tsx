import { LoginScreen } from "./components/LoginScreen";
import { OnboardingFlow } from "./components/OnboardingFlow";
import { KeywordReveal } from "./components/KeywordReveal";
import { UploadScreen } from "./components/UploadScreen";
import { WorldScreen } from "./components/WorldScreen";
import { useAppStore } from "./store/useAppStore";

export default function App() {
  const screen = useAppStore((state) => state.screen);

  if (screen === "login") {
    return <LoginScreen />;
  }

  if (screen === "onboarding") {
    return <OnboardingFlow />;
  }

  if (screen === "keywords") {
    return <KeywordReveal />;
  }

  if (screen === "upload") {
    return <UploadScreen />;
  }

  return <WorldScreen mode={screen === "myIsland" ? "myIsland" : "world"} />;
}

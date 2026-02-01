import { Composition } from "remotion";
import { PromptToVideo } from "./PromptToVideo";
import { registerRoot } from "remotion";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PromptToVideo"
        component={PromptToVideo}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1080}
      />
    </>
  );
};

registerRoot(RemotionRoot);

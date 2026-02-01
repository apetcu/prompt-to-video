import { Composition } from "remotion";
import { PromptToVideo } from "./PromptToVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PromptToVideo"
        component={PromptToVideo}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};

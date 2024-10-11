// import { Composition } from "remotion";

// import { HelloWorld, myCompSchema } from "./HelloWorld";
// import { Logo, myCompSchema2 } from "./HelloWorld/Logo";
import { Composition } from "remotion";
import { VideoComponent } from "./VideoComponent";

export const TOTAL_DURATION_IN_FRAMES = 150;

// Each <Composition> is an entry in the sidebar!
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyVideo"
        component={VideoComponent}
        durationInFrames={TOTAL_DURATION_IN_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};

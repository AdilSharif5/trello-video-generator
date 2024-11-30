import { Composition } from "remotion";

import Walkthrough from "./Walkthrough";
// import { VideoComponent } from "./VideoComponent";

export const TOTAL_DURATION_IN_FRAMES = 400;

// Each <Composition> is an entry in the sidebar!
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyVideo"
        component={Walkthrough}
        durationInFrames={TOTAL_DURATION_IN_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};

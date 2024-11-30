import { useState } from "react";

import { AbsoluteFill, Sequence } from "remotion";

import { CursorProvider } from "./Walkthrough/contexts/CursorContext";
import AppShowcase from "./Walkthrough/AppShowcase";
import { TOTAL_DURATION_IN_FRAMES } from "./Root";

const Walkthrough = () => {
  const [scale, setScale] = useState(1);

  return (
    <CursorProvider>
      <AbsoluteFill
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top right", // Focus the zoom on the top right side
          transition: `background-color 1s, color 0.1s`,
        }}
      >
        <Sequence from={0} durationInFrames={TOTAL_DURATION_IN_FRAMES}>
          <AppShowcase onScaleChange={setScale} />
        </Sequence>
      </AbsoluteFill>
    </CursorProvider>
  );
};

export default Walkthrough;

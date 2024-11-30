import { interpolate, spring } from "remotion";

type UseZoomEffectProps = {
  frame: number;
  startFrame?: number;
  zoomInDuration?: number;
  holdDuration?: number;
  zoomOutDuration?: number;
  fps?: number;
  maxScale?: number;
};

export const useZoomEffect = ({
  frame,
  startFrame = 0,
  zoomInDuration = 10,
  holdDuration = 50,
  zoomOutDuration = 10,
  fps = 30,
  maxScale = 2,
}: UseZoomEffectProps): number => {
  // Zoom-in animation using spring
  const zoomIn = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: { damping: 200 },
  });

  // Scale value during zoom-in
  const scaleIn = interpolate(zoomIn, [0, 1], [1, maxScale]);

  // Calculate total keyframes
  const zoomInEnd = startFrame + zoomInDuration;
  const holdEnd = zoomInEnd + holdDuration;
  const zoomOutStart = holdEnd;
  const zoomOutEnd = zoomOutStart + zoomOutDuration;

  // Final scale calculation with conditions
  const scale =
    frame < startFrame
      ? 1 // No scaling before the start frame
      : frame <= zoomInEnd
        ? scaleIn // Zoom-in phase
        : frame <= holdEnd
          ? maxScale // Hold at max scale
          : frame <= zoomOutEnd
            ? interpolate(frame, [zoomOutStart, zoomOutEnd], [maxScale, 1], {
                extrapolateRight: "clamp",
              }) // Smooth zoom-out
            : 1; // Reset to original scale

  return scale;
};

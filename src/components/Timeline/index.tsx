import React, { useEffect, useState } from "react";

import styles from "../VideoPlayer/VideoPlayer.module.css";

interface timelineProps {
  isPaused: boolean;
  progressPercent: number;
  seekVideo: (time: number) => void;
}

const Timeline = ({
  isPaused,
  progressPercent,
  seekVideo,
}: timelineProps): JSX.Element => {
  const [isScrubbing, setIsScrubbing] = useState<boolean>(false);
  const timelineRef = React.createRef<HTMLDivElement>();

  useEffect(() => {
    const timeline = timelineRef.current;
    if (timeline) {
      timeline.style.setProperty("--progress", `${progressPercent}%`);

      // listeners
      const mouseDownListener = (e: MouseEvent) => {
        console.log("scrubbing");
        setIsScrubbing(true);
        const timelineRect = timeline.getBoundingClientRect();
        const timeToSetPercent =
          Math.max(0, e.x - timelineRect.left) /
          (timelineRect.right - timelineRect.left);
        seekVideo(timeToSetPercent);
      };
      const mouseUpListener = (e: MouseEvent) => {
        console.log("not scrubbing");
        setIsScrubbing(false);
      };
      const mouseMoveListener = (e: MouseEvent) => {
        if (!isScrubbing) return;
        // ala kaakunda isScrubbing ayithe,
        // move the knob along with the cursor
        // video pause
        const timlineRect = timeline.getBoundingClientRect();
        const timeToSetPercent = Math.min(
          Math.max(0, e.x - timlineRect.left) /
            (timlineRect.right - timlineRect.left),
          1
        );
        seekVideo(timeToSetPercent);
      };
      timeline.addEventListener("mousedown", mouseDownListener);
      document.addEventListener("mousemove", mouseMoveListener);
      document.addEventListener("mouseup", mouseUpListener);

      return () => {
        timeline.removeEventListener("mousedown", mouseDownListener);
        document.removeEventListener("mousemove", mouseMoveListener);
        document.removeEventListener("mouseup", mouseUpListener);
      };
    }
  }, [seekVideo, progressPercent, timelineRef]);

  return (
    <div className={styles.timelineContainer}>
      <div
        className={`${styles.timeline} ${isScrubbing ? styles.scrubbing : ""}`}
        ref={timelineRef}></div>
    </div>
  );
};

export default Timeline;

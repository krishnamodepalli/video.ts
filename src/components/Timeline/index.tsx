import React, { RefObject, useEffect } from "react";
import styles from "../VideoPlayer/VideoPlayer.module.css";

interface timelineProps {
  seekVideo: (time: number) => void;
  progressPercent: number;
}

const Timeline = ({
  seekVideo,
  progressPercent,
}: timelineProps): JSX.Element => {
  const timelineRef = React.createRef<HTMLDivElement>();
  useEffect(() => {
    const timeline = timelineRef.current;
    if (timeline) {
      timeline.style.setProperty("--progress", `${progressPercent}%`);
      
      timeline.addEventListener("mousedown", (e) => {
        const timelineRect = timeline.getBoundingClientRect();
        const timeToSetPercent = Math.max(0, e.x - timelineRect.left) / (timelineRect.right - timelineRect.left);
        seekVideo(timeToSetPercent);
      });
    }
  }, [progressPercent, timelineRef]);

  return (
    <div className={styles.timelineContainer}>
      <div className={styles.timeline} ref={timelineRef}></div>
    </div>
  );
};

export default Timeline;

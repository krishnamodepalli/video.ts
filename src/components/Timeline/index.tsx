import React, { useEffect } from "react";
import styles from "../VideoPlayer/VideoPlayer.module.css";

interface timelineProps {
  progressPercent: number;
}

const Timeline = ({
  progressPercent,
}: timelineProps): JSX.Element => {
  const timelineRef = React.createRef<HTMLDivElement>();
  useEffect(() => {
    const timeline = timelineRef.current;
    if (timeline) {
      timeline.style.setProperty("--progress", `${progressPercent}%`)
    }
  }, [progressPercent]);

  console.log(timelineRef.current?.before);

  return <div className={styles.timeline} ref={timelineRef} ></div>;
};

export default Timeline;

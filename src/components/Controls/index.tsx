import { useEffect } from "react";
import FullScreenBtn from "../FullScreenBtn";
import PlayPauseBtn from "../PlayPauseBtn";
import Timeline from "../Timeline";
import styles from "../VideoPlayer/VideoPlayer.module.css";

interface controlProps {
  currVideoTime: number;
  leftVideoTime: number; // remianing video time
  isPaused: boolean;
  isFullScreen: boolean;
  onPlayPause: () => void;
  onFullScreenCollapse: () => void;
}

const Controls = ({
  isPaused,
  isFullScreen,
  currVideoTime,
  leftVideoTime,
  onPlayPause,
  onFullScreenCollapse,
}: controlProps): JSX.Element => {

  const formatTime = (time: number): string => {
    let min: number = Math.floor(time / 60);
    let sec: number = Math.floor(time % 60);
    return `${min.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  };

  const Time = ({ time }: { time: number }): JSX.Element => {
    return <div className={styles.time}>{formatTime(Math.round(time))}</div>;
  };

  return (
    <div className={styles.videoControlsContainer}>
      <div className={styles.controls}>
        <PlayPauseBtn paused={isPaused} onPlayPause={onPlayPause} />
        <Time time={currVideoTime} />
        <Timeline progressPercent={(currVideoTime / (currVideoTime + leftVideoTime)) * 100} />
        <Time time={leftVideoTime} />
        <FullScreenBtn
          isFullScreen={isFullScreen}
          onExpandCollapse={onFullScreenCollapse}
        />
      </div>
    </div>
  );
};

export default Controls;

import PlayPauseBtn from "../PlayPauseBtn";
import VolumeControls from "../Volume";
import Timeline from "../Timeline";
import FullScreenBtn from "../FullScreenBtn";
import styles from "../VideoPlayer/VideoPlayer.module.css";

interface controlProps {
  isPaused: boolean;
  isMute: boolean;
  volumePercent: number;
  isFullScreen: boolean;
  show: boolean;
  currVideoTime: number;
  leftVideoTime: number; // remianing video time
  seekVideoTo: (time: number) => void;
  onPlayPause: () => void;
  onMuteUnmute: () => void;
  updateVolume: (vol: number) => void;
  onFullScreenCollapse: () => void;
}

const Controls = ({
  isPaused,
  isMute,
  volumePercent,
  isFullScreen,
  show,
  currVideoTime,
  leftVideoTime,
  seekVideoTo,
  onPlayPause,
  onMuteUnmute,
  updateVolume,
  onFullScreenCollapse,
}: controlProps): JSX.Element => {
  const formatTime = (time: number): string => {
    const floor = Math.floor;

    let hrs: number = 0;
    let min: number = floor(time / 60);
    let sec: number = floor(time % 60);

    // if video is longer than 59 mins
    if (min > 59) {
      hrs = floor(min / 60);
      min = min % 60;
    }

    return `${hrs > 0 ? hrs + ":" : ""}${min.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  };

  const Time = ({ time }: { time: number }): JSX.Element => {
    return <div className={styles.time}>{formatTime(Math.round(time))}</div>;
  };

  return (
    <div className={`${styles.videoControlsContainer} ${show ? "" : styles.hidden}`}>
    {/* // <div className={`${styles.videoControlsContainer} ${}`}> */}
      <div className={styles.controls}>
        <PlayPauseBtn paused={isPaused} onPlayPause={onPlayPause} />
        <VolumeControls isMute={isMute} volumePercent={volumePercent} onMuteUnmute={onMuteUnmute} updateVolume={updateVolume} />
        <Time time={currVideoTime} />
        <Timeline isPaused={isPaused} seekVideo={seekVideoTo}
          progressPercent={
            (currVideoTime / (currVideoTime + leftVideoTime)) * 100
          }
        />
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

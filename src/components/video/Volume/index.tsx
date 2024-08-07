import { ChangeEvent } from "react";

import Mute from "/public/images/mute.svg";
import VolumeHigh from "/public/images/volume-high.svg";
import VolumeLow from "/public/images/volume-low.svg";

import styles from "@/components/video/video.module.css";

interface volumeProps {
  isMute: boolean;
  volumePercent: number;
  onMuteUnmute: () => void;
  updateVolume: (vol: number) => void;
}

const VolumeControls = ({
  isMute,
  volumePercent,
  onMuteUnmute,
  updateVolume,
}: volumeProps): JSX.Element => {
  const Volume = ({
    isMute,
    vol,
  }: {
    isMute: boolean;
    vol: number;
  }): JSX.Element => {
    if (isMute || vol === 0) return <Mute />;
    else if (vol < 50) return <VolumeLow />;
    else return <VolumeHigh />;
  };

  return (
    <div className={styles.volCont}>
      <button
        className={styles.controlBtn}
        id={styles.volume}
        onClick={() => (onMuteUnmute ? onMuteUnmute() : null)}>
        <Volume isMute={isMute} vol={volumePercent} />
      </button>
      <div id={styles.volSlider}>
        <input
          type="range"
          name="vol"
          id={styles.volRange}
          value={volumePercent}
          min={0}
          max={100}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            updateVolume(parseInt(e.target.value))
          }
        />
      </div>
    </div>
  );
};

export default VolumeControls;

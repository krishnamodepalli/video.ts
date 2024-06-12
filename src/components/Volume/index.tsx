import styles from "@/components/VideoPlayer/VideoPlayer.module.css";
import { ChangeEvent } from "react";

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
    if (isMute) return <i className="fa-solid fa-volume-slash"></i>;
    if (vol === 0) return <i className="fa-solid fa-volume-off"></i>;
    else if (vol < 30) return <i className="fa-solid fa-volume-low"></i>;
    else if (vol < 70) return <i className="fa-solid fa-volume"></i>;
    else return <i className="fa-solid fa-volume-high"></i>;
  };

  return (
    <div className={styles.volCont}>
      <button
        className={styles.controlBtn}
        id={styles.volume}
        onClick={() => (onMuteUnmute ? onMuteUnmute() : null)}
      >
        <Volume isMute={isMute} vol={volumePercent} />
      </button>
      <div>
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

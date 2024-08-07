import Mute from "/public/images/mute.svg";
import VolumeHigh from "/public/images/volume-high.svg";
import VolumeLow from "/public/images/volume-low.svg";
import Pause from "/public/images/pause.svg";
import Play from "/public/images/play.svg";

import visualHelperType from "@/interface/VisualHelper";

import styles from "./styles.module.css";

const VisualHelpers = ({
  event,
  helperClass,
  volumeLabel,
}: visualHelperType): JSX.Element => {
  return (
    <div className={styles.helperCont}>
      <div className={`${styles.helper} ${helperClass}`}>
        {(() => {
          if (event === "play") return <Play />;
          // return <i className="fa-solid fa-play" id={styles.playHelper}></i>;
          else if (event === "pause") return <Pause />;
          else if (event === "mute") return <Mute />;
          else if (event === "volume") return <VolumeHigh />;
          else if (event === "volume-high") return <VolumeHigh />;
          else if (event === "volume-low") return <VolumeLow />;
          else return <></>;
        })()}
      </div>
      <span
        className={event.startsWith("volume") ? helperClass : ""}
        id={styles.volLabelHelper}>
        {volumeLabel}%
      </span>
    </div>
  );
};

export default VisualHelpers;

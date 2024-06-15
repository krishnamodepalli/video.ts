"use client";

import { useState } from "react";

import styles from "../VideoPlayer/VideoPlayer.module.css";

type visualHelperEventType =
  | "pause"
  | "play"
  | "mute"
  | "volume"
  | "volume-off"
  | "volume-low"
  | "volume-high"
  | "forward"
  | "backward";

type visualHelperType = {
  event: visualHelperEventType;
  helperClass: string;
  volumeLabel: number;
};

const VisualHelpers = ({
  event,
  helperClass,
  volumeLabel,
}: visualHelperType): JSX.Element => {
  return (
    <div className={styles.helperCont}>
      <div className={`${styles.helper} ${helperClass}`}>
        {(() => {
          if (event === "play")
            return <i className="fa-solid fa-play" id={styles.playHelper}></i>;
          else if (event === "pause")
            return <i className="fa-solid fa-pause"></i>;
          else if (event === "mute")
            return <i className="fa-solid fa-volume-slash"></i>;
          else if (event === "volume")
            return <i className="fa-solid fa-volume"></i>;
          else if (event === "volume-high")
            return <i className="fa-solid fa-volume-high"></i>;
          else if (event === "volume-low")
            return <i className="fa-solid fa-volume-low"></i>;
          else if (event === "volume-off")
            return (
              <i
                className="fa-solid fa-volume-off"
                id={styles.volOffHelper}
              ></i>
            );
          else return <></>;
        })()}
      </div>
      <span
        className={event.startsWith("volume") ? helperClass : ""}
        id={styles.volLabelHelper}
      >
        {volumeLabel}%
      </span>
    </div>
  );
};

export { type visualHelperEventType };
export default VisualHelpers;

"use client";

import React, { useState, useRef } from "react";

import Controls from "../Controls";
import VisualHelpers from "../VisualHelper";
import { visualHelperEventType } from "../../interface/VisualHelper";

import styles from "./VideoPlayer.module.css";

const VideoPlayer = () => {
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(70);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(false);

  const [visualHelperEvent, setVisualHelperEvent] =
    useState<visualHelperEventType>("play");
  const [helperClass, setHelperClass] = useState("");

  // refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const contRef = useRef<HTMLDivElement | null>(null);
  const showControlsRef = useRef<NodeJS.Timeout>();
  const showVisualHelpersRef = useRef<NodeJS.Timeout>();

  // This should be definetely placed in this file
  const showControlsFor = (n: number, callback?: () => void): void => {
    setShowControls(true);
    clearTimeout(showControlsRef.current);
    showControlsRef.current = setTimeout(() => {
      setShowControls(false);
      if (callback) callback();
    }, n * 1000);
  };

  const showVisualHelper: (helperEvent: visualHelperEventType) => void = (
    helperEvent: visualHelperEventType
  ) => {
    console.log("calling", helperEvent);
    setVisualHelperEvent(helperEvent);
    setHelperClass(styles.show);
    clearTimeout(showVisualHelpersRef.current);
    showVisualHelpersRef.current = setTimeout(() => {
      setHelperClass(styles.hide);
    }, 10);
  };

  return (
    <div
      className={`${styles.videoContainer} ${
        isFullScreen ? styles.fullScreenVideo : ""
      } ${!isPaused && !showControls ? styles.hidden : ""}`} // for making the cursor disapper
      ref={contRef}>
      <video className={styles.video} ref={videoRef} muted>
        <source src="/videos/ocean.mp4" type="video/mp4" />
      </video>
      <VisualHelpers
        event={visualHelperEvent}
        helperClass={helperClass}
        volumeLabel={volume}
      />
      <Controls
        videoRef={videoRef}
        contRef={contRef}
        isPaused={isPaused}
        volume={volume}
        isFullScreen={isFullScreen}
        show={isPaused || showControls}
        setIsPaused={setIsPaused}
        setVolume={setVolume}
        setIsFullScreen={setIsFullScreen}
        showControlsFor={showControlsFor}
        showVisualHelper={showVisualHelper}
      />
    </div>
  );
};

export default VideoPlayer;

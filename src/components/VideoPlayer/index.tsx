"use client";

import React, { useState, useEffect, useRef } from "react";

import styles from "./VideoPlayer.module.css";
import VisualHelpers from "../VisualHelper/index";
import { type visualHelperEventType } from "../VisualHelper/index";
import Controls from "../Controls";

const VideoPlayer = () => {
  const [showControls, setShowControls] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [isMute, setIsMute] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(70);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [currVideoTime, setCurrVideoTime] = useState<number>(0);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  const [visualHelperEvent, setVisualHelperEvent] =
    useState<visualHelperEventType>("play");
  const [helperClass, setHelperClass] = useState("");

  // refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const contRef = useRef<HTMLDivElement | null>(null);
  const showControlsRef = useRef<NodeJS.Timeout>();
  const showVisualHelpersRef = useRef<NodeJS.Timeout>();

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

  const togglePlayPause: () => void = () => {
    console.log("play/pause triggered");
    const video = videoRef.current;
    if (video) {
      if (video.paused) {
        showVisualHelper("play");
        console.log("playing");
        setIsPaused(false);
        video.play();
      } else {
        showVisualHelper("pause");
        console.log("paused");
        setIsPaused(true);
        video.pause();
      }
    }
  };

  const expandCollapseVideo: () => void = () => {
    const container = contRef.current;
    console.log("expand/collapse ran");
    if (container) {
      if (isFullScreen) {
        console.log(document);
        document.exitFullscreen().then(() => setIsFullScreen(false));
        console.log("Full Screen exiting");
      } else {
        container.requestFullscreen().then(() => setIsFullScreen(true));
        console.log("Full Screen entering");
      }
    }
  };

  const updateVolume: (vol: number) => void = (vol: number) => {
    const video = videoRef.current;
    if (video) {
      console.log("input: " + vol);
      setVolume(vol);
      if (vol > video.volume * 100) showVisualHelper("volume-high");
      else if (vol === 0) showVisualHelper("mute");
      else  showVisualHelper("volume-low");
      video.volume = vol / 100;
    }
  };

  const muteUnmute: () => void = () => {
    const video = videoRef.current;
    if (video) {
      if (video.muted) {
        video.muted = false;
        setIsMute(false);
        video.volume = volume / 100;
        showVisualHelper("volume");
      } else {
        video.muted = true;
        setIsMute(true);
        showVisualHelper("mute");
      }
    }
  };

  const showControlsFor = (n: number, callback?: () => void): void => {
    setShowControls(true);
    clearTimeout(showControlsRef.current);
    showControlsRef.current = setTimeout(() => {
      setShowControls(false);
      if (callback) callback();
    }, n * 1000);
  };

  const seekVideoTo = (toPercent: number): void => {
    const video = videoRef.current;
    if (video) {
      const time = toPercent * videoDuration;
      video.currentTime = time;
      setCurrVideoTime(time);
      video.volume = 0.7;
    }
    showControlsFor(2);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      setVideoDuration(video.duration);
      if (video.muted) setIsMute(true);

      // mouse event listeners
      const clickListerner = () => {
        togglePlayPause();
        showControlsFor(2);
      };
      const mouseLeaveListener = () => showControlsFor(2);
      const mouseMoveListener = mouseLeaveListener;
      // mouse events
      video.addEventListener("mouseleave", mouseLeaveListener);
      video.addEventListener("mousemove", mouseMoveListener);
      video.addEventListener("click", clickListerner);

      // TODO 1. Add m for mute
      const listener: (e: KeyboardEvent) => void = (e) => {
        console.log(typeof e.key);
        if (e.key === "f") {
          expandCollapseVideo();
        } else if ([" ", "k"].includes(e.key)) {
          console.log("play or pause");
          togglePlayPause();
        } else if (["l", "ArrowRight"].includes(e.key)) {
          video.currentTime += 10;
        } else if (["j", "ArrowLeft"].includes(e.key)) {
          video.currentTime -= 11;
        } else if (["ArrowUp"].includes(e.key)) {
          console.log(volume + 5);
          if (volume < 95) updateVolume(volume + 5);
          else updateVolume(100);
          console.log("volume :" + volume);
        } else if (e.key === "ArrowDown") {
          if (volume > 5) updateVolume(volume - 5);
          else updateVolume(0);
          console.log("volume :" + volume);
        } else if (e.key === "m") {
          muteUnmute();
        } else if (e.key === "Escape") {
          // FIXME This is showing some big time error, please fix ASAP
          console.log("escape ran");
          e.preventDefault();
          if (isFullScreen) expandCollapseVideo();
        } else if (e.key >= "0" && e.key <= "9") {
          // FIXME with `ctrl or `alt do not do this
          if (e.altKey || e.ctrlKey || e.metaKey) return;
          video.currentTime = (parseInt(e.key) * videoDuration) / 10;
        }
        // after each of this operation or the keystroke, show the controls for 2 seconds
        showControlsFor(2);
        setCurrVideoTime(video.currentTime);
      };
      document.addEventListener("keyup", listener);

      return () => {
        document.removeEventListener("keyup", listener);
        video.removeEventListener("click", clickListerner);
        video.removeEventListener("mouseleave", mouseLeaveListener);
        video.removeEventListener("mousemove", mouseMoveListener);
      };
    }
  }, [videoRef, expandCollapseVideo]);

  useEffect(() => {
    if (isPaused) return;

    const updateCurrentTime = () => {
      const currentTime = videoRef.current?.currentTime;
      if (videoDuration != null && currentTime != null) {
        setCurrVideoTime(currentTime);
        if (currentTime === videoDuration) {
          // on end of the video
          setIsPaused(true);
        }
      }
    };

    const intervalId = setInterval(updateCurrentTime, 100);

    return () => {
      clearInterval(intervalId);
    };
  }, [currVideoTime, videoDuration, isPaused]);

  return (
    <div
      className={`${styles.videoContainer} ${
        isFullScreen ? styles.fullScreenVideo : ""
      } ${!isPaused && !showControls ? styles.hidden : ""}`} // for making the cursor disapper
      ref={contRef}
    >
      <VisualHelpers
        event={visualHelperEvent}
        helperClass={helperClass}
        volumeLabel={volume}
      />
      <video className={styles.video} ref={videoRef} muted>
        <source src="/videos/ocean.mp4" type="video/mp4" />
      </video>
      <Controls
        isPaused={isPaused}
        isMute={isMute}
        volumePercent={volume}
        isFullScreen={isFullScreen}
        show={showControls || isPaused}
        currVideoTime={currVideoTime}
        leftVideoTime={videoDuration - currVideoTime}
        seekVideoTo={seekVideoTo}
        onPlayPause={togglePlayPause}
        onMuteUnmute={muteUnmute}
        updateVolume={updateVolume}
        onFullScreenCollapse={expandCollapseVideo}
      />
    </div>
  );
};

export default VideoPlayer;

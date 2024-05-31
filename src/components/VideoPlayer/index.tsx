"use client";

import React, { useState, useEffect, useRef } from "react";

import styles from "./VideoPlayer.module.css";
import Controls from "../Controls";

const VideoPlayer = () => {
  const [showControls, setShowControls] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [currVideoTime, setCurrVideoTime] = useState<number>(0);

  // refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const contRef = useRef<HTMLDivElement | null>(null);
  const showControlsRef = useRef<NodeJS.Timeout>();
  const fullScreenBtnRef = useRef<HTMLButtonElement | null>(null);

  // mouse states
  // const [isMouseLeft, setIsMouseLeft] = useState<boolean>(false);
  // const [isMouseMoving, setIsMouseMoving] = useState<boolean>(false);
  //+ REMOVED THESE STATES AND STILL DEVELOPING, WILL BE ADDED IF ANY BUGS FOUND

  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  const togglePlayPause: () => void = () => {
    console.log("play/pause triggered");
    const video = videoRef.current;
    if (video) {
      if (video.paused) {
        console.log("playing");
        setIsPaused(false);
        video.play();
      } else {
        console.log("paused");
        setIsPaused(true);
        video.pause();
      }
    }
  };

  const expandCollapseVideo: () => void = () => {
    const container = contRef.current;
    console.log(isFullScreen);
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

  const showControlsFor = (n: number, callback?: () => void): void => {
    setShowControls(true);
    clearTimeout(showControlsRef.current);
    showControlsRef.current = setTimeout(() => {
      setShowControls(false);
      if (callback) callback();
    }, n * 1000);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      setVideoDuration(video.duration);

      // mouse events
      video.addEventListener("mouseleave", () => {
        // setIsMouseLeft(true);
        // showControlsFor(2, () => setIsMouseLeft(false));
        showControlsFor(2);
      });
      video.addEventListener("mousemove", () => {
        // setIsMouseMoving(true);
        // showControlsFor(2, () => setIsMouseMoving(false));
        showControlsFor(2);
      });

      const listener: (e: KeyboardEvent) => void = (e) => {
        console.log(e.key);
        if (e.key === "f") {
          expandCollapseVideo();
        } else if ([" ", "k"].includes(e.key)) {
          console.log("play or pause");
          togglePlayPause();
        } else if (["l", "ArrowRight"].includes(e.key)) {
          video.currentTime += 5;
        } else if (["j", "ArrowLeft"].includes(e.key)) {
          video.currentTime -= 5;
        } else if (e.key === "Escape") {
          if (isFullScreen) document.exitFullscreen().then(() => {});
        }
        showControlsFor(2);
        setCurrVideoTime(video.currentTime);
      };
      document.addEventListener("keyup", listener);

      return () => {
        document.removeEventListener("keyup", listener);
      };
    }
  }, [videoRef, expandCollapseVideo]);

  useEffect(() => {
    if (isPaused) return;

    const updateCurrentTime = () => {
      const currentTime = videoRef.current?.currentTime;
      if (videoDuration != null && currentTime != null) {
        setCurrVideoTime(currentTime);
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
      <video className={styles.video} ref={videoRef} muted>
        <source src="/videos/ocean.mp4" type="video/mp4" />
      </video>
      <Controls
        show={showControls || isPaused}
        isPaused={isPaused}
        isFullScreen={isFullScreen}
        currVideoTime={currVideoTime}
        leftVideoTime={videoDuration - currVideoTime}
        onPlayPause={togglePlayPause}
        onFullScreenCollapse={expandCollapseVideo}
      />
    </div>
  );
};

export default VideoPlayer;

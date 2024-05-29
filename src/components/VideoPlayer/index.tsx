"use client";

import React, { useEffect, useRef, useState } from "react";

import PlayPauseBtn from "@/components/PlayPauseBtn";
import styles from "./VideoPlayer.module.css";
import FullScreenBtn from "../FullScreenBtn";

const VideoPlayer = () => {
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [currVideoTime, setCurrVideoTime] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const contRef = React.createRef<HTMLDivElement>();
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
    console.log("expand run");
    const container = contRef.current;
    let fs: boolean = isFullScreen;
    if (container) {
      console.log("Container there");
      if (fs) {
        document.exitFullscreen().then(() => setIsFullScreen(false));
        console.log("Full Screen exiting");
      } else {
        container.requestFullscreen().then(() => setIsFullScreen(true));
        console.log("Full Screen entering");
      }
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      setVideoDuration(video.duration);
    }

    const listener: (e: KeyboardEvent) => void = (e) => {
      if (e.key === "f") {
        console.log("Expanding or Collapsing");
        expandCollapseVideo();
      } else if (e.key === "k") {
        console.log("play or pause");
        togglePlayPause();
      } else if (e.key === "Escape") {
        if (isFullScreen) document.exitFullscreen().then(() => {});
      }
    };
    document.addEventListener("keydown", listener);

    return () => document.removeEventListener("keydown", listener);
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const updateCurrentTime = () => {
      const currentTime = videoRef.current?.currentTime;
      if (videoDuration != null && currentTime != null) {
        setCurrVideoTime(currentTime);
      }
    };

    const intervalId = setInterval(updateCurrentTime, 200);

    return () => {
      clearInterval(intervalId);
    };
  }, [currVideoTime, videoDuration, isPaused]);

  const formatTime = (time: number): string => {
    let min: number = Math.floor(time / 60);
    let sec: number = Math.floor(time % 60);
    return `${min.toString().padStart(2, "0")} : ${sec
      .toString()
      .padStart(2, "0")}`;
  };
  return (
    <div
      className={`${styles.videoContainer} ${
        isFullScreen ? styles.fullScreenVideo : ""
      }`}
      ref={contRef}
    >
      <video className={styles.video} ref={videoRef} autoPlay loop muted>
        <source src="videos/ocean.mp4" type="video/mp4" />
      </video>
      <div className={styles.videoControlsContainer}>
        <div className={styles.videoTimeline}></div>
        <div className={styles.controls}>
          <div className={styles.leftControls}>
            <PlayPauseBtn paused={isPaused} onPlayPause={togglePlayPause} />
            <div>{`${formatTime(Math.round(currVideoTime))} / ${formatTime(
              Math.round(videoDuration)
            )}`}</div>
          </div>
          <div className={styles.rightControls}>
            <FullScreenBtn
              isFullScreen={isFullScreen}
              onExpandCollapse={expandCollapseVideo}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;

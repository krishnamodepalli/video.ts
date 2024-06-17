"use client";

import React, { useState, useEffect } from "react";

import PlayPauseBtn from "../PlayPauseBtn";
import VolumeControls from "../Volume";
import Timeline from "../Timeline";
import FullScreenBtn from "../FullScreenBtn";

import { visualHelperEventType } from "@/interface/VisualHelper";

import styles from "../VideoPlayer/VideoPlayer.module.css";

interface controlProps {
  videoRef: React.MutableRefObject<HTMLVideoElement | null>;
  contRef: React.MutableRefObject<HTMLDivElement | null>;
  isPaused: boolean;
  volume: number;
  show: boolean;
  isFullScreen: boolean;
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
  setVolume: React.Dispatch<React.SetStateAction<number>>;
  setIsFullScreen: React.Dispatch<React.SetStateAction<boolean>>;
  showControlsFor: (time: number) => void;
  showVisualHelper: (helperEvent: visualHelperEventType) => void;
}

const Controls = ({
  videoRef,
  contRef,
  isPaused,
  volume,
  isFullScreen,
  show,
  setIsPaused,
  setVolume,
  setIsFullScreen,
  showControlsFor,
  showVisualHelper,
}: controlProps): JSX.Element => {
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [currVideoTime, setCurrVideoTime] = useState<number>(0);
  const [isMute, setIsMute] = useState<boolean>(false);

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

  const toggleMuteUnmute: () => void = () => {
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

  const updateVolume: (vol: number) => void = (vol: number) => {
    const video = videoRef.current;
    if (video) {
      console.log("input: " + vol);
      setVolume(vol);
      if (vol > video.volume * 100) showVisualHelper("volume-high");
      else if (vol === 0) showVisualHelper("mute");
      else showVisualHelper("volume-low");
      video.volume = vol / 100;
    }
  };

  const toggleExpandCollapseVideo: () => void = () => {
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

  const seekVideoTo = (toPercent: number): void => {
    const video = videoRef.current;
    if (video) {
      const time = toPercent * videoDuration;
      video.currentTime = time;
      setCurrVideoTime(time);
      video.volume = 0.7;
    }
    // showControlsFor(2);
  };

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

  const Time = ({ time }: { time: number }): JSX.Element => (
    <div className={styles.time}>{formatTime(Math.round(time))}</div>
  );

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
          toggleExpandCollapseVideo();
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
          toggleMuteUnmute();
        } else if (e.key === "Escape") {
          // FIXME This is showing some big time error, please fix ASAP
          console.log("escape ran");
          e.preventDefault();
          if (isFullScreen) toggleExpandCollapseVideo();
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
  }, [videoRef, toggleExpandCollapseVideo]);

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
      className={`${styles.videoControlsContainer} ${show ? "" : styles.hidden}`}>
      {/* // <div className={`${styles.videoControlsContainer} ${}`}> */}
      <div className={styles.controls}>
        <PlayPauseBtn paused={isPaused} onPlayPause={togglePlayPause} />
        <VolumeControls
          isMute={isMute}
          volumePercent={volume}
          onMuteUnmute={toggleMuteUnmute}
          updateVolume={updateVolume}
        />
        <Time time={currVideoTime} />
        <Timeline
          isPaused={isPaused}
          seekVideo={seekVideoTo}
          progressPercent={(currVideoTime / videoDuration) * 100}
        />
        <Time time={videoDuration - currVideoTime} />
        <FullScreenBtn
          isFullScreen={isFullScreen}
          onExpandCollapse={toggleExpandCollapseVideo}
        />
      </div>
    </div>
  );
};

export default Controls;

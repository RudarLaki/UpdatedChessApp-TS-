import React, { useEffect } from "react";
import { useTimer } from "react-timer-hook";

type MyTimerProps = {
  expiryTimestamp: Date;
  isRunning: boolean;
};

const MyTimer: React.FC<MyTimerProps> = ({ expiryTimestamp, isRunning }) => {
  const { seconds, minutes, resume, pause } = useTimer({
    expiryTimestamp,
    onExpire: () => console.warn("onExpire called"),
    interval: 20,
  });
  useEffect(() => {
    if (!isRunning) pause();
    if (isRunning) resume();
  }, [isRunning, pause, resume]);

  return (
    <div className="clock">
      <span>{String(minutes).padStart(2, "0")}</span>:
      <span>{String(seconds).padStart(2, "0")}</span>
    </div>
  );
};

export default MyTimer;

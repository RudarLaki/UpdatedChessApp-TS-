import React, { useEffect, useRef, useState } from "react";

type MyTimerProps = {
  start: number;
  isRunning: boolean;
  incrementSeconds?: number;
};

const MyTimer: React.FC<MyTimerProps> = ({
  start,
  isRunning,
  incrementSeconds = 5,
}) => {
  const [timeLeft, setTimeLeft] = useState(start);
  const prevRunning = useRef(isRunning);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => Math.max(t - 1, 0));
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  useEffect(() => {
    if (prevRunning.current && !isRunning) {
      setTimeLeft((t) => t + incrementSeconds);
    }
    prevRunning.current = isRunning;
  }, [isRunning, incrementSeconds]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="clock">
      {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
    </div>
  );
};

export default MyTimer;

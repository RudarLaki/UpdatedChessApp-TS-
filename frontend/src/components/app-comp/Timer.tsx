import React, { useEffect, useRef, useState } from "react";

type MyTimerProps = {
  start: number; // e.g. 5 for 5:00
  isRunning: boolean;
  incrementSeconds?: number; // default 5 seconds
};

const MyTimer: React.FC<MyTimerProps> = ({
  start,
  isRunning,
  incrementSeconds = 5,
}) => {
  const [timeLeft, setTimeLeft] = useState(start); // seconds left
  const prevRunning = useRef(isRunning);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Start/stop ticking
  useEffect(() => {
    if (isRunning) {
      // Start interval
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => Math.max(t - 1, 0));
      }, 1000);
    } else {
      // Stop interval
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  // Detect turn end → add increment
  useEffect(() => {
    if (prevRunning.current && !isRunning) {
      setTimeLeft((t) => t + incrementSeconds);
    }
    prevRunning.current = isRunning;
  }, [isRunning, incrementSeconds]);

  // Format as MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="clock">
      {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
    </div>
  );
};

export default MyTimer;

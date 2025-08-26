export const playSound = (fileName: string) => {
  const audio = new Audio(`/sounds/${fileName}.mp3`);
  audio.play().catch((err) => {
    console.warn("Audio playback failed:", err);
  });
};

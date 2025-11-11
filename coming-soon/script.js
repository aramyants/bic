const pad = (value) => value.toString().padStart(2, "0");

const getCountdownTarget = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const novemberDeadline = new Date(currentYear, 10, 30, 23, 59, 59);
  if (now > novemberDeadline) {
    return new Date(currentYear + 1, 10, 30, 23, 59, 59);
  }
  return novemberDeadline;
};

let countdownTarget = getCountdownTarget();

const daysRef = document.getElementById("days");
const hoursRef = document.getElementById("hours");
const minutesRef = document.getElementById("minutes");
const secondsRef = document.getElementById("seconds");

function updateCountdown() {
  const now = new Date();
  const diff = countdownTarget - now;

  if (diff <= 0) {
    countdownTarget = getCountdownTarget();
    daysRef.textContent = "00";
    hoursRef.textContent = "00";
    minutesRef.textContent = "00";
    secondsRef.textContent = "00";
    return;
  }

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  daysRef.textContent = pad(days);
  hoursRef.textContent = pad(hours % 24);
  minutesRef.textContent = pad(minutes % 60);
  secondsRef.textContent = pad(seconds % 60);
}

updateCountdown();
setInterval(updateCountdown, 1000);

const notifyState = document.getElementById("notify-state");
if (notifyState) {
  notifyState.textContent =
    "Следите за обновлениями в наших площадках, чтобы не пропустить старт.";
}

const bgVideo = document.getElementById("bg-video");
if (bgVideo) {
  const videoPlaylist = [
    "https://videos.pexels.com/video-files/32098956/13684272_1920_1080_24fps.mp4",
    "https://videos.pexels.com/video-files/31167983/13315525_1920_1080_60fps.mp4",
    "./bg_video.mp4",
  ];
  let videoIndex = 0;

  const playVideo = (index = 0) => {
    videoIndex = index % videoPlaylist.length;
    const nextSrc = videoPlaylist[videoIndex];
    if (bgVideo.getAttribute("src") !== nextSrc) {
      bgVideo.setAttribute("src", nextSrc);
      bgVideo.load();
    }
    const promise = bgVideo.play();
    if (promise && promise.catch) {
      promise.catch(() => {});
    }
  };

  bgVideo.addEventListener("ended", () => playVideo(videoIndex + 1));
  bgVideo.addEventListener("error", () => playVideo(videoIndex + 1));
  bgVideo.addEventListener("loadeddata", () => {
    if (bgVideo.paused) {
      bgVideo.play().catch(() => {});
    }
  });

  playVideo(0);
}

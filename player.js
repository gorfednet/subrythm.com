const albums = {
  "Subrythm - Preliminary Muse": {
    art: "./assets/audio/Subrythm%20-%20Preliminary%20Muse/albumcover.jpg",
    tracks: [
      "Subrythm - Preminary Muse - 01 - Aunt Rhodie.mp3",
      "Subrythm - Preminary Muse - 02 - BJ 333 Part 1.mp3",
      "Subrythm - Preminary Muse - 03 - Blessed.mp3",
      "Subrythm - Preminary Muse - 04 - Defubble... Absolutely No Message.mp3",
      "Subrythm - Preminary Muse - 05 - Cramsion.mp3",
      "Subrythm - Preminary Muse - 06 - De+Re Construct.mp3",
      "Subrythm - Preminary Muse - 07 - Deranged (vinyl).mp3",
      "Subrythm - Preminary Muse - 08 - If Only Logic Were A Factor.mp3",
      "Subrythm - Preminary Muse - 09 - BJ 333 Part 2.mp3",
      "Subrythm - Preminary Muse - 10 - Ask Why Not.mp3"
    ]
  },
  "Subrythm - Tekkyes": {
    art: "./assets/audio/Subrythm%20-%20Tekkyes/albumcover.jpg",
    tracks: [
      "Subrythm - Tekkyes - 01 - Delish.mp3",
      "Subrythm - Tekkyes - 02 -Sub Delta.mp3",
      "Subrythm - Tekkyes - 03 - Fortythree.mp3",
      "Subrythm - Tekkyes - 04 - Tekkyes Part 1.mp3",
      "Subrythm - Tekkyes - 05 - Tekkyes Part 2.mp3",
      "Subrythm - Tekkyes - 06 - Sub Alpha.mp3",
      "Subrythm - Tekkyes - 07 - Square.mp3",
      "Subrythm - Tekkyes - 08 - SFLau.mp3",
      "Subrythm - Tekkyes - 09 - Done Wrasled.mp3",
      "Subrythm - Tekkyes - 10 - BJ 333 Remix.mp3",
      "Subrythm - Tekkyes - 11 - 43 (Modermelodie Remix).mp3"
    ]
  }
};

const allTracks = Object.entries(albums).flatMap(([album, data]) =>
  data.tracks.map((filename) => ({ album, filename, art: data.art }))
);

const audio = document.getElementById("audio-player");
const albumArt = document.getElementById("album-art");
const currentTrackTitle = document.getElementById("current-track-title");
const currentAlbumTitle = document.getElementById("current-album-title");
const playBtn = document.getElementById("play-btn");
const playIconPath = document.getElementById("play-icon-path");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const shuffleBtn = document.getElementById("shuffle-btn");
const muteBtn = document.getElementById("mute-btn");
const muteWave1 = document.getElementById("mute-wave-1");
const muteWave2 = document.getElementById("mute-wave-2");
const seekSlider = document.getElementById("seek-slider");
const currentTimeText = document.getElementById("current-time");
const totalTimeText = document.getElementById("total-time");

let currentTrackIndex = 0;
let isShuffleEnabled = false;

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const whole = Math.floor(seconds);
  const m = Math.floor(whole / 60);
  const s = whole % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function parseTrack(file) {
  const match = file.match(/ - (\d{2}) -\s*(.+)\.mp3$/);
  if (!match) return { number: "--", title: file.replace(".mp3", "") };
  return { number: match[1], title: match[2] };
}

function trackUrl(track) {
  return `./assets/audio/${encodeURIComponent(track.album)}/${encodeURIComponent(track.filename)}`;
}

function setPlayUi(isPlaying) {
  playIconPath.setAttribute("d", isPlaying ? "M7 5h3v14H7V5Zm7 0h3v14h-3V5Z" : "M8 5v14l11-7z");
  playBtn.setAttribute("aria-label", isPlaying ? "Pause" : "Play");
}

function setMuteUi(isMuted) {
  muteWave1.style.display = isMuted ? "none" : "block";
  muteWave2.style.display = isMuted ? "none" : "block";
  muteBtn.setAttribute("aria-label", isMuted ? "Unmute audio" : "Mute audio");
}

function setShuffleUi(isEnabled) {
  shuffleBtn.classList.toggle("is-active", isEnabled);
  shuffleBtn.setAttribute("aria-pressed", String(isEnabled));
  shuffleBtn.setAttribute("aria-label", isEnabled ? "Disable shuffle" : "Enable shuffle");
}

function setNowPlaying() {
  const track = allTracks[currentTrackIndex];
  const parsed = parseTrack(track.filename);
  albumArt.src = track.art;
  albumArt.alt = `Album art for ${track.album}`;
  currentTrackTitle.textContent = `${parsed.number} - ${parsed.title}`;
  currentAlbumTitle.textContent = track.album;
}

function loadTrack(index, autoplay = false) {
  currentTrackIndex = index;
  const track = allTracks[currentTrackIndex];
  audio.src = trackUrl(track);
  seekSlider.value = "0";
  currentTimeText.textContent = "0:00";
  totalTimeText.textContent = "0:00";
  setNowPlaying();
  if (autoplay) audio.play().catch(() => setPlayUi(false));
}

function nextTrack(autoplay = true) {
  if (isShuffleEnabled) {
    shuffleTrack();
    return;
  }
  loadTrack((currentTrackIndex + 1) % allTracks.length, autoplay);
}

function previousTrack() {
  loadTrack((currentTrackIndex - 1 + allTracks.length) % allTracks.length, true);
}

function shuffleTrack() {
  if (allTracks.length < 2) return;
  let index = currentTrackIndex;
  while (index === currentTrackIndex) index = Math.floor(Math.random() * allTracks.length);
  loadTrack(index, true);
}

playBtn.addEventListener("click", () => {
  if (audio.paused) audio.play().catch(() => setPlayUi(false));
  else audio.pause();
});
prevBtn.addEventListener("click", previousTrack);
nextBtn.addEventListener("click", () => nextTrack(true));
shuffleBtn.addEventListener("click", () => {
  isShuffleEnabled = !isShuffleEnabled;
  setShuffleUi(isShuffleEnabled);
});
muteBtn.addEventListener("click", () => {
  audio.muted = !audio.muted;
  if (!audio.muted) {
    audio.volume = 1;
  }
  setMuteUi(audio.muted);
});

seekSlider.addEventListener("input", () => {
  if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
  audio.currentTime = (Number(seekSlider.value) / 100) * audio.duration;
});
audio.addEventListener("loadedmetadata", () => {
  totalTimeText.textContent = formatTime(audio.duration);
});
audio.addEventListener("timeupdate", () => {
  if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
  seekSlider.value = String((audio.currentTime / audio.duration) * 100);
  currentTimeText.textContent = formatTime(audio.currentTime);
});
audio.addEventListener("ended", () => nextTrack(true));
audio.addEventListener("play", () => setPlayUi(true));
audio.addEventListener("pause", () => setPlayUi(false));

audio.volume = 1;
setPlayUi(false);
setMuteUi(false);
setShuffleUi(false);
loadTrack(0, false);

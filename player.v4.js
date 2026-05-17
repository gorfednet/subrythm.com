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

const audio = document.getElementById("audio-player");
const albumSelect = document.getElementById("album-select");
const albumArt = document.getElementById("album-art");
const trackList = document.getElementById("track-list");
const currentTrackTitle = document.getElementById("current-track-title");
const playBtn = document.getElementById("play-btn");
const playIcon = document.getElementById("play-icon");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const shuffleBtn = document.getElementById("shuffle-btn");
const muteBtn = document.getElementById("mute-btn");
const muteIcon = document.getElementById("mute-icon");
const seekSlider = document.getElementById("seek-slider");
const volumeSlider = document.getElementById("volume-slider");
const currentTimeText = document.getElementById("current-time");
const totalTimeText = document.getElementById("total-time");

let currentAlbum = albumSelect.value;
let currentTrackIndex = 0;
const durationCache = new Map();

function trackUrl(album, file) {
  return `./assets/audio/${encodeURIComponent(album)}/${encodeURIComponent(file)}`;
}

function readableTitle(file) {
  const parts = file.split(" - ");
  return parts.length >= 4 ? parts.slice(3).join(" - ").replace(".mp3", "") : file.replace(".mp3", "");
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const total = Math.floor(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function setPlayUi(isPlaying) {
  playIcon.textContent = isPlaying ? "\u23F8" : "\u25B6";
  playBtn.setAttribute("aria-label", isPlaying ? "Pause" : "Play");
}

function setMuteUi(isMuted) {
  muteIcon.textContent = isMuted ? "\uD83D\uDD07" : "\uD83D\uDD0A";
  muteBtn.setAttribute("aria-label", isMuted ? "Unmute audio" : "Mute audio");
}

function markActive() {
  [...trackList.querySelectorAll(".track-list-item")].forEach((btn, idx) => {
    btn.classList.toggle("is-active", idx === currentTrackIndex);
    btn.setAttribute("aria-current", idx === currentTrackIndex ? "true" : "false");
  });
}

async function getTrackDuration(album, track) {
  const key = `${album}::${track}`;
  if (durationCache.has(key)) return durationCache.get(key);
  const value = await new Promise((resolve) => {
    const probe = new Audio();
    probe.preload = "metadata";
    probe.src = trackUrl(album, track);
    probe.addEventListener("loadedmetadata", () => resolve(formatTime(probe.duration)), { once: true });
    probe.addEventListener("error", () => resolve("--:--"), { once: true });
  });
  durationCache.set(key, value);
  return value;
}

function loadTrack(index, autoplay = false) {
  currentTrackIndex = index;
  const track = albums[currentAlbum].tracks[currentTrackIndex];
  audio.src = trackUrl(currentAlbum, track);
  currentTrackTitle.textContent = readableTitle(track);
  seekSlider.value = "0";
  currentTimeText.textContent = "0:00";
  totalTimeText.textContent = "0:00";
  markActive();
  if (autoplay) audio.play().catch(() => setPlayUi(false));
}

function nextTrack(autoplay = true) {
  const list = albums[currentAlbum].tracks;
  loadTrack((currentTrackIndex + 1) % list.length, autoplay);
}

function previousTrack() {
  const list = albums[currentAlbum].tracks;
  loadTrack((currentTrackIndex - 1 + list.length) % list.length, true);
}

function shuffleTrack() {
  const list = albums[currentAlbum].tracks;
  if (list.length < 2) return;
  let index = currentTrackIndex;
  while (index === currentTrackIndex) index = Math.floor(Math.random() * list.length);
  loadTrack(index, true);
}

function renderAlbum() {
  const data = albums[currentAlbum];
  albumArt.src = data.art;
  albumArt.alt = `Album art for ${currentAlbum}`;
  trackList.innerHTML = "";
  data.tracks.forEach((track, index) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "track-list-item";
    btn.dataset.index = String(index);
    btn.innerHTML = `<span class="track-title">${String(index + 1).padStart(2, "0")} - ${readableTitle(track)}</span><span class="track-time">--:--</span>`;
    btn.addEventListener("click", () => loadTrack(index, true));
    li.append(btn);
    trackList.append(li);
  });
  data.tracks.forEach(async (track, index) => {
    const duration = await getTrackDuration(currentAlbum, track);
    const el = trackList.querySelector(`.track-list-item[data-index="${index}"] .track-time`);
    if (el) el.textContent = duration;
  });
  loadTrack(0, false);
}

albumSelect.addEventListener("change", (e) => {
  currentAlbum = e.target.value;
  renderAlbum();
});

playBtn.addEventListener("click", () => {
  if (audio.paused) audio.play().catch(() => setPlayUi(false));
  else audio.pause();
});
prevBtn.addEventListener("click", previousTrack);
nextBtn.addEventListener("click", () => nextTrack(true));
shuffleBtn.addEventListener("click", shuffleTrack);
muteBtn.addEventListener("click", () => {
  audio.muted = !audio.muted;
  setMuteUi(audio.muted);
});

seekSlider.addEventListener("input", () => {
  if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
  audio.currentTime = (Number(seekSlider.value) / 100) * audio.duration;
});
volumeSlider.addEventListener("input", () => {
  audio.volume = Number(volumeSlider.value);
});

audio.addEventListener("loadedmetadata", () => {
  totalTimeText.textContent = formatTime(audio.duration);
});
audio.addEventListener("timeupdate", () => {
  if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
  seekSlider.value = String((audio.currentTime / audio.duration) * 100);
  currentTimeText.textContent = formatTime(audio.currentTime);
});
audio.addEventListener("play", () => setPlayUi(true));
audio.addEventListener("pause", () => setPlayUi(false));
audio.addEventListener("ended", () => nextTrack(true));

audio.volume = Number(volumeSlider.value);
setPlayUi(false);
setMuteUi(false);
renderAlbum();

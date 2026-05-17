const library = {
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

const flatTracks = Object.entries(library).flatMap(([album, data]) =>
  data.tracks.map((filename) => ({ album, filename, art: data.art }))
);

const audio = document.getElementById("audio-player");
const trackList = document.getElementById("track-list");
const albumArt = document.getElementById("album-art");
const currentTrackTitle = document.getElementById("current-track-title");
const currentAlbumTitle = document.getElementById("current-album-title");
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

let currentTrackIndex = 0;
const durationCache = new Map();

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const whole = Math.floor(seconds);
  const m = Math.floor(whole / 60);
  const s = whole % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function readableTitle(filename) {
  const parts = filename.split(" - ");
  return parts.length >= 4 ? parts.slice(3).join(" - ").replace(".mp3", "") : filename.replace(".mp3", "");
}

function trackUrl(track) {
  return `./assets/audio/${encodeURIComponent(track.album)}/${encodeURIComponent(track.filename)}`;
}

function setPlayUi(isPlaying) {
  playIcon.textContent = isPlaying ? "\u23F8" : "\u25B6";
  playBtn.setAttribute("aria-label", isPlaying ? "Pause" : "Play");
}

function setMuteUi(isMuted) {
  muteIcon.textContent = isMuted ? "\uD83D\uDD07" : "\uD83D\uDD0A";
  muteBtn.setAttribute("aria-label", isMuted ? "Unmute audio" : "Mute audio");
}

function setNowPlaying() {
  const track = flatTracks[currentTrackIndex];
  albumArt.src = track.art;
  albumArt.alt = `Album art for ${track.album}`;
  currentTrackTitle.textContent = readableTitle(track.filename);
  currentAlbumTitle.textContent = track.album;
}

function markActiveRow() {
  [...trackList.querySelectorAll(".track-list-item")].forEach((btn, idx) => {
    btn.classList.toggle("is-active", idx === currentTrackIndex);
    btn.setAttribute("aria-current", idx === currentTrackIndex ? "true" : "false");
  });
}

async function measureDuration(track) {
  const key = `${track.album}::${track.filename}`;
  if (durationCache.has(key)) return durationCache.get(key);
  const value = await new Promise((resolve) => {
    const probe = new Audio();
    probe.preload = "metadata";
    probe.src = trackUrl(track);
    probe.addEventListener("loadedmetadata", () => resolve(formatTime(probe.duration)), { once: true });
    probe.addEventListener("error", () => resolve("--:--"), { once: true });
  });
  durationCache.set(key, value);
  return value;
}

function loadTrack(index, autoplay = false) {
  currentTrackIndex = index;
  const track = flatTracks[currentTrackIndex];
  audio.src = trackUrl(track);
  seekSlider.value = "0";
  currentTimeText.textContent = "0:00";
  totalTimeText.textContent = "0:00";
  setNowPlaying();
  markActiveRow();
  if (autoplay) {
    audio.play().catch(() => setPlayUi(false));
  }
}

function nextTrack(autoplay = true) {
  const next = (currentTrackIndex + 1) % flatTracks.length;
  loadTrack(next, autoplay);
}

function previousTrack() {
  const prev = (currentTrackIndex - 1 + flatTracks.length) % flatTracks.length;
  loadTrack(prev, true);
}

function shuffleTrack() {
  if (flatTracks.length < 2) return;
  let index = currentTrackIndex;
  while (index === currentTrackIndex) index = Math.floor(Math.random() * flatTracks.length);
  loadTrack(index, true);
}

async function renderTrackList() {
  trackList.innerHTML = "";
  flatTracks.forEach((track, index) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "track-list-item";
    btn.dataset.index = String(index);
    btn.innerHTML = `
      <img src="${track.art}" alt="" class="track-thumb">
      <span class="track-album">${track.album.replace("Subrythm - ", "")}</span>
      <span class="track-title">${String(index + 1).padStart(2, "0")} - ${readableTitle(track.filename)}</span>
      <span class="track-time">--:--</span>
    `;
    btn.addEventListener("click", () => loadTrack(index, true));
    li.append(btn);
    trackList.append(li);
  });
  markActiveRow();

  flatTracks.forEach(async (track, index) => {
    const duration = await measureDuration(track);
    const el = trackList.querySelector(`.track-list-item[data-index="${index}"] .track-time`);
    if (el) el.textContent = duration;
  });
}

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
audio.addEventListener("ended", () => nextTrack(true));
audio.addEventListener("play", () => setPlayUi(true));
audio.addEventListener("pause", () => setPlayUi(false));

audio.volume = Number(volumeSlider.value);
setMuteUi(false);
setPlayUi(false);
renderTrackList();
loadTrack(0, false);

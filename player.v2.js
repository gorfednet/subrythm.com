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

const audio = document.getElementById("audio-player");
const albumTabs = [...document.querySelectorAll(".album-tab")];
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

const trackDurationCache = new Map();
let currentAlbum = "Subrythm - Preliminary Muse";
let currentTrackIndex = 0;

function trackUrl(album, filename) {
  return `./assets/audio/${encodeURIComponent(album)}/${encodeURIComponent(filename)}`;
}

function readableTitle(filename) {
  const split = filename.split(" - ");
  return split.length >= 4 ? split.slice(3).join(" - ").replace(".mp3", "") : filename.replace(".mp3", "");
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }
  const total = Math.floor(seconds);
  const min = Math.floor(total / 60);
  const sec = total % 60;
  return `${min}:${String(sec).padStart(2, "0")}`;
}

function cacheKey(album, filename) {
  return `${album}::${filename}`;
}

function setPlayUi(isPlaying) {
  playIcon.textContent = isPlaying ? "\u23F8" : "\u25B6";
  playBtn.setAttribute("aria-label", isPlaying ? "Pause" : "Play");
}

function setMuteUi(isMuted) {
  muteIcon.textContent = isMuted ? "\uD83D\uDD07" : "\uD83D\uDD0A";
  muteBtn.setAttribute("aria-label", isMuted ? "Unmute audio" : "Mute audio");
}

function markActiveTrack() {
  [...trackList.querySelectorAll(".track-list-item")].forEach((button, index) => {
    button.classList.toggle("is-active", index === currentTrackIndex);
    button.setAttribute("aria-current", index === currentTrackIndex ? "true" : "false");
  });
}

async function loadDurationForTrack(album, filename) {
  const key = cacheKey(album, filename);
  if (trackDurationCache.has(key)) {
    return trackDurationCache.get(key);
  }
  const duration = await new Promise((resolve) => {
    const probe = new Audio();
    probe.preload = "metadata";
    probe.src = trackUrl(album, filename);
    probe.addEventListener("loadedmetadata", () => resolve(probe.duration), { once: true });
    probe.addEventListener("error", () => resolve(NaN), { once: true });
  });
  const text = formatTime(duration);
  trackDurationCache.set(key, text);
  return text;
}

function renderAlbumTabs() {
  albumTabs.forEach((tab) => {
    const isActive = tab.dataset.album === currentAlbum;
    tab.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
}

function updateAlbumArt() {
  const data = library[currentAlbum];
  albumArt.src = data.art;
  albumArt.alt = `Album art for ${currentAlbum}`;
  currentAlbumTitle.textContent = currentAlbum;
}

async function renderTrackList() {
  trackList.innerHTML = "";
  const tracks = library[currentAlbum].tracks;
  tracks.forEach((filename, index) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "track-list-item";
    btn.dataset.index = String(index);
    btn.innerHTML = `<span class="track-title">${String(index + 1).padStart(2, "0")} - ${readableTitle(filename)}</span><span class="track-time">--:--</span>`;
    btn.addEventListener("click", () => loadTrack(index, true));
    li.append(btn);
    trackList.append(li);
  });
  markActiveTrack();

  tracks.forEach(async (filename, index) => {
    const durationText = await loadDurationForTrack(currentAlbum, filename);
    const item = trackList.querySelector(`.track-list-item[data-index="${index}"] .track-time`);
    if (item) {
      item.textContent = durationText;
    }
  });
}

function setCurrentTrackText() {
  const track = library[currentAlbum].tracks[currentTrackIndex];
  currentTrackTitle.textContent = readableTitle(track);
}

function loadTrack(index, autoplay = false) {
  currentTrackIndex = index;
  const filename = library[currentAlbum].tracks[currentTrackIndex];
  audio.src = trackUrl(currentAlbum, filename);
  setCurrentTrackText();
  currentTimeText.textContent = "0:00";
  totalTimeText.textContent = "0:00";
  seekSlider.value = "0";
  markActiveTrack();
  if (autoplay) {
    audio.play().catch(() => {
      setPlayUi(false);
    });
  }
}

function switchAlbum(albumName) {
  currentAlbum = albumName;
  currentTrackIndex = 0;
  renderAlbumTabs();
  updateAlbumArt();
  renderTrackList();
  loadTrack(0, false);
}

function nextTrack(autoplay = true) {
  const tracks = library[currentAlbum].tracks;
  const next = (currentTrackIndex + 1) % tracks.length;
  loadTrack(next, autoplay);
}

function previousTrack() {
  const tracks = library[currentAlbum].tracks;
  const prev = (currentTrackIndex - 1 + tracks.length) % tracks.length;
  loadTrack(prev, true);
}

function shuffleTrack() {
  const tracks = library[currentAlbum].tracks;
  if (tracks.length < 2) {
    return;
  }
  let randomIndex = currentTrackIndex;
  while (randomIndex === currentTrackIndex) {
    randomIndex = Math.floor(Math.random() * tracks.length);
  }
  loadTrack(randomIndex, true);
}

albumTabs.forEach((tab) => {
  tab.addEventListener("click", () => switchAlbum(tab.dataset.album));
});

playBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play().catch(() => setPlayUi(false));
  } else {
    audio.pause();
  }
});

prevBtn.addEventListener("click", previousTrack);
nextBtn.addEventListener("click", () => nextTrack(true));
shuffleBtn.addEventListener("click", shuffleTrack);

muteBtn.addEventListener("click", () => {
  audio.muted = !audio.muted;
  setMuteUi(audio.muted);
});

seekSlider.addEventListener("input", () => {
  if (!Number.isFinite(audio.duration) || audio.duration <= 0) {
    return;
  }
  audio.currentTime = (Number(seekSlider.value) / 100) * audio.duration;
});

volumeSlider.addEventListener("input", () => {
  audio.volume = Number(volumeSlider.value);
});

audio.addEventListener("timeupdate", () => {
  if (!Number.isFinite(audio.duration) || audio.duration <= 0) {
    return;
  }
  const progress = (audio.currentTime / audio.duration) * 100;
  seekSlider.value = String(progress);
  currentTimeText.textContent = formatTime(audio.currentTime);
  totalTimeText.textContent = formatTime(audio.duration);
});

audio.addEventListener("loadedmetadata", () => {
  totalTimeText.textContent = formatTime(audio.duration);
});

audio.addEventListener("ended", () => nextTrack(true));
audio.addEventListener("play", () => setPlayUi(true));
audio.addEventListener("pause", () => setPlayUi(false));

audio.volume = Number(volumeSlider.value);
setMuteUi(false);
setPlayUi(false);
switchAlbum(currentAlbum);

/* ================= AUTO DETECT SURAT FROM URL ================= */
(function () {
  const p = location.pathname.split("/").filter(Boolean);
  if (p[0] === "surat" && p[1]) {
    window.SURAT_ID = parseInt(p[1].split("-")[0]);
  }
})();
const id = window.SURAT_ID || 1;

/* ================= ELEMENTS ================= */
const content = document.getElementById("content");
const audio = document.getElementById("player"); // ✅ FIX
const wrap = document.getElementById("playerWrap");
const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const closeBtn = document.getElementById("closeBtn");
const progress = document.getElementById("progress");
const volume = document.getElementById("volume");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const trackTitle = document.getElementById("trackTitle");
const suratSelect = document.getElementById("suratSelect");

/* ================= STATE ================= */
let surahData = null;
let ayatEls = [];
let currentIndex = -1;

/* ================= HELPERS ================= */
function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}
function slugify(t) {
  return t.toLowerCase().replace(/['’]/g, "").replace(/\s+/g, "-");
}

/* ================= LOAD SURAT LIST ================= */
async function loadSurahList() {
  const r = await fetch("https://equran.id/api/v2/surat");
  const j = await r.json();
  j.data.forEach(s => {
    const o = document.createElement("option");
    o.value = s.nomor;
    o.textContent = `${s.nomor}. ${s.namaLatin}`;
    if (s.nomor === id) o.selected = true;
    suratSelect.appendChild(o);
  });
}
suratSelect.onchange = e => {
  const n = +e.target.value;
  location.href = `/surat/${n}-${slugify(e.target.options[e.target.selectedIndex].text.split(". ")[1])}/`;
};

/* ================= LOAD SURAH ================= */
async function loadSurah() {
  const r = await fetch(`https://equran.id/api/v2/surat/${id}`);
  const j = await r.json();
  surahData = j.data;

  document.title = `QS ${surahData.namaLatin} (${surahData.nama})`;

  surahData.ayat.forEach((a, i) => {
    const el = document.createElement("div");
    el.className = "ayat";
    el.innerHTML = `
      <button class="playAyat">▶</button>
      <div class="arab ayah-text">${a.teksArab}</div>
      <div class="arti">${a.teksIndonesia}</div>
    `;
    el.querySelector(".playAyat").onclick = () => playAyat(i);
    content.appendChild(el);
    ayatEls.push(el);
  });
}

/* ================= PLAY AYAT ================= */
function playAyat(i) {
  currentIndex = i;
  const a = surahData.ayat[i];
  audio.src = a.audio["05"];
  trackTitle.textContent = `QS ${surahData.namaLatin} ${surahData.nomor}:${a.nomorAyat}`;
  wrap.classList.add("show");
  audio.play();
}

/* ================= PLAYER ================= */
playBtn.onclick = () => audio.paused ? audio.play() : audio.pause();
prevBtn.onclick = () => { if (currentIndex > 0) playAyat(currentIndex - 1); };
nextBtn.onclick = () => { if (currentIndex < ayatEls.length - 1) playAyat(currentIndex + 1); };
closeBtn.onclick = () => { audio.pause(); wrap.classList.remove("show"); };

audio.ontimeupdate = () => {
  progress.value = audio.currentTime;
  currentTimeEl.textContent = formatTime(audio.currentTime);
};
audio.onloadedmetadata = () => {
  progress.max = audio.duration;
  durationEl.textContent = formatTime(audio.duration);
};
progress.oninput = () => audio.currentTime = progress.value;
volume.oninput = () => audio.volume = volume.value;

/* ================= INIT ================= */
loadSurahList();
loadSurah();

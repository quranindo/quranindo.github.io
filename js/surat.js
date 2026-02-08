document.addEventListener("DOMContentLoaded", () => {

  /* ================== AMBIL ID SURAT DARI URL ================== */
  const path = location.pathname.split("/").filter(Boolean);
  const SURAH_ID = (path[0] === "surat" && path[1]) ? parseInt(path[1]) : 1;

  /* ================== ELEMENT ================== */
  const audio = document.getElementById("player");
  const wrap = document.getElementById("playerWrap");
  const playBtn = document.getElementById("playBtn");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const closeBtn = document.getElementById("closeBtn");
  const progress = document.getElementById("progress");
  const volume = document.getElementById("volume");
  const currentTimeEl = document.getElementById("currentTime");
  const durationEl = document.getElementById("duration");
  const titleEl = document.getElementById("trackTitle");
  const content = document.getElementById("content");
  const suratSelect = document.getElementById("suratSelect");

  if (!audio) return console.error("Audio element tidak ada");

  /* ================== STATE ================== */
  let surah = null;
  let currentIndex = 0;
  let ayatTotal = 0;

  /* ================== FORMAT WAKTU ================== */
  const fmt = s => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2,'0')}`;
  };

  /* ================== LOAD DAFTAR SURAT ================== */
  fetch("https://equran.id/api/v2/surat")
    .then(r => r.json())
    .then(j => {
      j.data.forEach(s => {
        const o = document.createElement("option");
        o.value = s.nomor;
        o.textContent = `${s.nomor}. ${s.namaLatin}`;
        if (s.nomor === SURAH_ID) o.selected = true;
        suratSelect.appendChild(o);
      });
    });

  suratSelect.onchange = e => {
    const n = +e.target.value;
    const name = e.target.options[e.target.selectedIndex].text.split(". ")[1]
      .toLowerCase().replace(/\s+/g,'-');
    location.href = `/surat/${n}-${name}/`;
  };

  /* ================== LOAD SURAT ================== */
  fetch(`https://equran.id/api/v2/surat/${SURAH_ID}`)
    .then(r => r.json())
    .then(j => {
      surah = j.data;
      ayatTotal = surah.ayat.length;

      document.title = `QS ${surah.namaLatin}`;

      surah.ayat.forEach((a,i) => {
        const div = document.createElement("div");
        div.className = "ayat";
        div.innerHTML = `
          <button class="playAyat">▶</button>
          <div class="arab">${a.teksArab}</div>
          <div class="arti">${a.teksIndonesia}</div>
        `;
        div.querySelector(".playAyat").onclick = () => playAyat(i);
        content.appendChild(div);
      });
    });

  /* ================== PLAY AYAT ================== */
  function playAyat(i){
    currentIndex = i;

    const s3 = String(surah.nomor).padStart(3,'0');
    const a3 = String(surah.ayat[i].nomorAyat).padStart(3,'0');
    const file = s3 + a3;

    audio.src = `https://everyayah.com/data/Alafasy_64kbps/${file}.mp3`;
    titleEl.textContent = `QS ${surah.namaLatin} ${surah.nomor}:${surah.ayat[i].nomorAyat}`;

    wrap.classList.add("show");
    audio.play();
  }

  /* ================== TOMBOL PLAYER ================== */
  playBtn.onclick = () => audio.paused ? audio.play() : audio.pause();

  prevBtn.onclick = () => {
    if (currentIndex > 0) playAyat(currentIndex - 1);
  };

  nextBtn.onclick = () => {
    if (currentIndex < ayatTotal - 1) playAyat(currentIndex + 1);
  };

  closeBtn.onclick = () => {
    audio.pause();
    wrap.classList.remove("show");
  };

  /* ================== AUTO NEXT ================== */
  audio.onended = () => {
    if (currentIndex < ayatTotal - 1) playAyat(currentIndex + 1);
  };

  /* ================== PROGRESS ================== */
  audio.ontimeupdate = () => {
    progress.value = audio.currentTime;
    currentTimeEl.textContent = fmt(audio.currentTime);
  };

  audio.onloadedmetadata = () => {
    progress.max = audio.duration;
    durationEl.textContent = fmt(audio.duration);
  };

  progress.oninput = () => audio.currentTime = progress.value;
  volume.oninput = () => audio.volume = volume.value;

});

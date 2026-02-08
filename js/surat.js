document.addEventListener("DOMContentLoaded", () => {

  /* ========= DETEKSI ID SURAT DARI URL ========= */
  const p = location.pathname.split("/").filter(Boolean);
  const id = (p[0] === "surat" && p[1]) ? parseInt(p[1]) : 1;

  /* ========= ELEMENT ========= */
  const content = document.getElementById("content");
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
  const trackTitle = document.getElementById("trackTitle");
  const suratSelect = document.getElementById("suratSelect");

  if (!audio) return console.error("Audio element tidak ditemukan");

  /* ========= STATE ========= */
  let surahData = null;
  let ayatEls = [];
  let currentIndex = -1;

  /* ========= HELPER ========= */
  const formatTime = s => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2,'0')}`;
  };

  const slugify = t => t.toLowerCase().replace(/['’]/g,'').replace(/\s+/g,'-');

  /* ========= LOAD DAFTAR SURAT ========= */
  fetch("https://equran.id/api/v2/surat")
    .then(r => r.json())
    .then(j => {
      j.data.forEach(s => {
        const o = document.createElement("option");
        o.value = s.nomor;
        o.textContent = `${s.nomor}. ${s.namaLatin}`;
        if (s.nomor === id) o.selected = true;
        suratSelect.appendChild(o);
      });
    });

  suratSelect.onchange = e => {
    const n = +e.target.value;
    const name = e.target.options[e.target.selectedIndex].text.split(". ")[1];
    location.href = `/surat/${n}-${slugify(name)}/`;
  };

  /* ========= LOAD AYAT ========= */
  fetch(`https://equran.id/api/v2/surat/${id}`)
    .then(r => r.json())
    .then(j => {
      surahData = j.data;
      document.title = `QS ${surahData.namaLatin}`;

      surahData.ayat.forEach((a,i) => {
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
    });

  /* ========= PLAY AYAT (EVERYAYAH) ========= */
  function playAyat(i){
    currentIndex = i;

    const surah3 = String(surahData.nomor).padStart(3,'0');
    const ayah3 = String(surahData.ayat[i].nomorAyat).padStart(3,'0');
    const file = surah3 + ayah3;

    audio.src = `https://everyayah.com/data/Alafasy_64kbps/${file}.mp3`;
    trackTitle.textContent =
      `QS ${surahData.namaLatin} ${surahData.nomor}:${surahData.ayat[i].nomorAyat}`;

    wrap.classList.add("show");
    audio.play();
  }

  /* ========= PLAYER BUTTONS ========= */
  playBtn.onclick = () => audio.paused ? audio.play() : audio.pause();
  prevBtn.onclick = () => { if(currentIndex > 0) playAyat(currentIndex-1); };
  nextBtn.onclick = () => { if(currentIndex < ayatEls.length-1) playAyat(currentIndex+1); };
  closeBtn.onclick = () => { audio.pause(); wrap.classList.remove("show"); };

  /* ========= PROGRESS ========= */
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

});

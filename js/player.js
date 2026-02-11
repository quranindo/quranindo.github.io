/* =========================
   CUSTOM PLAYER CONTROL
========================= */

const playBtn   = document.getElementById('playBtn');
const prevBtn   = document.getElementById('prevBtn');
const nextBtn   = document.getElementById('nextBtn');
const qpBar   = document.getElementById('qpBar');
const qpFill  = document.getElementById('qpFill');
const qpThumb = document.getElementById('qpThumb');
const volume    = document.getElementById('volume');
const repeatBtn = document.getElementById('repeatBtn');
const timeNow   = document.getElementById('timeNow');
const timeTotal = document.getElementById('timeTotal');

let repeatOne = false;

/* play pause */
playBtn.onclick = ()=>{
  if(audio.paused) audio.play();
  else audio.pause();
};

audio.onplay  = ()=> playBtn.textContent="⏸";
audio.onpause = ()=> playBtn.textContent="▶";

/* next prev */
prevBtn.onclick = ()=> playAyat(currentIndex-1);
nextBtn.onclick = ()=> playAyat(currentIndex+1);

/* progress */
audio.ontimeupdate = ()=>{
  if(!audio.duration) return;

  const p = audio.currentTime/audio.duration*100;
  qpFill.style.width = p+"%";
  qpThumb.style.left = p+"%";
  timeNow.textContent   = fmt(audio.currentTime);
  timeTotal.textContent = fmt(audio.duration);
};
function seek(e){
  const rect = qpBar.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const p = x/rect.width;

  audio.currentTime = p * audio.duration;
}

qpBar.onclick = seek;

qpBar.onpointerdown = ()=>{
  qpBar.onpointermove = seek;
};

document.onpointerup = ()=>{
  qpBar.onpointermove = null;
};

/* volume */
volume.value = 1;
volume.oninput = ()=> audio.volume = volume.value;

/* repeat */
repeatBtn.onclick = ()=>{
  repeatOne = !repeatOne;
  repeatBtn.style.opacity = repeatOne ? 1 : .4;
};

audio.addEventListener('ended',()=>{
  if(repeatOne){
    audio.currentTime=0;
    audio.play();
    return;
  }
});

/* format time */
function fmt(t){
  const m=Math.floor(t/60);
  const s=Math.floor(t%60).toString().padStart(2,'0');
  return `${m}:${s}`;
}

/* ===============================
   WAITING
================================ */
window.addEventListener('load', ()=>{
const playerInfo = document.getElementById('playerInfo');

/* ===============================
   SVG
================================ */

const svgPlay = `
<svg viewBox="0 0 20 20" fill="currentColor">
  <path d="M4 2l14 8-14 8z"/>
</svg>`;

const svgPause = `
<svg viewBox="0 0 20 20" fill="currentColor">
  <rect x="3" y="2" width="5" height="16" rx="1"/>
  <rect x="12" y="2" width="5" height="16" rx="1"/>
</svg>`;


const svgPrev = `
<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M11 12l9 7V5zM4 5h3v14H4z"/>
  </svg>`;

const svgNext = `
<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M13 12L4 5v14zM17 5h3v14h-3z"/>
  </svg>`;

const svgRepeat = `
<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 1l4 4-4 4V6H7a4 4 0 00-4 4H1a6 6 0 016-6h10V1zM7 23l-4-4 4-4v3h10a4 4 0 004-4h2a6 6 0 01-6 6H7v3z"/>
  </svg>`;


/* ===============================
   INIT BUTTON
================================ */

prevBtn.innerHTML   = svgPrev;
nextBtn.innerHTML   = svgNext;
repeatBtn.innerHTML = svgRepeat;
playBtn.innerHTML   = svgPlay;


/* ===============================
   REPEAT AYAT (FIX)
================================ */

let repeatOne = false;

repeatBtn.onclick = ()=>{
  repeatOne = !repeatOne;
  audio.loop = repeatOne; 
  repeatBtn.classList.toggle('active', repeatOne);
};


/* ===============================
   ICON SYNC
================================ */

function setCardIcons(){

  ayatEls.forEach(el=>{

    const btn = el.querySelector('.play');

    if(btn){
      btn.innerHTML = svgPlay;
    }

  });

}

function syncIcons(){
  setCardIcons();

  if(currentIndex>=0 && ayatEls[currentIndex]){
    ayatEls[currentIndex]
      .querySelector('.play')
      .innerHTML = audio.paused ? svgPlay : svgPause;
  }
  updateInfo();
}
audio.addEventListener("play", syncIcons);
audio.addEventListener("pause", syncIcons);
audio.addEventListener("ended", syncIcons);
function updateInfo(){
  if(!playerInfo) return;

  const suratName = titleLatin?.textContent || '';
  const total = ayatEls.length;
  const now   = currentIndex >= 0 ? currentIndex+1 : 0;

  playerInfo.textContent = `${suratName} • ${now}/${total}`;
}


/* ===============================
   HOOK playAyat
================================ */

const _playAyat = playAyat;
playAyat = function(i){
  _playAyat(i);
  syncIcons();
};


/* ===============================
   FIX CARD CLICK
================================ */

function bindCardButtons(){
  ayatEls.forEach((el,i)=>{
    el.querySelector('.play').onclick = ()=>{
      if(i===currentIndex && !audio.paused){
        audio.pause();
      }else{
        playAyat(i);
      }
    };
  });
}


/* ===============================
   PLAYER EVENTS
================================ */

audio.onplay  = ()=>{ playBtn.innerHTML = svgPause; syncIcons(); };
audio.onpause = ()=>{ playBtn.innerHTML = svgPlay;  syncIcons(); };


/* ===============================
   FINAL INIT
================================ */

setTimeout(()=>{
  setCardIcons();
  bindCardButtons();
},300);


});


/* ================= ICON SVG ================= */
const ICONS = {
 play:`<svg viewBox="0 0 24 24" width="18"><polygon points="8,5 19,12 8,19"/></svg>`,
 pause:`<svg viewBox="0 0 24 24" width="18"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></svg>`,
 next:`<svg viewBox="0 0 24 24" width="18"><polygon points="5,4 15,12 5,20"/><rect x="17" y="4" width="2" height="16"/></svg>`,
 prev:`<svg viewBox="0 0 24 24" width="18"><polygon points="19,4 9,12 19,20"/><rect x="5" y="4" width="2" height="16"/></svg>`,
 close:`<svg viewBox="0 0 24 24" width="18"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>`
};

/* ================= PLAYER ELEMENTS ================= */
const audio = document.getElementById('player');
const wrap  = document.getElementById('playerWrap');
const playBtn = document.getElementById('playBtn');
const progress = document.getElementById('progress');
const volume = document.getElementById('volume');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const trackTitle = document.getElementById('trackTitle');
const closeBtn = wrap.querySelector('button');

/* inject icons */
playBtn.innerHTML = ICONS.play;
document.querySelector('[onclick="prevAyat()"]').innerHTML = ICONS.prev;
document.querySelector('[onclick="nextAyat()"]').innerHTML = ICONS.next;
closeBtn.innerHTML = ICONS.close;

/* ================= STATE ================= */
let ayatEls=[], ayatPlayBtns=[], currentIndex=-1, s, allAyat;

volume.value=1; audio.volume=1;

/* ================= PLAY AYAT ================= */
function playAyat(i){
 if(i<0 || i>=ayatEls.length) return;
 ayatPlayBtns.forEach(b=>b.innerHTML=ICONS.play);

 currentIndex=i;
 const a=allAyat[i];
 audio.src=a.audio["01"];

 trackTitle.textContent=`Surat ${s.nama_latin} ${s.nomor}:${a.nomorAyat}`;
 wrap.classList.add('show');
 audio.play();
 highlight(i);

 ayatPlayBtns[i].innerHTML=ICONS.pause;
 localStorage.setItem(`lastAyatSurah${s.nomor}`, i);
}

/* ================= SYNC ================= */
audio.addEventListener('play',()=>{
 playBtn.innerHTML=ICONS.pause;
 if(currentIndex>=0) ayatPlayBtns[currentIndex].innerHTML=ICONS.pause;
});
audio.addEventListener('pause',()=>{
 playBtn.innerHTML=ICONS.play;
 if(currentIndex>=0) ayatPlayBtns[currentIndex].innerHTML=ICONS.play;
});

/* ================= CONTROLS ================= */
playBtn.onclick=()=>audio.paused?audio.play():audio.pause();
function nextAyat(){ if(currentIndex<ayatEls.length-1) playAyat(currentIndex+1); }
function prevAyat(){ if(currentIndex>0) playAyat(currentIndex-1); }
function closePlayer(){
 audio.pause(); audio.src='';
 wrap.classList.remove('show');
 ayatPlayBtns.forEach(b=>b.innerHTML=ICONS.play);
}

/* ================= PROGRESS ================= */
audio.addEventListener('timeupdate',()=>{
 progress.max=audio.duration||0;
 progress.value=audio.currentTime;
 currentTimeEl.textContent=fmt(audio.currentTime);
 durationEl.textContent=fmt(audio.duration);
});
progress.oninput=()=>audio.currentTime=progress.value;
volume.oninput=()=>audio.volume=volume.value;

/* ================= AUTO NEXT ================= */
audio.addEventListener('ended',()=>{
 ayatPlayBtns[currentIndex].innerHTML=ICONS.play;
 if(currentIndex<ayatEls.length-1) nextAyat();
});

/* ================= LOAD SURAT ================= */
async function load(){
 const id=window.SURAT_ID;
 const res=await fetch(`https://equran.id/api/v2/surat/${id}`);
 s=(await res.json()).data;
 allAyat=s.ayat;

 const content=document.getElementById('content');
 content.innerHTML='';

 s.ayat.forEach((a,i)=>{
   const el=document.createElement('div');
   el.className='ayat';
   el.innerHTML=`
     <button class="playBtn"></button>
     <div class="arab">${a.teksArab} ۝${a.nomorAyat}</div>
     <div class="arti">${a.teksIndonesia}</div>
   `;
   const btn=el.querySelector('.playBtn');
   btn.innerHTML=ICONS.play;

   btn.onclick=()=>{
     if(currentIndex===i && !audio.paused) audio.pause();
     else playAyat(i);
   };

   content.appendChild(el);
   ayatEls.push(el);
   ayatPlayBtns.push(btn);
 });

 const last=localStorage.getItem(`lastAyatSurah${id}`);
 if(last) highlight(+last);
}

/* ================= HIGHLIGHT ================= */
function highlight(i){
 ayatEls.forEach(e=>e.classList.remove('active'));
 ayatEls[i].classList.add('active');
 ayatEls[i].scrollIntoView({behavior:'smooth',block:'nearest'});
}

/* ================= TIME FORMAT ================= */
function fmt(s){
 if(!s) return "0:00";
 const m=Math.floor(s/60);
 const sec=Math.floor(s%60).toString().padStart(2,'0');
 return `${m}:${sec}`;
}

load();

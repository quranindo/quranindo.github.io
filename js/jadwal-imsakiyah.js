/* ===============================
   JADWAL IMSAKIYAH – MUSHAF ONLINE
   =============================== */

const API_URL = "/api/jadwal-imsakiyah.json";


/* ===============================
   INIT
   =============================== */
initJadwal();
reloadAtMidnight();


/* ===============================
   LOAD & RENDER
   =============================== */
function initJadwal(){

  fetch(API_URL)
    .then(res => res.json())
    .then(json => {

      const now = new Date();

      const today =
        now.getFullYear() + '-' +
        String(now.getMonth()+1).padStart(2,'0') + '-' +
        String(now.getDate()).padStart(2,'0');

      const data = json.jadwal.find(x => x.tanggal === today);

      if(!data){
        renderError("Jadwal tidak tersedia");
        return;
      }

      renderHeader(json, data);
      renderJadwal(data);
      updateMeta(json, data);

    })
    .catch(err => {

      console.error(err);
      renderError("Gagal memuat jadwal");

    });

}


/* ===============================
   RENDER HEADER
   =============================== */
function renderHeader(json, data){

  const lokasiEl   = document.getElementById("lokasi");
  const tanggalEl  = document.getElementById("tanggal");
  const hijriyahEl = document.getElementById("hijriyah");

  if(lokasiEl)
    lokasiEl.textContent = json.lokasi;

  if(tanggalEl)
    tanggalEl.textContent =
      new Date(data.tanggal)
        .toLocaleDateString("id-ID",{
          weekday:"long",
          day:"numeric",
          month:"long",
          year:"numeric"
        });

  if(hijriyahEl)
    hijriyahEl.textContent = data.hijriyah;

}


/* ===============================
   RENDER JADWAL ROW
   =============================== */
function renderJadwal(data){

  const container = document.getElementById("jadwal");

  if(!container) return;

  const list = [
    ["imsak","Imsak",data.imsak],
    ["subuh","Subuh",data.subuh],
    ["dzuhur","Dzuhur",data.dzuhur],
    ["ashar","Ashar",data.ashar],
    ["maghrib","Maghrib",data.maghrib],
    ["isya","Isya",data.isya],
  ];

  container.innerHTML =
    list.map(item => {

      const key   = item[0];
      const label = item[1];
      const value = item[2];

      const highlight =
        (key === "imsak" || key === "maghrib")
          ? " highlight"
          : "";

      return `
        <div class="row${highlight}">
          <div class="label">${label}</div>
          <div class="value ${key}">${value}</div>
        </div>
      `;

    }).join("");

}


/* ===============================
   META TAG DINAMIS (SEO + SHARE)
   =============================== */
function updateMeta(json, data){

  const lokasi = json.lokasi;

  const tanggal =
    new Date(data.tanggal)
      .toLocaleDateString("id-ID",{
        weekday:"long",
        day:"numeric",
        month:"long",
        year:"numeric"
      });

  const title =
    `Jadwal Imsakiyah ${lokasi} • ${tanggal}`;

  const description =
    `${data.hijriyah} • Imsak ${data.imsak} • Maghrib ${data.maghrib} • ${lokasi}`;

  document.title = title;

  setMeta("description", description);

  setMeta("og:title", title, true);
  setMeta("og:description", description, true);
  setMeta("og:url", location.href, true);

}


/* ===============================
   SET META HELPER
   =============================== */
function setMeta(name, content, isProperty=false){

  const attr = isProperty ? "property" : "name";

  let tag = document.querySelector(`meta[${attr}="${name}"]`);

  if(!tag){

    tag = document.createElement("meta");

    tag.setAttribute(attr, name);

    document.head.appendChild(tag);

  }

  tag.setAttribute("content", content);

}


/* ===============================
   ERROR DISPLAY
   =============================== */
function renderError(msg){

  const el = document.getElementById("jadwal");

  if(el)
    el.innerHTML =
      `<div class="row"><div>${msg}</div></div>`;

}


/* ===============================
   AUTO REFRESH JAM 00:00
   =============================== */
function reloadAtMidnight(){

  const now = new Date();

  const nextMidnight =
    new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()+1,
      0,0,1
    );

  const timeout = nextMidnight - now;

  setTimeout(() => {

    location.reload();

  }, timeout);

}

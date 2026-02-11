fetch('/api/jadwal-imsakiyah.json')
  .then(res => res.json())
  .then(json => {

    const now = new Date();

    const today =
      now.getFullYear() + '-' +
      String(now.getMonth()+1).padStart(2,'0') + '-' +
      String(now.getDate()).padStart(2,'0');

    const data = json.jadwal.find(item => item.tanggal === today);

    if(!data) return;

    document.getElementById("lokasi").textContent = json.lokasi;

    document.getElementById("tanggal").textContent =
      new Date(data.tanggal).toLocaleDateString('id-ID',{
        weekday:'long',
        day:'numeric',
        month:'long',
        year:'numeric'
      });

    document.getElementById("hijriyah").textContent = data.hijriyah;

    const jadwalList = [
      ["imsak","Imsak",data.imsak],
      ["subuh","Subuh",data.subuh],
      ["dzuhur","Dzuhur",data.dzuhur],
      ["ashar","Ashar",data.ashar],
      ["maghrib","Maghrib",data.maghrib],
      ["isya","Isya",data.isya],
    ];

    document.getElementById("jadwal").innerHTML =
      jadwalList.map(item => {

        const key = item[0];
        const label = item[1];
        const value = item[2];

        const specialClass =
          (key === "imsak" || key === "maghrib")
            ? " highlight"
            : "";

        return `
          <div class="row${specialClass}">
            <div class="label">${label}</div>
            <div class="value ${key}">${value}</div>
          </div>
        `;
      }).join('');

  })
  .catch(err => {
    console.error("Gagal load jadwal:", err);
  });


// ===============================
// AUTO REFRESH JAM 00:00 LOKAL
// ===============================
reloadAtMidnight();

function reloadAtMidnight(){

  const now = new Date();

  const nextMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0,0,1
  );

  const timeout = nextMidnight - now;

  setTimeout(() => {
    location.reload();
  }, timeout);

}

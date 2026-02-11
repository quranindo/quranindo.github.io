fetch('/api/jadwal-imsakiyah.json')
  .then(res => res.json())
  .then(json => {

    const now = new Date();

    const today =
      now.getFullYear() + '-' +
      String(now.getMonth()+1).padStart(2,'0') + '-' +
      String(now.getDate()).padStart(2,'0');

    const data = json.jadwal.find(item => item.tanggal === today);

    if(!data){
      document.getElementById("jadwal").innerHTML =
        `<div class="row"><div>Data tidak tersedia</div></div>`;
      return;
    }

    // Header
    document.getElementById("lokasi").textContent = json.lokasi;

    document.getElementById("tanggal").textContent =
      new Date(data.tanggal).toLocaleDateString('id-ID',{
        weekday:'long',
        day:'numeric',
        month:'long',
        year:'numeric'
      });

    document.getElementById("hijriyah").textContent = data.hijriyah;


    // Jadwal rows
    const jadwalList = [
      ["Imsak", data.imsak],
      ["Subuh", data.subuh],
      ["Dzuhur", data.dzuhur],
      ["Ashar", data.ashar],
      ["Maghrib", data.maghrib],
      ["Isya", data.isya],
    ];

    document.getElementById("jadwal").innerHTML =
      jadwalList.map(item => `
        <div class="row">
          <div class="label">${item[0]}</div>
          <div class="value">${item[1]}</div>
        </div>
      `).join('');

  })
  .catch(err => {
    document.getElementById("jadwal").innerHTML =
      `<div class="row">Gagal memuat jadwal</div>`;
    console.error(err);
  });

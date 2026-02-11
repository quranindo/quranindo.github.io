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
      new Date(data.tanggal).toLocaleDateString('id-ID', {
        weekday:'long',
        day:'numeric',
        month:'long',
        year:'numeric'
      });

    document.getElementById("hijriyah").textContent = data.hijriyah;

    document.getElementById("imsak").textContent = data.imsak;
    document.getElementById("subuh").textContent = data.subuh;
    document.getElementById("dzuhur").textContent = data.dzuhur;
    document.getElementById("ashar").textContent = data.ashar;
    document.getElementById("maghrib").textContent = data.maghrib;
    document.getElementById("isya").textContent = data.isya;

  });

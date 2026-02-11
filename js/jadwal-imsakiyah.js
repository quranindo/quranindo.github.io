async function loadJadwal(){

  try{

    // cache buster agar selalu fresh
    const res = await fetch('/api/jadwal-imsakiyah.json?v=' + Date.now());

    const data = await res.json();

    document.getElementById('tanggal').textContent =
      data.tanggal + " • " + data.lokasi;

    document.getElementById('hijri').textContent =
      data.hijri;

    document.getElementById('jadwal').innerHTML = `
      <div class="row"><span>Imsak</span><span>${data.imsak}</span></div>
      <div class="row"><span>Subuh</span><span>${data.subuh}</span></div>
      <div class="row"><span>Terbit</span><span>${data.terbit}</span></div>
      <div class="row"><span>Dzuhur</span><span>${data.dzuhur}</span></div>
      <div class="row"><span>Ashar</span><span>${data.ashar}</span></div>
      <div class="row"><span>Maghrib</span><span>${data.maghrib}</span></div>
      <div class="row"><span>Isya</span><span>${data.isya}</span></div>
    `;

    document.getElementById('update').textContent =
      "Update: " + new Date(data.update).toLocaleString('id-ID');

  }
  catch(e){

    document.getElementById('tanggal').textContent =
      "Gagal memuat jadwal";

  }

}

loadJadwal();


// optional auto refresh tiap 1 jam
setInterval(loadJadwal, 3600000);

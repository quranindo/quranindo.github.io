const listEl = document.getElementById('list');
let data = [];

function slugify(nama) {
  return nama
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/\s+/g, '-');
}

const artiOverride = {
  2:"Sapi Betina",
  8:"Harta Rampasan Perang",
  10:"Nabi Yunus",
  11:"Nabi Hud",
  12:"Nabi Yusuf",
  14:"Nabi Ibrahim",
  15:"Negeri Kaum Tsamud",
  17:"Perjalanan Malam",
  30:"Bangsa Romawi",
  32:"Sujud",
  34:"Negeri Saba",
  45:"Yang Berlutut",
  47:"Nabi Muhammad SAW",
  55:"Yang Maha Pengasih",
  60:"Perempuan yang Diuji",
  62:"Hari Jum'at",
  81:"Menggulung",
  87:"Yang Maha Tinggi",
  88:"Hari Pembalasan",
  93:"Waktu Dhuha",
  103:"Masa",
  106:"Suku Quraisy",
  108:"Nikmat yang Banyak",
  112:"Kemurnian Keesaan Allah",
  113:"Waktu Subuh"
};

async function load() {
  const res = await fetch('https://equran.id/api/surat');
  data = await res.json();
  render(data);
}

function render(arr) {
  listEl.innerHTML = '';

  arr.forEach(s => {
    const arti = artiOverride[s.nomor] || s.arti;

    const el = document.createElement('div');
    el.className = 'card';

    el.innerHTML = `
      <b>${s.nomor}. ${s.nama_latin}</b>
      <div class="arti">${arti}</div>
      <div class="arab">${s.nama}</div>
      <div class="meta">${s.jumlah_ayat} ayat • ${s.tempat_turun}</div>
    `;

    const slug = `${s.nomor}-${slugify(s.nama_latin)}`;
    el.onclick = () => location.href = `/surat/${slug}`;

    listEl.appendChild(el);
  });
}

load();
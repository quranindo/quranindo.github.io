const listEl = document.getElementById('list');
let data = [];

const slugMap = {
  1: "al-fatihah",
  2: "al-baqarah",
  3: "ali-imran",
  4: "an-nisa",
  5: "al-maidah",
  6: "al-anam",
  7: "al-araf",
  8: "al-anfal",
  9: "at-taubah",
  10: "yunus",
  11: "hud",
  12: "yusuf",
  13: "ar-rad",
  14: "ibrahim",
  15: "al-hijr",
  16: "an-nahl",
  17: "al-isra",
  18: "al-kahfi",
  19: "maryam",
  20: "thaha",
  21: "al-anbiya",
  22: "al-hajj",
  23: "al-muminun",
  24: "an-nur",
  25: "al-furqan",
  26: "asy-syuara",
  27: "an-naml",
  28: "al-qasas",
  29: "al-ankabut",
  30: "ar-rum",
  31: "luqman",
  32: "as-sajdah",
  33: "al-ahzab",
  34: "saba",
  35: "fatir",
  36: "ya-sin",
  37: "as-saffat",
  38: "shad",
  39: "az-zumar",
  40: "ghafir",
  41: "fussilat",
  42: "asy-syura",
  43: "az-zukhruf",
  44: "ad-dukhan",
  45: "al-jatsiyah",
  46: "al-ahqaf",
  47: "muhammad",
  48: "al-fath",
  49: "al-hujurat",
  50: "qaf",
  51: "adz-dzariyat",
  52: "at-tur",
  53: "an-najm",
  54: "al-qamar",
  55: "ar-rahman",
  56: "al-waqiah",
  57: "al-hadid",
  58: "al-mujadilah",
  59: "al-hasyr",
  60: "al-mumtahanah",
  61: "as-saff",
  62: "al-jumuah",
  63: "al-munafiqun",
  64: "at-taghabun",
  65: "at-talaq",
  66: "at-tahrim",
  67: "al-mulk",
  68: "al-qalam",
  69: "al-haqqah",
  70: "al-maarij",
  71: "nuh",
  72: "al-jinn",
  73: "al-muzzammil",
  74: "al-muddassir",
  75: "al-qiyamah",
  76: "al-insan",
  77: "al-mursalat",
  78: "an-naba",
  79: "an-naziat",
  80: "abasa",
  81: "at-takwir",
  82: "al-infithar",
  83: "al-muthaffifin",
  84: "al-insyiqaq",
  85: "al-buruj",
  86: "at-thariq",
  87: "al-ala",
  88: "al-ghasyiyah",
  89: "al-fajr",
  90: "al-balad",
  91: "asy-syams",
  92: "al-lail",
  93: "ad-duha",
  94: "al-insyirah",
  95: "at-tin",
  96: "al-alaq",
  97: "al-qadr",
  98: "al-bayyinah",
  99: "az-zalzalah",
  100: "al-adiyat",
  101: "al-qariah",
  102: "at-takatsur",
  103: "al-ashr",
  104: "al-humazah",
  105: "al-fil",
  106: "quraisy",
  107: "al-maun",
  108: "al-kautsar",
  109: "al-kafirun",
  110: "an-nasr",
  111: "al-lahab",
  112: "al-ikhlas",
  113: "al-falaq",
  114: "an-naas"
};

const artiOverride = {
  2: "Sapi Betina",
  8: "Harta Rampasan Perang",
  10: "Nabi Yunus",
  11: "Nabi Hud",
  12: "Nabi Yusuf",
  14: "Nabi Ibrahim",
  15: "Negeri Kaum Tsamud",
  17: "Perjalanan Malam",
  30: "Bangsa Romawi",
  32: "Sujud",
  34: "Negeri Saba",
  45: "Yang Berlutut",
  47: "Nabi Muhammad SAW",
  55: "Yang Maha Pengasih",
  60: "Perempuan yang Diuji",
  62: "Hari Jum'at",
  71: "Nabi Nuh",
  81: "Menggulung",
  87: "Yang Maha Tinggi",
  88: "Hari Pembalasan",
  93: "Waktu Dhuha",
  103: "Masa",
  106: "Suku Quraisy",
  108: "Nikmat yang Banyak",
  112: "Kemurnian Keesaan Allah",
  113: "Waktu Subuh"
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
      <div class="arti">
        ${arti}
      </div>
      <div class="arab" data-nama="${s.nama}">
        ${s.nama}
      </div>
      <div class="meta">
        ${s.jumlah_ayat} ayat • ${s.tempat_turun}
      </div>
    `;

    const arab = el.querySelector('.arab');
    if (document.fonts) {
      document.fonts.load("1em surahquran").then(() => {
        arab.innerHTML =
          `<i class="icon-${s.nomor}" aria-label="${s.nama}"></i>`;
      });
    }


    const slugName = slugMap[s.nomor];
    const slug = `${s.nomor}-${slugName}`;

    el.onclick = () => {

      location.href = `/surat/${slug}/`;

    };

    listEl.appendChild(el);
  });
}


// ===============================
load();
// ===============================

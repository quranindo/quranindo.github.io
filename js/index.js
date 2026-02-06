const listEl = document.getElementById('list');
let data = [];

/* ===============================
   SLUG & ARTI DIKUNCI MANUAL
   =============================== */

const suratMeta = {
  1:  { slug: "1-al-fatihah" },
  2:  { slug: "2-al-baqarah", arti: "Sapi Betina" },
  3:  { slug: "3-ali-imran" },
  4:  { slug: "4-an-nisa" },
  5:  { slug: "5-al-maidah" },
  6:  { slug: "6-al-anam" },
  7:  { slug: "7-al-araf" },
  8:  { slug: "8-al-anfal", arti: "Harta Rampasan Perang" },
  9:  { slug: "9-at-taubah" },
  10: { slug: "10-yunus", arti: "Nabi Yunus" },
  11: { slug: "11-hud", arti: "Nabi Hud" },
  12: { slug: "12-yusuf", arti: "Nabi Yusuf" },
  13: { slug: "13-ar-rad" },
  14: { slug: "14-ibrahim", arti: "Nabi Ibrahim" },
  15: { slug: "15-al-hijr", arti: "Negeri Kaum Tsamud" },
  16: { slug: "16-an-nahl" },
  17: { slug: "17-al-isra", arti: "Perjalanan Malam" },
  18: { slug: "18-al-kahfi" },
  19: { slug: "19-maryam" },
  20: { slug: "20-thaha" },
  21: { slug: "21-al-anbiya" },
  22: { slug: "22-al-hajj" },
  23: { slug: "23-al-muminun" },
  24: { slug: "24-an-nur" },
  25: { slug: "25-al-furqan" },
  26: { slug: "26-asy-syuara" },
  27: { slug: "27-an-naml" },
  28: { slug: "28-al-qasas" },
  29: { slug: "29-al-ankabut" },
  30: { slug: "30-ar-rum", arti: "Bangsa Romawi" },
  31: { slug: "31-luqman" },
  32: { slug: "32-as-sajdah", arti: "Sujud" },
  33: { slug: "33-al-ahzab" },
  34: { slug: "34-saba", arti: "Negeri Saba" },
  35: { slug: "35-fathir" },
  36: { slug: "36-ya-sin" },
  37: { slug: "37-as-saffat" },
  38: { slug: "38-shad" },
  39: { slug: "39-az-zumar" },
  40: { slug: "40-ghafir" },
  41: { slug: "41-fussilat" },
  42: { slug: "42-asy-syura" },
  43: { slug: "43-az-zukhruf" },
  44: { slug: "44-ad-dukhan" },
  45: { slug: "45-al-jatsiyah", arti: "Yang Berlutut" },
  46: { slug: "46-al-ahqaf" },
  47: { slug: "47-muhammad", arti: "Nabi Muhammad SAW" },
  48: { slug: "48-al-fath" },
  49: { slug: "49-al-hujurat" },
  50: { slug: "50-qaf" },
  51: { slug: "51-adz-dzariyat" },
  52: { slug: "52-at-tur" },
  53: { slug: "53-an-najm" },
  54: { slug: "54-al-qamar" },
  55: { slug: "55-ar-rahman", arti: "Yang Maha Pengasih" },
  56: { slug: "56-al-waqiah" },
  57: { slug: "57-al-hadid" },
  58: { slug: "58-al-mujadilah" },
  59: { slug: "59-al-hasyr" },
  60: { slug: "60-al-mumtahanah", arti: "Perempuan yang Diuji" },
  61: { slug: "61-as-saff" },
  62: { slug: "62-al-jumuah", arti: "Hari Jum'at" },
  63: { slug: "63-al-munafiqun" },
  64: { slug: "64-at-taghabun" },
  65: { slug: "65-at-thalaq" },
  66: { slug: "66-at-tahrim" },
  67: { slug: "67-al-mulk" },
  68: { slug: "68-al-qalam" },
  69: { slug: "69-al-haqqah" },
  70: { slug: "70-al-maarij" },
  71: { slug: "71-nuh", arti: "Nabi Nuh" },
  72: { slug: "72-al-jinn" },
  73: { slug: "73-al-muzzammil" },
  74: { slug: "74-al-muddatstsir" },
  75: { slug: "75-al-qiyamah" },
  76: { slug: "76-al-insan" },
  77: { slug: "77-al-mursalat" },
  78: { slug: "78-an-naba" },
  79: { slug: "79-an-naziat" },
  80: { slug: "80-abasa" },
  81: { slug: "81-at-takwir", arti: "Menggulung" },
  82: { slug: "82-al-infithar" },
  83: { slug: "83-al-muthaffifin" },
  84: { slug: "84-al-insyiqaq" },
  85: { slug: "85-al-buruj" },
  86: { slug: "86-at-thariq" },
  87: { slug: "87-al-ala", arti: "Yang Maha Tinggi" },
  88: { slug: "88-al-ghasyiyah", arti: "Hari Pembalasan" },
  89: { slug: "89-al-fajr" },
  90: { slug: "90-al-balad" },
  91: { slug: "91-asy-syams" },
  92: { slug: "92-al-lail" },
  93: { slug: "93-ad-dhuha", arti: "Waktu Dhuha" },
  94: { slug: "94-al-insyirah" },
  95: { slug: "95-at-tin" },
  96: { slug: "96-al-alaq" },
  97: { slug: "97-al-qadr" },
  98: { slug: "98-al-bayyinah" },
  99: { slug: "99-az-zalzalah" },
  100:{ slug: "100-al-adiyat" },
  101:{ slug: "101-al-qariah" },
  102:{ slug: "102-at-takatsur" },
  103:{ slug: "103-al-ashr", arti: "Masa" },
  104:{ slug: "104-al-humazah" },
  105:{ slug: "105-al-fil" },
  106:{ slug: "106-quraisy", arti: "Suku Quraisy" },
  107:{ slug: "107-al-maun" },
  108:{ slug: "108-al-kautsar", arti: "Nikmat yang Banyak" },
  109:{ slug: "109-al-kafirun" },
  110:{ slug: "110-an-nasr" },
  111:{ slug: "111-al-lahab" },
  112:{ slug: "112-al-ikhlas", arti: "Kemurnian Keesaan Allah" },
  113:{ slug: "113-al-falaq", arti: "Waktu Subuh" },
  114:{ slug: "114-an-naas" }
};

/* ===============================
   LOAD DATA
   =============================== */

async function load() {
  const res = await fetch('https://equran.id/api/surat');
  data = await res.json();
  render(data);
}

/* ===============================
   RENDER LIST
   =============================== */

function render(arr) {
  listEl.innerHTML = '';

  arr.forEach(s => {
    const meta = suratMeta[s.nomor] || {};
    const slug = meta.slug;
    const arti = meta.arti || s.arti;

    if (!slug) return; // safety

    const el = document.createElement('div');
    el.className = 'card';

    el.innerHTML = `
      <b>${s.nomor}. ${s.nama_latin}</b>
      <div class="arti">${arti}</div>
      <div class="arab">${s.nama}</div>
      <div class="meta">${s.jumlah_ayat} ayat • ${s.tempat_turun}</div>
    `;

    el.onclick = () => {
      location.href = `/surat/${slug}/`;
    };

    listEl.appendChild(el);
  });
}

load();

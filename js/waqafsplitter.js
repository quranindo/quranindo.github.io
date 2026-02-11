/* ==========================================
   QURAN SIGN SPLITTER + HIZB LOGIC (FINAL)
   ========================================== */

/* WAQAF VALID (LPMQ / Mushaf Madinah) */
const WAQAF_SET = new Set([
  '\u06D6', // ۖ
  '\u06D7', // ۗ
  '\u06D8', // ۘ
  '\u06D9', // ۙ
  '\u06DA', // ۚ
  '\u06DB', // ۛ
  '\u06DC'  // ۜ
]);

/* RUB EL HIZB */
const RUB_SIGN = '\u06DE'; // ۞

/* NUN WIQOYAH  */
const NUN_WIQOYAH = '\u06E8';

/* IQLAB MIM */
const IQLAB_MIM = '\u06E2';

/* ARABIC DOT (FULL STOP) */
const ARABIC_DOT = '\u06D4'; // ۔

/* SCAN QURANIC MARKS AREA */
const QURAN_SCAN_REGEX = /([\u06D4\u06D6-\u06ED])/g;

/* ==========================================
   SPLITTER
   ========================================== */
function splitQuranSigns(root = document) {
  root.querySelectorAll('.ayah-text').forEach(el => {
    if (el.dataset.signSplit) return;

    el.innerHTML = el.innerHTML.replace(QURAN_SCAN_REGEX, ch => {

      /* ARABIC DOT → JUZ MARK */
      if (ch === ARABIC_DOT) {
        return `<span class="arabic-dot">${ch}</span>`;
      }

      /* NUN WIQOYAH */
      if (ch === NUN_WIQOYAH) {
        return `<span class="nun-wiqoyah">${ch}</span>`;
      }

      /* IQLAB MIM */
      if (ch === IQLAB_MIM) {
        return `<span class="iqlab-mim">${ch}</span>`;
      }

      /* RUB EL HIZB */
      if (ch === RUB_SIGN) {
        return `<span class="rub-wrap"><span class="rub-sign">${ch}</span></span>`;
      }

      /* WAQAF */
      if (WAQAF_SET.has(ch)) {
        return `<span class="waqaf">${ch}</span>`;
      }

      return ch;
    });

    el.dataset.signSplit = '1';
  });
}

/* ==========================================
   HIZB LABEL LOGIC (RUB = END, NOT START)
   ========================================== */
function applyHizbLabels() {
  document.querySelectorAll('.rub-wrap').forEach((rub, i) => {
    let label = '';
    const rubIndex = (i + 1) % 4;

    switch (rubIndex) {
      case 1: label = '¼ حزب'; break;
      case 2: label = '½ حزب'; break;
      case 3: label = '¾ حزب'; break;
      case 0: label = 'حزب'; break;
    }

    rub.dataset.hizbLabel = label;
  });
}

/* ==========================================
   CSS INJECT (WAQAF + HIZB + JUZ)
   ========================================== */
function injectStyles() {
  if (document.getElementById('quran-sign-style')) return;

  const style = document.createElement('style');
  style.id = 'quran-sign-style';
  style.textContent = `

    .iqlab-mim {
      font-size: .7em;
      vertical-align: super;
      margin-inline-start: 1px;
    }

    .rub-wrap {
      position: relative;
      display: inline-block;
      margin-inline-start: .15em;
    }

    .rub-wrap::after {
      content: attr(data-hizb-label);
      position: absolute;
      left: 50%;
      transform: translateX(-50%) translateY(-.6em);
      font-size: .4em;
      white-space: nowrap;
      line-height: 1;
    }

    /* ARABIC DOT → JUZ LABEL */
    .arabic-dot {
      position: relative;
      color: transparent;
      display: inline-block;
      margin-inline-start: -.15em;
    }

    .arabic-dot::after {
      content: 'الجزء';
      position: absolute;
      left: 50%;
      transform: translateX(-50%) translateY(-.2em);
      font-size: .6em;
      white-space: nowrap;
      line-height: 1;
      color: #e1bf05;
    }
  `;
  document.head.appendChild(style);
}

/* ==========================================
   OBSERVER
   ========================================== */
const observer = new MutationObserver(mutations => {
  mutations.forEach(m => {
    m.addedNodes.forEach(node => {
      if (node.nodeType !== 1) return;

      if (node.classList.contains('ayat')) {
        splitQuranSigns(node);
        applyHizbLabels();
      }

      node.querySelectorAll?.('.ayat').forEach(el => {
        splitQuranSigns(el);
        applyHizbLabels();
      });
    });
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

/* INIT */
splitQuranSigns();
applyHizbLabels();
injectStyles();
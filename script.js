/* =======================================================================
   fromis_9 "오늘의 최애" · 로직
   =======================================================================
   비개발자도 쉽게 고칠 수 있도록, 자주 바꿀 값(멤버/운세/테마)을 맨 위에
   모아두었습니다. 그 아래는 동작 로직이라 보통은 건드리지 않아도 됩니다.
   ======================================================================= */

/* ============================ ① 멤버 설정 ============================
   - fromis_9 현재 5인 체제.
   - images: 멤버별 짤 후보 "여러 장"을 배열로 넣을 수 있습니다.
       · 지금은 멤버당 1장씩만 적어두었어요.
       · 나중에 사진을 더 넣고 싶으면 그 멤버의 images 배열에
         경로만 추가하면 됩니다. 예)
            images: ['images/hayoung.png', 'images/hayoung-2.gif', 'images/hayoung-3.png']
       · png / gif 모두 가능합니다.
   - 같은 생년월일은 "같은 날" 하루 종일 같은 멤버 + 같은 사진이 나오고,
     날짜가 바뀌면 사진도 시드에 따라 다시 골라집니다.
   - 파일이 없거나 로드에 실패하면 멤버 이름이 적힌 플레이스홀더가 대신 떠요.
*/
const MEMBERS = [
  {
    nameKo: '송하영', nameEn: 'Hayoung',
    images: [
      'images/hayoung.jpeg',
      'images/hayoung2.jpeg',
      'images/hayoung3.jpeg',
      'images/hayoung4.jpeg',
      'images/hayoung5.jpeg',
      'images/hayoung6.jpeg',
      'images/hayoung7.gif',
    ],
  },
  {
    nameKo: '박지원', nameEn: 'Jiwon',
    images: [
      'images/jiwon.jpeg',
      'images/jiwon2.jpeg',
      'images/jiwon3.jpeg',
      'images/jiwon4.jpeg',
      'images/jiwon5.jpeg',
      'images/jiwon6.gif',
    ],
  },
  {
    nameKo: '이채영', nameEn: 'Chaeyoung',
    images: [
      'images/chaeyoung.jpeg',
      'images/chaeyoung2.jpeg',
      'images/chaeyoung3.jpeg',
      'images/chaeyoung4.jpeg',
      'images/chaeyoung5.jpeg',
    ],
  },
  {
    nameKo: '이나경', nameEn: 'Nagyung',
    images: [
      'images/nagyung.jpeg',
      'images/nagyung2.jpeg',
      'images/nagyung3.jpeg',
      'images/nagyung4.jpeg',
      'images/nagyung5.jpeg',
      'images/nagyung6.gif',
    ],
  },
  {
    nameKo: '백지헌', nameEn: 'Jiheon',
    images: [
      'images/jiheon.jpeg',
      'images/jiheon2.jpeg',
      'images/jiheon3.jpeg',
      'images/jiheon4.jpeg',
      'images/jiheon5.jpeg',
    ],
  },
];

/* ============================ ② 운세 풀 ============================
   - 사자성어 + 한자 + 1~2줄 해설.
   - 톤: 가볍고 점잖게. 좋은 운 / 중간 / 조심 톤이 섞여 있고
     부정적인 건 1~2개만 가볍게 넣었습니다.
   - 자유롭게 추가/삭제/수정하세요. 개수는 12~20개를 권장합니다.
*/
const FORTUNES = [
  // --- 좋은 운 ---
  { ko: '운수대통', hanja: '運數大通', desc: '막혔던 일이 술술 풀리는 날이에요.' },
  { ko: '만사형통', hanja: '萬事亨通', desc: '하는 일마다 순조롭게 흘러가요.' },
  { ko: '금상첨화', hanja: '錦上添花', desc: '좋은 일에 좋은 일이 더해지는 하루.' },
  { ko: '화기애애', hanja: '和氣靄靄', desc: '곁에 있는 사람들과 웃음이 끊이지 않아요.' },
  { ko: '일취월장', hanja: '日就月將', desc: '어제보다 한 뼘 더 성장하는 날.' },
  { ko: '승승장구', hanja: '乘勝長驅', desc: '좋은 기세를 타고 쭉쭉 나아가요.' },
  { ko: '천우신조', hanja: '天佑神助', desc: '생각지 못한 도움의 손길이 찾아와요.' },
  { ko: '고진감래', hanja: '苦盡甘來', desc: '애쓴 시간이 달콤한 결실로 돌아와요.' },
  // --- 중간 / 잔잔 ---
  { ko: '대기만성', hanja: '大器晩成', desc: '조급해하지 않아도 분명 빛을 볼 거예요.' },
  { ko: '새옹지마', hanja: '塞翁之馬', desc: '지금의 변화에 너무 일희일비하지 마세요.' },
  { ko: '안분지족', hanja: '安分知足', desc: '가진 것에 감사하면 마음이 넉넉해져요.' },
  { ko: '초지일관', hanja: '初志一貫', desc: '처음 먹은 그 마음 그대로 밀고 가요.' },
  { ko: '역지사지', hanja: '易地思之', desc: '상대의 마음을 헤아리면 술술 풀려요.' },
  { ko: '유비무환', hanja: '有備無患', desc: '미리 챙겨두면 걱정할 일이 없어요.' },
  // --- 가볍게 조심 ---
  { ko: '근신자중', hanja: '謹身自重', desc: '오늘은 한 박자 쉬어가도 괜찮아요.' },
  { ko: '소탐대실', hanja: '小貪大失', desc: '작은 욕심은 잠시 내려놓는 게 좋아요.' },
];

/* ============================ ③ 테마(캔버스용) ============================
   - 화면 색은 style.css 의 :root 에서, 저장 이미지(캔버스) 색은 여기서 관리합니다.
   - 색을 바꿀 땐 두 곳을 맞춰주면 화면과 저장본이 똑같이 예뻐요.
*/
const THEME = {
  bg1: '#fff1f6',       // 배경 그라데이션 위
  bg2: '#f1ecff',       // 배경 그라데이션 아래
  card: '#ffffff',
  accent: '#ff8fb1',
  accentDeep: '#ff6f9c',
  accentSoft: '#ffe2ec',
  lav: '#b9a3ff',
  ink: '#5a4651',
  inkSoft: '#a596a0',
  fortuneBg: '#f6f1ff',
  fortuneBorder: '#e7dcff',
};

/* 입력 화면 년도 선택 범위 (필요하면 바꾸세요) */
const YEAR_MIN = 1980;
const YEAR_MAX = new Date().getFullYear();

/* =======================================================================
   여기서부터는 동작 로직입니다. (보통 수정할 필요 없음)
   ======================================================================= */

/* ---------------- 시드 고정용 PRNG ----------------
   문자열 → 32비트 해시(아래) → mulberry32 로 0~1 난수 생성.
   "생년월일 + 오늘 날짜" 를 시드로 쓰기 때문에,
   같은 사람은 같은 날 항상 같은 결과가 나옵니다. */

// 문자열을 32비트 정수 해시로 (간단하고 분포가 고른 방식)
function hashString(str) {
  let h = 2166136261 >>> 0; // FNV 계열 시작값
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  // 한 번 더 섞어서 비슷한 입력이 비슷한 결과로 몰리지 않게 함
  h ^= h >>> 13; h = Math.imul(h, 0x5bd1e995); h ^= h >>> 15;
  return h >>> 0;
}

// 시드(정수) 하나로 0 이상 1 미만 난수를 만드는 PRNG
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* 결과 계산: 최애 / 짤 사진 / 운세를 각각 "다른 시드" 로 뽑습니다.
   → 운세 좋은 날 항상 같은 멤버가 나오는 식의 상관관계를 막기 위함. */
function computeResult(birthStr, dateStr) {
  const base = birthStr + '|' + dateStr;

  // 접두어를 다르게 줘서 세 시드를 독립적으로 만든다
  const memberRng  = mulberry32(hashString('BIAS::' + base));
  const photoRng   = mulberry32(hashString('PHOTO::' + base));
  const fortuneRng = mulberry32(hashString('FORTUNE::' + base));

  const memberIndex = Math.floor(memberRng() * MEMBERS.length);
  const member = MEMBERS[memberIndex];

  const photoIndex = Math.floor(photoRng() * member.images.length);
  const imageSrc = member.images[photoIndex];

  const fortune = FORTUNES[Math.floor(fortuneRng() * FORTUNES.length)];

  return { memberIndex, member, photoIndex, imageSrc, fortune };
}

/* ---------------- 날짜 유틸 ---------------- */
function pad2(n) { return String(n).padStart(2, '0'); }

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function formatDateDot(str) {
  // 'YYYY-MM-DD' → 'YYYY.MM.DD'
  return str.replace(/-/g, '.');
}

/* ---------------- DOM 참조 ---------------- */
const $ = (id) => document.getElementById(id);

const inputScreen = $('inputScreen');
const resultScreen = $('resultScreen');
const yearSelect = $('yearSelect');
const monthSelect = $('monthSelect');
const daySelect = $('daySelect');
const inputError = $('inputError');
const startBtn = $('startBtn');

const rouletteStage = $('rouletteStage');
const slot = $('slot');
const resultCard = $('resultCard');
const actionButtons = $('actionButtons');
const saveBtn = $('saveBtn');
const shareBtn = $('shareBtn');
const retryBtn = $('retryBtn');

const memberNameEl = $('memberName');
const memberPhotoEl = $('memberPhoto');
const idiomKoEl = $('idiomKo');
const idiomHanjaEl = $('idiomHanja');
const fortuneDescEl = $('fortuneDesc');
const resultDateEl = $('resultDate');

let currentResult = null; // 현재 화면에 표시된 결과 (저장/공유용)

// 공유용 이미지 파일을 "결과가 나오는 즉시" 백그라운드로 미리 만들어두는 Promise.
// navigator.share() 는 클릭(사용자 동작) 직후 아주 짧은 시간 안에 호출해야
// 브라우저가 막지 않는다. 클릭 시점에 캔버스를 그리기 시작하면 폰트/이미지 로딩
// 시간 때문에 그 시간을 넘기기 쉬워, 가끔 공유가 막히는 문제가 생긴다.
// → 결과가 화면에 뜨는 순간 미리 준비해두고, 클릭하면 바로 꺼내 쓴다.
let shareAssetPromise = null;

/* ---------------- 입력 셀렉트 채우기 ---------------- */
function fillSelect(select, from, to, defaultLabel) {
  const opt0 = document.createElement('option');
  opt0.value = '';
  opt0.textContent = defaultLabel;
  opt0.disabled = true;
  opt0.selected = true;
  select.appendChild(opt0);
  for (let v = from; v <= to; v++) {
    const o = document.createElement('option');
    o.value = v;
    o.textContent = v;
    select.appendChild(o);
  }
}

// 선택된 년/월에 맞춰 "일" 개수를 다시 채움 (윤년/말일 처리)
function refreshDays() {
  const y = Number(yearSelect.value);
  const m = Number(monthSelect.value);
  const prev = daySelect.value;

  // 년/월이 아직 안 골라졌으면 1~31 로 채움
  const daysInMonth = (y && m) ? new Date(y, m, 0).getDate() : 31;

  daySelect.innerHTML = '';
  const opt0 = document.createElement('option');
  opt0.value = ''; opt0.textContent = '일'; opt0.disabled = true; opt0.selected = true;
  daySelect.appendChild(opt0);
  for (let d = 1; d <= daysInMonth; d++) {
    const o = document.createElement('option');
    o.value = d; o.textContent = d;
    daySelect.appendChild(o);
  }
  // 기존 선택이 여전히 유효하면 유지
  if (prev && Number(prev) <= daysInMonth) daySelect.value = prev;
}

function initInputs() {
  fillSelect(yearSelect, YEAR_MIN, YEAR_MAX, '년');
  fillSelect(monthSelect, 1, 12, '월');
  refreshDays();
  yearSelect.addEventListener('change', refreshDays);
  monthSelect.addEventListener('change', refreshDays);
}

/* ---------------- 멤버 썸네일 미리 로드(룰렛용) ----------------
   룰렛이 빠르게 돌 때 깜빡임을 줄이려고, 각 멤버 첫 사진의
   로드 성공 여부를 미리 확인해 둡니다. */
const memberThumb = MEMBERS.map((m) => ({ ok: false, src: m.images[0] }));
MEMBERS.forEach((m, i) => {
  const im = new Image();
  im.onload = () => { memberThumb[i].ok = true; };
  im.onerror = () => { memberThumb[i].ok = false; };
  im.src = m.images[0];
});

/* 슬롯(룰렛 한 칸)을 그림: 이미지가 있으면 이미지, 없으면 이름 플레이스홀더 */
function renderSlot(idx) {
  const m = MEMBERS[idx];
  const t = memberThumb[idx];
  if (t.ok) {
    slot.innerHTML =
      `<img class="slot-thumb" src="${t.src}" alt="${m.nameKo}">` +
      `<span class="slot-name">${m.nameKo}</span>`;
  } else {
    slot.innerHTML = `<span class="slot-name">${m.nameKo}</span>`;
  }
  // 한 칸 바뀔 때 살짝 튀는 애니메이션 재적용
  slot.classList.remove('tick');
  void slot.offsetWidth; // reflow 강제 → 애니메이션 재시작
  slot.classList.add('tick');
}

/* 룰렛 연출: 멤버를 빠르게 휙휙 돌리다가 점점 느려지며 finalIndex 에 멈춤.
   - 멈추는 결과(finalIndex)는 시드로 미리 정해진 값.
   - 약 1.8초 이상 돌고, 마지막에 finalIndex 에 정확히 착지. */
function runRoulette(finalIndex) {
  return new Promise((resolve) => {
    let idx = Math.floor(Math.random() * MEMBERS.length);
    const startT = performance.now();
    const minDuration = 1900; // ms (연출 최소 시간)

    function tick() {
      renderSlot(idx);
      const elapsed = performance.now() - startT;
      const t = Math.min(elapsed / minDuration, 1);
      // 처음엔 빠르게(60ms), 끝으로 갈수록 느리게(최대 ~300ms) — ease-out 느낌
      const delay = 60 + 250 * (t * t);

      // 시간이 충분히 지나고, 현재 칸이 목표 칸이면 멈춤
      if (elapsed >= minDuration && idx === finalIndex) {
        resolve();
      } else {
        idx = (idx + 1) % MEMBERS.length;
        setTimeout(tick, delay);
      }
    }
    tick();
  });
}

/* ---------------- 결과 카드 채우기 ---------------- */
function makePlaceholder(member) {
  const d = document.createElement('div');
  d.className = 'photo-placeholder';
  d.innerHTML = `<span class="ph-heart">♡</span><span class="ph-name">${member.nameKo}</span>`;
  return d;
}

// 카드 사진 영역 채우기: 이미지 시도 → 실패 시 플레이스홀더
function fillPhoto(container, member, src) {
  container.innerHTML = '';
  const img = new Image();
  img.className = 'photo-img';
  img.alt = member.nameKo;
  img.onerror = () => {
    container.innerHTML = '';
    container.appendChild(makePlaceholder(member));
  };
  img.src = src;
  container.appendChild(img);
}

function fillResultCard(result, dateStr) {
  memberNameEl.textContent = `${result.member.nameKo}!`;
  fillPhoto(memberPhotoEl, result.member, result.imageSrc);
  idiomKoEl.textContent = result.fortune.ko;
  idiomHanjaEl.textContent = result.fortune.hanja;
  fortuneDescEl.textContent = result.fortune.desc;
  resultDateEl.textContent = formatDateDot(dateStr);
}

/* =======================================================================
   캔버스로 9:16 저장 이미지 만들기 (외부 라이브러리 없이 순수 캔버스)
   - 화면에 보이는 카드와 별개로, 인스타 스토리(1080×1920) 비율로 꽉 차게 그림.
   - 멤버 이미지가 없으면 캔버스에도 동일하게 플레이스홀더를 그립니다.
   ======================================================================= */

// 이미지 로드 (성공/실패 여부와 함께 반환)
function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ ok: true, img });
    img.onerror = () => resolve({ ok: false, img: null });
    img.src = src;
  });
}

// 둥근 사각형 path
function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// 이미지를 영역에 "꽉 차게(cover)" 그리기 (가운데 크롭)
function drawImageCover(ctx, img, x, y, w, h) {
  const ir = img.width / img.height;
  const r = w / h;
  let sw, sh, sx, sy;
  if (ir > r) { sh = img.height; sw = sh * r; sx = (img.width - sw) / 2; sy = 0; }
  else        { sw = img.width;  sh = sw / r; sx = 0; sy = (img.height - sh) / 2; }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

// 한 줄 텍스트가 maxWidth 를 넘으면 여러 줄로 나눔 (한글 글자 단위 줄바꿈)
function wrapText(ctx, text, maxWidth) {
  const lines = [];
  let line = '';
  for (const ch of text) {
    const test = line + ch;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = ch;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

// 웹폰트가 캔버스에서 쓰이도록 미리 로드 (실패해도 시스템 폰트로 그려짐)
async function ensureCanvasFonts() {
  if (!document.fonts) return;
  try {
    await Promise.all([
      document.fonts.load('400 100px "Jua"'),
      document.fonts.load('400 36px "Noto Sans KR"'),
      document.fonts.load('500 34px "Noto Sans KR"'),
      document.fonts.load('700 58px "Noto Sans KR"'),
    ]);
    await document.fonts.ready;
  } catch (e) { /* 폰트 로드 실패는 무시하고 진행 */ }
}

/* 결과를 1080×1920 캔버스에 그려서 반환 */
async function renderShareCanvas(result, dateStr) {
  await ensureCanvasFonts();

  const W = 1080, H = 1920;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');

  // 배경 그라데이션
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, THEME.bg1);
  bg.addColorStop(1, THEME.bg2);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // 흰 카드
  const cardX = 70, cardY = 150, cardW = W - 140, cardH = H - 320;
  ctx.save();
  ctx.shadowColor = 'rgba(180,140,170,0.28)';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 18;
  roundRectPath(ctx, cardX, cardY, cardW, cardH, 56);
  ctx.fillStyle = THEME.card;
  ctx.fill();
  ctx.restore();

  ctx.textAlign = 'center';

  // 상단 라벨
  ctx.fillStyle = THEME.inkSoft;
  ctx.font = '500 38px "Noto Sans KR"';
  ctx.fillText('✨ 오늘의 최애는 ✨', W / 2, cardY + 95);

  // 멤버 이름 (강조)
  ctx.fillStyle = THEME.accentDeep;
  ctx.font = '400 110px "Jua"';
  ctx.fillText(result.member.nameKo + '!', W / 2, cardY + 215);

  // 사진 영역 (정사각형)
  const imgSize = cardW - 160;
  const imgX = (W - imgSize) / 2;
  const imgY = cardY + 280;
  const imgR = 44;

  const loaded = await loadImage(result.imageSrc);
  ctx.save();
  roundRectPath(ctx, imgX, imgY, imgSize, imgSize, imgR);
  ctx.clip();
  if (loaded.ok) {
    drawImageCover(ctx, loaded.img, imgX, imgY, imgSize, imgSize);
  } else {
    // 플레이스홀더 (그라데이션 + 멤버 이름)
    const pg = ctx.createLinearGradient(imgX, imgY, imgX + imgSize, imgY + imgSize);
    pg.addColorStop(0, THEME.accentSoft);
    pg.addColorStop(1, THEME.fortuneBg);
    ctx.fillStyle = pg;
    ctx.fillRect(imgX, imgY, imgSize, imgSize);
    ctx.fillStyle = THEME.accentDeep;
    ctx.font = '60px "Jua"';
    ctx.fillText('♡', W / 2, imgY + imgSize / 2 - 20);
    ctx.fillStyle = THEME.ink;
    ctx.font = '400 70px "Jua"';
    ctx.fillText(result.member.nameKo, W / 2, imgY + imgSize / 2 + 70);
  }
  ctx.restore();

  // 오늘의 운세 박스
  const fX = imgX, fW = imgSize;
  const fY = imgY + imgSize + 50;
  const fH = 360;
  roundRectPath(ctx, fX, fY, fW, fH, 36);
  ctx.fillStyle = THEME.fortuneBg;
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = THEME.fortuneBorder;
  ctx.stroke();

  // 운세 라벨
  ctx.fillStyle = THEME.lav;
  ctx.font = '700 32px "Noto Sans KR"';
  ctx.fillText('🔮 오늘의 운세', W / 2, fY + 70);

  // 사자성어 + 한자 (산세리프로, 적당한 크기)
  ctx.fillStyle = THEME.ink;
  ctx.font = '700 58px "Noto Sans KR"';
  ctx.fillText(result.fortune.ko, W / 2, fY + 160);
  ctx.fillStyle = THEME.inkSoft;
  ctx.font = '500 34px "Noto Sans KR"';
  ctx.fillText(result.fortune.hanja, W / 2, fY + 215);

  // 해설 (필요하면 두 줄로 줄바꿈)
  ctx.fillStyle = THEME.ink;
  ctx.font = '400 36px "Noto Sans KR"';
  const descLines = wrapText(ctx, result.fortune.desc, fW - 90);
  descLines.forEach((ln, i) => {
    ctx.fillText(ln, W / 2, fY + 285 + i * 48);
  });

  // 날짜
  ctx.fillStyle = THEME.inkSoft;
  ctx.font = '500 34px "Noto Sans KR"';
  ctx.fillText(formatDateDot(dateStr), W / 2, cardY + cardH - 50);

  // 카드 밖 하단 워터마크
  ctx.fillStyle = THEME.inkSoft;
  ctx.font = '500 30px "Noto Sans KR"';
  ctx.fillText('오늘의 최애는? · fromis_9 🤍', W / 2, H - 80);

  return canvas;
}

// 캔버스를 PNG Blob 으로
function canvasToBlob(canvas) {
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
}

// Blob 다운로드 (사진 저장하기의 기본 동작)
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // 약간의 지연 후 메모리 해제
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

function makeFilename(result, dateStr) {
  return `fromis9_최애_${result.member.nameEn}_${dateStr}.png`;
}

// 캔버스를 그려서 공유/저장용 File 객체로 만든다 (File 은 Blob 을 상속하므로
// downloadBlob·navigator.share 어디에도 그대로 넘길 수 있다)
async function buildShareFile(result, dateStr) {
  const canvas = await renderShareCanvas(result, dateStr);
  const blob = await canvasToBlob(canvas);
  return new File([blob], makeFilename(result, dateStr), { type: 'image/png' });
}

// 결과 화면이 뜨는 즉시 호출해서, 공유/저장 파일을 백그라운드로 미리 준비해둔다.
function prepareShareAsset(result, dateStr) {
  shareAssetPromise = buildShareFile(result, dateStr);
  return shareAssetPromise;
}

/* ---------------- 저장 / 공유 ---------------- */
async function handleSave() {
  if (!currentResult) return;
  saveBtn.disabled = true;
  const prev = saveBtn.textContent;
  saveBtn.textContent = '이미지 만드는 중…';
  try {
    // 미리 준비된 파일이 있으면 그걸 쓰고, 없으면(예외 상황) 그 자리에서 새로 만든다
    const file = shareAssetPromise
      ? await shareAssetPromise
      : await buildShareFile(currentResult.result, currentResult.dateStr);
    downloadBlob(file, makeFilename(currentResult.result, currentResult.dateStr));
  } catch (e) {
    alert('이미지를 저장하는 중 문제가 생겼어요. 다시 시도해 주세요.');
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = prev;
  }
}

// 파일 공유(Web Share API level 2)가 가능한 환경인지 검사
function canShareFiles() {
  try {
    if (!navigator.canShare || !navigator.share) return false;
    const probe = new File([new Blob()], 'probe.png', { type: 'image/png' });
    return navigator.canShare({ files: [probe] });
  } catch (e) {
    return false;
  }
}

async function handleShare() {
  if (!currentResult) return;
  shareBtn.disabled = true;
  const prev = shareBtn.textContent;
  try {
    // 클릭 시점에 바로 navigator.share() 를 호출하려고, 파일은 결과가 뜰 때부터
    // 미리 준비해둔 것(shareAssetPromise)을 사용한다. 클릭 후 캔버스를 새로
    // 그리면 그 시간 동안 "사용자 동작" 으로 인정되는 시간이 지나버려서
    // 브라우저가 공유를 막아버리는 경우가 있었다(특히 사진이 크거나 gif일 때).
    let file;
    if (shareAssetPromise) {
      file = await shareAssetPromise;
    } else {
      shareBtn.textContent = '준비 중…';
      file = await buildShareFile(currentResult.result, currentResult.dateStr);
    }

    const filename = makeFilename(currentResult.result, currentResult.dateStr);

    if (canShareFiles() && navigator.canShare({ files: [file] })) {
      // OS 공유 시트를 띄움 → 사용자가 인스타 등 앱을 선택.
      // canShare() 가 true 여도(특히 데스크탑) 실제 share() 는 받을 앱이 없어
      // 실패할 수 있으므로, 실패하면 "이미지 저장" 으로 자동 폴백한다.
      try {
        await navigator.share({
          files: [file],
          title: '오늘의 최애',
          text: `오늘의 최애는 ${currentResult.result.member.nameKo}! 🍓`,
        });
      } catch (err) {
        if (err && err.name === 'AbortError') return; // 사용자가 공유 시트를 닫음 → 조용히 종료
        // 그 외 오류(데스크탑 미지원, 받을 앱 없음 등) → 이미지 저장으로 폴백
        downloadBlob(file, filename);
        alert('이 기기에서는 바로 공유가 어려워 이미지를 저장했어요.\n저장된 사진을 인스타 등에 올려 주세요 🙂');
      }
    } else {
      // 애초에 파일 공유 미지원(데스크탑 등) → 저장으로 폴백
      downloadBlob(file, filename);
    }
  } catch (e) {
    // 이미지(캔버스) 만들기 자체가 실패한 경우
    alert('이미지를 준비하는 중 문제가 생겼어요. 사진 저장하기를 이용해 주세요.');
  } finally {
    shareBtn.disabled = false;
    shareBtn.textContent = prev;
  }
}

/* ---------------- 화면 전환 ---------------- */
async function showResult() {
  // 입력값 검증
  if (!yearSelect.value || !monthSelect.value || !daySelect.value) {
    inputError.hidden = false;
    return;
  }
  inputError.hidden = true;

  const birthStr = `${yearSelect.value}-${pad2(monthSelect.value)}-${pad2(daySelect.value)}`;
  const dateStr = todayStr();
  const result = computeResult(birthStr, dateStr);
  currentResult = { result, birthStr, dateStr };

  // 결과가 정해지자마자(룰렛 도는 동안) 공유/저장용 이미지를 백그라운드로 미리 준비.
  // 룰렛이 도는 1.9초를 그대로 활용하는 거라 사용자에게는 어떤 지연도 느껴지지 않는다.
  prepareShareAsset(result, dateStr);

  // 화면 전환
  inputScreen.hidden = true;
  resultScreen.hidden = false;
  resultCard.hidden = true;
  actionButtons.hidden = true;
  rouletteStage.style.display = '';

  // 룰렛 → 결과
  await runRoulette(result.memberIndex);
  fillResultCard(result, dateStr);

  // 룰렛 숨기고 카드 등장
  rouletteStage.style.display = 'none';
  resultCard.hidden = false;
  actionButtons.hidden = false;
}

function resetToInput() {
  resultScreen.hidden = true;
  inputScreen.hidden = false;
  currentResult = null;
  shareAssetPromise = null;
}

/* ---------------- 초기화 ---------------- */
function init() {
  initInputs();

  startBtn.addEventListener('click', showResult);
  retryBtn.addEventListener('click', resetToInput);
  saveBtn.addEventListener('click', handleSave);
  shareBtn.addEventListener('click', handleShare);

  // 파일 공유가 가능한 환경에서만 "공유하기" 버튼 표시 (데스크탑 등은 숨김)
  if (canShareFiles()) {
    shareBtn.hidden = false;
  }
}

document.addEventListener('DOMContentLoaded', init);

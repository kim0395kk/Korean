// main.js (접두어 삭제 버전)
let words = [];
let level = 1;
let stars = 0;
let current = {};
let bgm;

fetch('data_words.json')
  .then(r => r.json())
  .then(data => {
    words = data;
    startLevel(1);
  });

function startLevel(lv) {
  level = lv;
  document.getElementById('level-display').innerText = level + '교실';
  loadBgm(`level${level}_bgm.mp3`);          // ← audio/ 제거
  pickWord();
}

function loadBgm(src) {
  if (bgm) bgm.stop();
  bgm = new Howl({ src: [src], loop: true, volume: 0.4 });
  bgm.play();
}

function pickWord() {
  const pool = words.filter(w => w.level === level);
  current = pool[Math.floor(Math.random() * pool.length)];
  document.getElementById('word-text').innerText = current.word;
  document.getElementById('tip').innerText = current.tip;
  randomGhostSprite();
}

function randomGhostSprite() {
  const idx = Math.floor(Math.random() * 3) + 1;
  document.getElementById('ghost').src = `ghost${idx}.png`;  // img/ 제거
}

document.getElementById('speak-btn').addEventListener('click', () => {
  const rec = new webkitSpeechRecognition();
  rec.lang = 'ko-KR';
  rec.start();
  rec.onresult = e => {
    const said = e.results[0][0].transcript.trim();
    document.getElementById('spoken').innerText = '🗣️ ' + said;
    checkAnswer(said);
  };
});

function checkAnswer(said) {
  if (said === current.word) {
    stars++;
    document.getElementById('result').innerText = '정답! ⭐';
    document.getElementById('ghost').src = 'happy.png';          // img/ 제거
    new Howl({ src: ['success.mp3'] }).play();                   // audio/ 제거
    document.getElementById('star-display').innerText = '⭐ ' + stars;

    if (stars % 5 === 0) {            // 5개 별 → 다음 레벨
      level = Math.min(level + 1, 5);
      startLevel(level);
      return;
    }
    setTimeout(() => {
      document.getElementById('result').innerText = '';
      pickWord();
    }, 1500);
  } else {
    document.getElementById('result').innerText = '다시 한번!';
    new Howl({ src: ['fail.mp3'] }).play();                      // audio/ 제거
  }
}

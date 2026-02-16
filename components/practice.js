import { categories } from '../data.js?v=4';
import { startListening, speak } from '../utils/speech.js?v=4';
import { comparePronunciation } from '../utils/similarity.js?v=4';

let isListening = false;

export function renderPractice(categoryId, phraseIndex) {
  const cat = categories.find(c => c.id === categoryId);
  if (!cat) return '<p class="error">카테고리를 찾을 수 없습니다.</p>';

  const idx = parseInt(phraseIndex);
  const phrase = cat.phrases[idx];
  if (!phrase) return '<p class="error">표현을 찾을 수 없습니다.</p>';

  const hasPrev = idx > 0;
  const hasNext = idx < cat.phrases.length - 1;

  return `
    <header class="page-header practice-header" style="--card-color: ${cat.color}">
      <a href="#/category/${cat.id}" class="back-btn">← ${cat.title}</a>
      <span class="page-progress">${idx + 1} / ${cat.phrases.length}</span>
    </header>

    <main class="practice-container">
      <div class="practice-card glass-card">
        <div class="practice-label">영어 표현</div>
        <p class="practice-en" id="targetPhrase">${phrase.en}</p>
        <p class="practice-ko">${phrase.ko}</p>

        <button class="listen-btn" id="listenBtn" title="원어민 발음 듣기">
          🔊 <span>발음 듣기</span>
        </button>
      </div>

      <div class="mic-section">
        <button class="mic-btn" id="micBtn" title="마이크를 눌러 말해보세요">
          <span class="mic-icon">🎤</span>
          <span class="mic-text">눌러서 말하기</span>
          <div class="mic-pulse"></div>
        </button>
      </div>

      <div class="result-section" id="resultSection" style="display: none;">
        <div class="result-card glass-card" id="resultCard">
          <div class="result-score-wrap">
            <div class="result-score" id="resultScore">0</div>
            <div class="result-score-label">점</div>
          </div>
          <p class="result-message" id="resultMessage"></p>
          <div class="result-comparison">
            <div class="comparison-row">
              <span class="comparison-label">정답</span>
              <span class="comparison-text" id="targetText"></span>
            </div>
            <div class="comparison-row">
              <span class="comparison-label">내 발음</span>
              <span class="comparison-text spoken" id="spokenText"></span>
            </div>
          </div>
        </div>
      </div>

      <nav class="practice-nav">
        ${hasPrev ? `<a href="#/practice/${cat.id}/${idx - 1}" class="nav-btn prev-btn">← 이전</a>` : '<span></span>'}
        ${hasNext ? `<a href="#/practice/${cat.id}/${idx + 1}" class="nav-btn next-btn">다음 →</a>` : `<a href="#/category/${cat.id}" class="nav-btn next-btn">목록으로</a>`}
      </nav>
    </main>
  `;
}

export function initPractice() {
  const micBtn = document.getElementById('micBtn');
  const listenBtn = document.getElementById('listenBtn');
  const resultSection = document.getElementById('resultSection');

  if (!micBtn) return;

  // 발음 듣기 (TTS)
  listenBtn?.addEventListener('click', async () => {
    const text = document.getElementById('targetPhrase').textContent;
    listenBtn.classList.add('playing');
    await speak(text);
    listenBtn.classList.remove('playing');
  });

  // 마이크 버튼 클릭
  micBtn.addEventListener('click', async () => {
    if (isListening) return;
    isListening = true;

    micBtn.classList.add('listening');
    micBtn.querySelector('.mic-text').textContent = '듣고 있어요...';
    resultSection.style.display = 'none';

    try {
      const { transcript } = await startListening();
      const target = document.getElementById('targetPhrase').textContent;
      const result = comparePronunciation(transcript, target);

      showResult(result);
    } catch (err) {
      showError(err.message);
    } finally {
      isListening = false;
      micBtn.classList.remove('listening');
      micBtn.querySelector('.mic-text').textContent = '눌러서 말하기';
    }
  });
}

function showResult(result) {
  console.log('showResult called with:', result); // 디버깅: 전체 결과 확인
  if (result.words) console.log('Words data:', result.words); // 디버깅: 단어 데이터 확인

  const section = document.getElementById('resultSection');
  const card = document.getElementById('resultCard');
  const scoreEl = document.getElementById('resultScore');
  const messageEl = document.getElementById('resultMessage');
  const targetEl = document.getElementById('targetText');
  const spokenEl = document.getElementById('spokenText');

  section.style.display = 'block';

  // 색상 레벨 설정
  card.className = `result-card glass-card level-${result.level}`;

  // 점수 애니메이션
  let currentScore = 0;
  const targetScore = result.score;
  const step = Math.max(1, Math.floor(targetScore / 30));
  const interval = setInterval(() => {
    currentScore = Math.min(currentScore + step, targetScore);
    scoreEl.textContent = currentScore;
    if (currentScore >= targetScore) clearInterval(interval);
  }, 30);

  messageEl.textContent = result.message;

  // 단어별 렌더링 (틀린 부분 강조 및 클릭 시 발음 듣기)
  if (result.words && result.words.length > 0) {
    targetEl.innerHTML = result.words.map(word => {
      // 텍스트 정제 (따옴표 등 이스케이프 처리 필요 시)
      const cleanText = word.text.replace(/"/g, '&quot;');
      return `<span class="feedback-word ${word.isCorrect ? 'correct' : 'incorrect'}" data-word="${cleanText}" title="클릭하여 발음 듣기">${word.text}</span>`;
    }).join(' ');

    // 이벤트 위임 방식으로 변경 (기존 리스너 제거 효과)
    targetEl.onclick = async (e) => {
      const wordEl = e.target.closest('.feedback-word');
      if (!wordEl) return;

      const text = wordEl.getAttribute('data-word');
      if (!text) return;

      console.log('Speaking word:', text); // 디버깅용

      wordEl.classList.add('playing');
      try {
        await speak(text);
      } catch (err) {
        console.error('TTS Error:', err);
      } finally {
        wordEl.classList.remove('playing');
      }
    };

  } else {
    targetEl.textContent = result.target;
    targetEl.onclick = null; // 이벤트 제거
  }

  spokenEl.textContent = result.spoken;

  // 스크롤
  section.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function showError(message) {
  const section = document.getElementById('resultSection');
  const card = document.getElementById('resultCard');
  const messageEl = document.getElementById('resultMessage');

  section.style.display = 'block';
  card.className = 'result-card glass-card level-error';
  document.getElementById('resultScore').textContent = '!';
  messageEl.textContent = message;
  document.getElementById('targetText').textContent = '';
  document.getElementById('spokenText').textContent = '';
}

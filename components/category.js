import { categories } from '../data.js?v=4';

export function renderCategory(categoryId) {
  const cat = categories.find(c => c.id === categoryId);
  if (!cat) return '<p class="error">카테고리를 찾을 수 없습니다.</p>';

  return `
    <header class="page-header" style="--card-color: ${cat.color}">
      <a href="#/" class="back-btn">← 돌아가기</a>
      <div class="page-header-content">
        <span class="page-icon">${cat.icon}</span>
        <h1>${cat.title} <span class="title-ko">${cat.titleKo}</span></h1>
      </div>
    </header>
    <main class="phrases-list">
      ${cat.phrases.map((phrase, idx) => `
        <a href="#/practice/${cat.id}/${idx}" class="phrase-card" style="--card-color: ${cat.color}; --delay: ${idx * 0.05}s">
          <div class="phrase-number">${String(idx + 1).padStart(2, '0')}</div>
          <div class="phrase-content">
            <p class="phrase-en">${phrase.en}</p>
            <p class="phrase-ko">${phrase.ko}</p>
          </div>
          <div class="phrase-arrow">🎤</div>
        </a>
      `).join('')}
    </main>
  `;
}

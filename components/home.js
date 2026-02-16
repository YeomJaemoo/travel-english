import { categories } from '../data.js?v=4';

export function renderHome() {
  return `
    <header class="hero">
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="hero-icon">🌍</span>
          Travel English
        </h1>
        <p class="hero-subtitle">여행에서 바로 쓰는 영어회화</p>
        <p class="hero-desc">상황을 선택하고, 직접 말해보세요!</p>
      </div>
    </header>
    <main class="categories-grid">
      ${categories.map(cat => `
        <a href="#/category/${cat.id}" class="category-card" style="--card-color: ${cat.color}">
          <div class="card-icon">${cat.icon}</div>
          <div class="card-info">
            <h2 class="card-title">${cat.title}</h2>
            <p class="card-subtitle">${cat.titleKo}</p>
            <span class="card-count">${cat.phrases.length}개 표현</span>
          </div>
          <div class="card-arrow">→</div>
        </a>
      `).join('')}
    </main>
  `;
}

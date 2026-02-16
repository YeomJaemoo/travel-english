import { renderHome } from './components/home.js?v=4';
import { renderCategory } from './components/category.js?v=4';
import { renderPractice, initPractice } from './components/practice.js?v=4';

const app = document.getElementById('app');

function router() {
    const hash = window.location.hash || '#/';
    const parts = hash.replace('#/', '').split('/');

    let html = '';

    if (parts[0] === 'category' && parts[1]) {
        html = renderCategory(parts[1]);
    } else if (parts[0] === 'practice' && parts[1] && parts[2] !== undefined) {
        html = renderPractice(parts[1], parts[2]);
    } else {
        html = renderHome();
    }

    app.innerHTML = html;
    app.scrollTop = 0;
    window.scrollTo(0, 0);

    // Practice 페이지일 때 이벤트 바인딩
    if (parts[0] === 'practice') {
        initPractice();
    }

    // 카드 등장 애니메이션
    requestAnimationFrame(() => {
        document.querySelectorAll('.category-card, .phrase-card').forEach(card => {
            card.classList.add('visible');
        });
    });
}

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);

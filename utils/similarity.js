// Levenshtein distance 기반 문자열 유사도 계산
function levenshtein(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b[i - 1] === a[j - 1]) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    return matrix[b.length][a.length];
}

/**
 * 두 문자열 간의 유사도를 0~100 점수로 반환하고 단어별 피드백 제공
 * @param {string} spoken - 사용자가 말한 텍스트
 * @param {string} target - 정답 텍스트
 * @returns {{ score: number, level: string, message: string, words: Array<{ text: string, isCorrect: boolean }> }}
 */
export function comparePronunciation(spoken, target) {
    const sClean = spoken.toLowerCase().replace(/[^\w\s]/g, '').trim();
    const tClean = target.toLowerCase().replace(/[^\w\s]/g, '').trim();

    if (!sClean) return { score: 0, level: 'error', message: '음성이 인식되지 않았습니다.', words: [] };

    // 전체 유사도 계산
    const distance = levenshtein(sClean, tClean);
    const maxLen = Math.max(sClean.length, tClean.length);
    const score = Math.round(((maxLen - distance) / maxLen) * 100);

    // 단어별 비교
    const spokenWords = sClean.split(/\s+/);
    const targetWordsWithPunctuation = target.split(/\s+/);

    const wordFeedback = targetWordsWithPunctuation.map(targetWord => {
        const cleanTarget = targetWord.toLowerCase().replace(/[^\w\s]/g, '');

        // 단순 포함 여부보다 조금 더 나은 방식: 말한 단어들 중 가장 유사한 단어 찾기
        let bestWordScore = 0;
        spokenWords.forEach(spokenWord => {
            const dist = levenshtein(cleanTarget, spokenWord);
            const maxWLen = Math.max(cleanTarget.length, spokenWord.length);
            const wScore = ((maxWLen - dist) / maxWLen);
            if (wScore > bestWordScore) bestWordScore = wScore;
        });

        return {
            text: targetWord,
            isCorrect: bestWordScore > 0.8 // 80% 이상 유사하면 맞은 것으로 간주 (기준 강화)
        };
    });

    let level, message;
    if (score >= 90) {
        level = 'excellent';
        message = '🎉 훌륭해요! 완벽에 가까운 발음입니다!';
    } else if (score >= 70) {
        level = 'good';
        message = '👍 좋아요! 조금 더 연습하면 완벽해질 거예요.';
    } else if (score >= 50) {
        level = 'fair';
        message = '💪 괜찮아요! 천천히 다시 한번 따라해 보세요.';
    } else {
        level = 'poor';
        message = '🔄 다시 도전해 보세요! 틀린 단어 위주로 연습해볼까요?';
    }

    return {
        score,
        level,
        message,
        spoken: sClean,
        target: tClean,
        words: wordFeedback
    };
}

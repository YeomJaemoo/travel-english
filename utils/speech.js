// Web Speech API 래퍼
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

/**
 * 음성 인식을 시작하고 결과를 Promise로 반환
 * @returns {Promise<{ transcript: string, recognition: SpeechRecognition }>}
 */
export function startListening() {
    return new Promise((resolve, reject) => {
        if (!SpeechRecognition) {
            reject(new Error('이 브라우저는 음성 인식을 지원하지 않습니다. Chrome 또는 Edge를 사용해 주세요.'));
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.continuous = false;

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            resolve({ transcript, confidence: event.results[0][0].confidence });
        };

        recognition.onerror = (event) => {
            if (event.error === 'no-speech') {
                reject(new Error('음성이 감지되지 않았습니다. 다시 시도해 주세요.'));
            } else if (event.error === 'not-allowed') {
                reject(new Error('마이크 접근이 차단되었습니다. 브라우저 설정에서 마이크를 허용해 주세요.'));
            } else {
                reject(new Error(`음성 인식 오류: ${event.error}`));
            }
        };

        recognition.onend = () => {
            // 결과 없이 종료된 경우
        };

        recognition.start();
    });
}

/**
 * TTS로 텍스트를 읽어줌
 * @param {string} text
 */
export function speak(text) {
    return new Promise((resolve) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.85;
        utterance.pitch = 1;
        utterance.onend = resolve;
        speechSynthesis.speak(utterance);
    });
}

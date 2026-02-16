# Travel English Practice App 🌍

여행지에서 바로 쓸 수 있는 영어 회화 연습 웹 앱입니다.

## 주요 기능 (Features)
- **6가지 상황별 회화**: 공항, 호텔, 식당, 쇼핑, 교통, 긴급상황
- **음성 인식 (Web Speech API)**: 크롬 브라우저에서 마이크 버튼을 누르고 말하면 인식
- **발음 교정 (Pronunciation Check)**: 사용자의 발음과 정답 문장을 비교하여 유사도 점수 제공 (80점 이상 합격)
- **단어별 피드백**: 틀린 단어는 빨간색으로 표시, 클릭 시 원어민 발음 듣기 가능
- **다크 모드 & 글래스모피즘 디자인**: 세련된 UI/UX

## 실행 방법 (Locally)
1. 이 저장소를 클론합니다.
2. `Live Server` 확장 프로그램이나 `http-server` 등으로 `index.html`을 실행합니다.
   ```bash
   npx http-server .
   ```
3. 브라우저(Chrome 권장)에서 `http://localhost:8080` 접속

## 배포 (Deployment)
GitHub Pages 설정에서 `Source`를 `main` 브랜치로 선택하면 바로 배포됩니다.

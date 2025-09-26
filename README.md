# Tri-Pacer - Triathlon Pace Calculator

철인 3종 경기의 목표 시간을 달성하기 위한 페이스를 계산하는 웹 애플리케이션입니다.

🌐 **Live Demo**: [https://triathlonpacecalculator.pages.dev](https://triathlonpacecalculator.pages.dev)

## 📱 주요 기능

- **다양한 코스 지원**: 스프린트, 올림픽, 하프 아이언맨, 아이언맨 코스
- **페이스 계산기**: 목표 시간 기반 종목별 페이스 자동 계산
- **세계 기록 비교**: 현재 세계 기록과 비교하여 현실적인 목표 설정
- **맞춤형 트레이닝 팁**: 계산된 페이스에 따른 트레이닝 조언 제공
- **TCX 파일 내보내기**: Garmin 등 GPS 디바이스용 가상 코스 생성
- **다크 모드**: 눈의 피로를 줄이는 다크 테마 지원
- **다국어 지원**: 한국어/영어 전환 가능

## 🚀 시작하기

### 필수 요구사항

- Node.js 18.0 이상
- npm 또는 yarn

### 설치

```bash
# 저장소 클론
git clone https://github.com/miracle380301/TriathlonPaceCalculator.git
cd TriathlonPaceCalculator

# 의존성 설치
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173`으로 접속합니다.

### 프로덕션 빌드

```bash
npm run build
npm run start
```

## 🛠️ 기술 스택

- **프론트엔드**
  - React 18 + TypeScript
  - Vite (빌드 도구)
  - TailwindCSS (스타일링)
  - Radix UI (UI 컴포넌트)
  - React Hook Form (폼 관리)
  - Framer Motion (애니메이션)

- **백엔드**
  - Hono (웹 프레임워크)
  - Express (서버)

- **배포**
  - Cloudflare Pages

## 📁 프로젝트 구조

```
TriathlonPaceCalculator/
├── client/
│   ├── src/
│   │   ├── components/     # React 컴포넌트
│   │   │   ├── ui/         # 재사용 가능한 UI 컴포넌트
│   │   │   └── ...         # 비즈니스 로직 컴포넌트
│   │   ├── contexts/       # React Context (테마, 언어)
│   │   ├── hooks/          # 커스텀 훅
│   │   ├── lib/           # 유틸리티 함수
│   │   │   ├── calculator.ts  # 페이스 계산 로직
│   │   │   └── createTcx.ts   # TCX 파일 생성
│   │   └── pages/         # 페이지 컴포넌트
│   └── index.html
├── package.json
└── README.md
```

## 🎯 주요 기능 설명

### 페이스 계산
목표 시간을 입력하면 각 종목별 권장 페이스를 자동으로 계산합니다:
- **수영**: 100m당 페이스 (분:초)
- **자전거**: 평균 속도 (km/h)
- **달리기**: km당 페이스 (분:초)

### 트레이닝 팁
계산된 페이스를 기반으로 맞춤형 트레이닝 조언을 제공합니다:
- 각 종목별 트레이닝 방법
- 권장 운동 강도
- 개선이 필요한 부분 피드백

### TCX 파일 내보내기
Garmin Connect, Strava 등에서 사용할 수 있는 가상 코스 파일을 생성합니다.

## 🤝 기여하기

프로젝트 개선에 기여하고 싶으시다면:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🌟 기능 요청 및 버그 리포트

이슈 트래커를 통해 버그를 신고하거나 새로운 기능을 제안해주세요.

## 📧 문의

프로젝트 관련 문의사항이 있으시면 이슈를 등록해주세요.

---

Made with ❤️ for Triathletes

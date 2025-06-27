# Tri-Pacer - 한국어 트라이애슬론 페이스 계산기

## 프로젝트 개요
올림픽(1.5km-40km-10km)과 아이언맨(3.8km-180km-42.195km) 거리의 트라이애슬론 목표 시간 달성을 위한 종목별 페이스 계산기입니다.

## 주요 기능
- 🏊 수영, 🚴 자전거, 🏃 달리기 각 종목별 목표 페이스 계산
- ⏱️ 현재 페이스 vs 목표 페이스 비교 분석
- 💡 목표 달성을 위한 구체적인 개선 제안
- 🏆 세계 신기록 달성 여부 확인
- 🇰🇷 완전한 한국어 인터페이스

## 최근 변경사항 (2025-01-27)
✓ 백엔드 완전 제거 - 프론트엔드 전용으로 변경 완료
✓ PostgreSQL 데이터베이스 및 Strava API 연동 제거
✓ 현재 페이스 입력 기능 추가
✓ 목표 vs 현재 페이스 비교 분석 구현
✓ 전체 시간 차이 계산 및 표시
✓ 종목별 개선 제안 (단축 시간, 속도 향상) 추가
✓ Vite 개발 서버 설정 완료 (localhost:5000)
✓ 완전한 프론트엔드 전용 계산기 구현
✓ 비용 없는 완전한 클라이언트 사이드 솔루션

## 아키텍처
- **Frontend**: React + TypeScript + Vite
- **UI Framework**: Tailwind CSS + shadcn/ui
- **상태 관리**: React useState
- **계산 로직**: 클라이언트 사이드 JavaScript
- **배포**: Replit Static Hosting

## 사용자 선호사항
- 한국어 인터페이스 필수
- 간단하고 직관적인 사용자 경험
- 비용 발생 없는 솔루션 선호
- 실시간 계산 및 즉시 피드백

## 핵심 계산 로직
1. 목표 시간에서 전환 시간(T1, T2) 제외
2. 종목별 시간 배분 (올림픽: 수영 20%, 자전거 55%, 달리기 25%)
3. 거리별 페이스 계산 (수영: 100m당, 달리기: km당, 자전거: km/h)
4. 현재 페이스와 비교하여 개선점 도출
5. 목표 달성을 위한 구체적 수치 제시

## 파일 구조
```
client/
├── src/
│   ├── components/
│   │   ├── course-selection.tsx
│   │   ├── goal-time-form.tsx
│   │   ├── results-display.tsx
│   │   ├── world-record-alert.tsx
│   │   └── training-tips.tsx
│   ├── pages/
│   │   ├── calculator.tsx
│   │   └── not-found.tsx
│   ├── lib/
│   │   └── calculator.ts
│   └── App.tsx
```

## 개발 명령어
- 개발 서버: `cd client && npx vite --host 0.0.0.0 --port 5000`
- 프로덕션 빌드: `cd client && npx vite build`
- 빌드 미리보기: `cd client && npx vite preview`

## 현재 상태
- ✅ 프론트엔드 전용 애플리케이션으로 완전 전환
- ✅ Vite 개발 서버 실행 중 (http://localhost:5000)
- ✅ 목표 시간 입력 → 종목별 목표 페이스 계산
- ✅ 현재 페이스 입력 → 목표 vs 현재 비교 분석
- ✅ 시간 차이 및 개선 제안 표시
- ✅ 세계 신기록 검증 기능
- ✅ 완전한 한국어 UI
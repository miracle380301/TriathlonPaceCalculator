import React, { createContext, useContext, useState } from 'react';

type Language = 'ko' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  ko: {
    appTitle: '철인 3종 목표페이스 계산기',
    courseSelection: '코스 선택',
    olympicCourse: '올림픽 코스',
    ironmanCourse: '아이언맨 코스',
    swimming: '수영',
    cycling: '사이클',
    running: '달리기',
    worldRecord: '세계 기록',
    men: '남자',
    women: '여자',
    goalTimeInput: '목표 시간 입력',
    hours: '시간',
    minutes: '분',
    seconds: '초',
    currentPaceInput: '현재 페이스 입력',
    currentPace: '현재 페이스',
    swimPace: '수영 페이스',
    bikePace: '자전거 페이스',
    runPace: '달리기 페이스',
    perSwimUnit: '초/100m',
    perBikeUnit: 'km/h',
    perRunUnit: '초/km',
    calculate: '계산하기',
    reset: '초기화',
    results: '결과',
    targetPace: '목표 페이스',
    comparison: '비교 분석',
    timeDifference: '시간 차이',
    improvement: '개선 필요',
    canAchieve: '목표 달성 가능',
    cannotAchieve: '목표 달성 어려움',
    worldRecordAlert: '세계 기록 달성!',
    trainingTips: '훈련 팁',
    selectCourse: '코스를 선택해주세요',
    selectCourseDescription: '올림픽 코스 또는 아이언맨 코스를 선택해주세요.',
    enterGoalTime: '목표시간을 입력해주세요',
    enterGoalTimeDescription: '완주하고 싶은 목표시간을 입력해주세요.',
    calculationError: '계산 오류',
    calculationErrorDescription: '입력값을 확인해주세요.',
    invalidTime: '유효한 시간을 입력해주세요',
    appDescription: '트라이애슬론 목표 시간을 위한 종목별 페이스 계산기',
    faster: '더 빠르게',
    slower: '더 느리게',
    lightMode: '라이트 모드',
    darkMode: '다크 모드',
    korean: '한국어',
    english: 'English',
    // World Record Alert
    worldRecordChallenge: '와우! 당신은 세계 신기록에 도전하시는 군요.',
    worldRecordDescription: '입력하신 시간이 현재 세계기록보다 빠릅니다!',
    // Training Tips
    trainingTipsTitle: '훈련 팁',
    swimTraining: '수영 훈련',
    swimTrainingDesc: '오픈워터 수영 연습과 웻슈트 착용 훈련을 병행하세요.',
    cycleTraining: '사이클 훈련',
    cycleTrainingDesc: '지속적인 파워 유지와 에어로 포지션 연습이 중요합니다.',
    runTraining: '달리기 훈련',
    runTrainingDesc: '사이클 후 달리기(브릭 운동) 연습을 꾸준히 하세요.',
    // Results Display
    expectedPaceTime: '예상 페이스 및 시간',
    tcxDownload: 'TCX 파일 다운로드',
    per100m: '100m당',
    totalTime: '총 시간',
    averageSpeed: '평균 속도',
    perKm: 'km당',
    t1Transition: 'T1 (수영→자전거)',
    t2Transition: 'T2 (자전거→달리기)',
    raceTime: '경기시간',
    goalTimeTitle: '목표 시간',
    totalTimeDifference: '전체 시간 차이',
    slowerthanGoal: '목표보다',
    slowTime: '느림',
    fasterThanGoal: '목표보다',
    fastTime: '빠름',
    sameAsGoal: '목표 시간과 동일',
    improvementSuggestions: '개선 제안',
    improvementDesc: '목표 시간에 가까워지려면 각 종목에서 이렇게 시도해보세요',
    reduce: '단축',
    increase: '향상',
    // Goal Time Form
    goalTimeInputTitle: '목표시간 입력',
    goalFinishTime: '목표 완주시간',
    transitionTime: '바꿈터 시간 (선택)',
    swimToCycle: '수영→사이클',
    cycleToRun: '사이클→달리기',
    expectedPaceInput: '예상종목별 페이스 입력',
    minPer100m: '분 /100m',
    minPerKm: '분 /km',
    calculatePace: '페이스 계산하기'
  },
  en: {
    appTitle: 'Triathlon Pace Calculator',
    courseSelection: 'Course Selection',
    olympicCourse: 'Olympic Course',
    ironmanCourse: 'Ironman Course',
    swimming: 'Swimming',
    cycling: 'Cycling',
    running: 'Running',
    worldRecord: 'World Record',
    men: 'Men',
    women: 'Women',
    goalTimeInput: 'Goal Time Input',
    hours: 'Hours',
    minutes: 'Minutes',
    seconds: 'Seconds',
    currentPaceInput: 'Current Pace Input',
    currentPace: 'Current Pace',
    swimPace: 'Swim Pace',
    bikePace: 'Bike Pace',
    runPace: 'Run Pace',
    perSwimUnit: 'sec/100m',
    perBikeUnit: 'km/h',
    perRunUnit: 'sec/km',
    calculate: 'Calculate',
    reset: 'Reset',
    results: 'Results',
    targetPace: 'Target Pace',
    comparison: 'Comparison Analysis',
    timeDifference: 'Time Difference',
    improvement: 'Improvement Needed',
    canAchieve: 'Goal Achievable',
    cannotAchieve: 'Goal Difficult',
    worldRecordAlert: 'World Record Achieved!',
    trainingTips: 'Training Tips',
    selectCourse: 'Please select a course',
    selectCourseDescription: 'Please select either Olympic or Ironman course.',
    enterGoalTime: 'Please enter goal time',
    enterGoalTimeDescription: 'Please enter your target finish time.',
    calculationError: 'Calculation error',
    calculationErrorDescription: 'Please check your input values.',
    invalidTime: 'Please enter a valid time',
    appDescription: 'Triathlon pace calculator for achieving your goal time by sport',
    faster: 'Faster',
    slower: 'Slower',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    korean: '한국어',
    english: 'English',
    // World Record Alert
    worldRecordChallenge: 'Wow! You are challenging the world record!',
    worldRecordDescription: 'Your input time is faster than the current world record!',
    // Training Tips
    trainingTipsTitle: 'Training Tips',
    swimTraining: 'Swimming Training',
    swimTrainingDesc: 'Practice open water swimming and wetsuit training together.',
    cycleTraining: 'Cycling Training',
    cycleTrainingDesc: 'Maintaining consistent power and practicing aero position is important.',
    runTraining: 'Running Training',
    runTrainingDesc: 'Practice brick workouts (cycling to running) consistently.',
    // Results Display
    expectedPaceTime: 'Expected Pace & Time',
    tcxDownload: 'Download TCX File',
    per100m: 'per 100m',
    totalTime: 'Total Time',
    averageSpeed: 'Average Speed',
    perKm: 'per km',
    t1Transition: 'T1 (Swim→Bike)',
    t2Transition: 'T2 (Bike→Run)',
    raceTime: 'Race Time',
    goalTimeTitle: 'Goal Time',
    totalTimeDifference: 'Total Time Difference',
    slowerthanGoal: 'Slower than goal by',
    slowTime: 'slower',
    fasterThanGoal: 'Faster than goal by',
    fastTime: 'faster',
    sameAsGoal: 'Same as goal time',
    improvementSuggestions: 'Improvement Suggestions',
    improvementDesc: 'To get closer to your goal time, try these improvements in each discipline',
    reduce: 'reduce',
    increase: 'increase',
    // Goal Time Form
    goalTimeInputTitle: 'Goal Time Input',
    goalFinishTime: 'Goal Finish Time',
    transitionTime: 'Transition Time (Optional)',
    swimToCycle: 'Swim→Cycle',
    cycleToRun: 'Cycle→Run',
    expectedPaceInput: 'Expected Pace Input by Sport',
    minPer100m: 'min /100m',
    minPerKm: 'min /km',
    calculatePace: 'Calculate Pace'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'ko';
  });

  const toggleLanguage = () => {
    const newLanguage = language === 'ko' ? 'en' : 'ko';
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[Language]] || key;
  };

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    t,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
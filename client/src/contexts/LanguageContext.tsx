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
    goalTime: '목표 시간',
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
    english: 'English'
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
    goalTime: 'Goal Time',
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
    english: 'English'
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
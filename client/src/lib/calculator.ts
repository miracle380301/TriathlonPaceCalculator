export interface CourseData {
  swim: number;
  bike: number;
  run: number;
}

export interface WorldRecord {
  men: number;
  women: number;
}

export interface WorldRecords {
  olympic: WorldRecord;
  ironman: WorldRecord;
}

export interface PaceResult {
  swimPace: { minutes: number; seconds: number };
  bikeSpeed: number;
  runPace: { minutes: number; seconds: number };
  swimTime: number;
  bikeTime: number;
  runTime: number;
  isWorldRecord: boolean;
  
  totalGoalSeconds: number;            // 목표 총시간
  totalGoalRaceTimeSeconds: number;    // 목표 경기시간
  totalPredictSeconds: number;         // 예상 총시간
  totalPredictRaceTimeSeconds: number; // 예상 경기시간

  totalRaceDiffernce: string;
  totalRaceDiffernceStatus: string;
  totalDiffernce: string;
  totalDiffernceStatus: string;

  comparison?: {
    totalTimeDifference: number; // in seconds
    improvementSuggestions: ImprovementSuggestion
  };
}

export const courseData: Record<string, CourseData> = {
  olympic: {
    swim: 1.5,
    bike: 40,
    run: 10
  },
  ironman: {
    swim: 3.8,
    bike: 180,
    run: 42.195
  }
};

export const worldRecords: WorldRecords = {
  olympic: {
    men: 6049,    // 1:40:49 in seconds
    women: 6808   // 1:53:28 in seconds
  },
  ironman: {
    men: 27339,   // 7:35:39 in seconds
    women: 29893  // 8:18:13 in seconds
  }
};

interface ImprovementInput {
  overSeconds: number;
  swimTime: number;
  bikeTime: number;
  runTime: number;
  swimTimeDiff: number;
  runPaceDiff: number;
  bikeSpeedDiff: number;
}

interface CurrentStats {
  swimPer100mSeconds: number;  // 예: 2분10초 = 130초
  bikeSpeedKmh: number;        // 예: 31
  runPaceSecondsPerKm: number; // 예: 5분30초 = 330초
  swimDistanceM: number;       // 예: 1500
  bikeDistanceKm: number;      // 예: 40 (임의 설정)
  runDistanceKm: number;       // 예: 10
}

interface ImprovementSuggestion {
  swimTimeReduceSeconds: number;
  bikeSpeedIncreaseKmh: number;
  runPaceReduceSecondsPerKm: number;
  totalTimeReduceSeconds: number;
  messages: string[];
  swim: {
    reduceSeconds: string;
    newPace: string;
  },
  bike: {
    increaseKmh: string;
    newSpeed: string;
  },
  run: {
    reduceSeconds: string;
    newPace: string;
  }
}

function suggestImprovement(
  current: CurrentStats,
  targetReduceSeconds: number
): ImprovementSuggestion {
  // 수영 목표 단축: 전체 단축시간의 15% 배정 (현실적 가정)
  const swimTargetReduce = targetReduceSeconds * 0.15;

  // 자전거 목표 단축: 전체 단축시간의 30%
  const bikeTargetReduce = targetReduceSeconds * 0.40;

  // 달리기 목표 단축: 전체 단축시간의 20%
  const runTargetReduce = targetReduceSeconds * 0.15;

  // 나머지 25%는 전환 등 기타 시간으로 가정 (계산에서 제외)

  // 수영 단축을 초당 페이스 단축으로 변환
  // 현재 총 수영 시간 = (swimPer100mSeconds) * (swimDistanceM / 100)
  
  const currentSwimTime = current.swimPer100mSeconds * (current.swimDistanceM / 100);
  const newSwimTime = currentSwimTime - swimTargetReduce;
  const newSwimPace = newSwimTime / (current.swimDistanceM / 100);

  // 자전거 속도 향상: 현재 속도 + 속도 증가량으로 시간 단축 달성 계산
  // 시간 = 거리 / 속도
  // 목표 시간 = 현재 시간 - bikeTargetReduce
  const currentBikeTime = current.bikeDistanceKm / current.bikeSpeedKmh * 3600; // 초 단위
  const targetBikeTime = currentBikeTime - bikeTargetReduce;
  const newBikeSpeed = current.bikeDistanceKm / (targetBikeTime / 3600);

  // 달리기 페이스 단축 (초/km 단축)
  // 현재 총 달리기 시간 = runPaceSecondsPerKm * runDistanceKm
  // 목표 시간 = 현재 - runTargetReduce
  const currentRunTime = current.runPaceSecondsPerKm * current.runDistanceKm;
  const targetRunTime = currentRunTime - runTargetReduce;
  const newRunPace = targetRunTime / current.runDistanceKm;

  // 메시지 생성
  const messages = [
    `나머지 약 ${formatSecondsToMinSec(targetReduceSeconds * 0.30)}는 전환 시간 등으로 단축 목표로 잡으세요.`,
  ];

  const totalReduced = swimTargetReduce + bikeTargetReduce + runTargetReduce;

  return {
    swim: {
        reduceSeconds: formatSecondsToMinSec(newSwimPace),
        newPace: formatSecondsToMinSec(swimTargetReduce),
    },
    bike: {
      increaseKmh: newBikeSpeed.toFixed(2),
      newSpeed: formatSecondsToMinSec(bikeTargetReduce)
    },
    run: {
      reduceSeconds: formatSecondsToMinSec(newRunPace),
      newPace: formatSecondsToMinSec(runTargetReduce)
    },
    swimTimeReduceSeconds: swimTargetReduce,
    bikeSpeedIncreaseKmh: newBikeSpeed - current.bikeSpeedKmh,
    runPaceReduceSecondsPerKm: current.runPaceSecondsPerKm - newRunPace,
    totalTimeReduceSeconds: totalReduced,
    messages,
  };
}

// 보조 함수: 초 -> mm:ss 형식 문자열
function formatSecondsToMinSec(seconds: number): string {
  const min = Math.floor(seconds / 60);
  const sec = Math.round(seconds % 60);
  return sec === 0 ? `${min}분` : `${min}분 ${sec}초`;
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  } else if (minutes > 0) {
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  } else {
    return `0:${secs.toString().padStart(2, '0')}`;
  }
}

export function formatTimeKorean(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}시간 ${minutes}분 ${secs}초`;
  } else if (minutes > 0) {
    return `${minutes}분 ${secs}초`;
  } else {
    return `${secs}초`;
  }
}

export function formatPaceTime(minutes: number, seconds: number): string {
  return `${minutes}분 ${seconds.toString().padStart(2, '0')}초`;
}

export function secondsToHMS(totalSeconds: number): { hours: number; minutes: number; seconds: number } {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { hours, minutes, seconds };
}

interface ImprovementInput {
  overSeconds: number; // 초 단위 초과 시간
  swimTime: number;    // 초 단위 현재 수영 시간
  bikeTime: number;    // 초 단위 현재 자전거 시간
  runTime: number;     // 초 단위 현재 달리기 시간
  swimTimeDiff: number;  // 초 단위 수영 느린 시간
  runPaceDiff: number;   // 초 단위 달리기 페이스 개선 필요 시간 (ex: 1km당 초)
  bikeSpeedDiff: number; // km/h 단위 자전거 속도 개선 필요량
}

/**
 * 초 단위 차이를 "시:분:초 느림/빠름" 형태 문자열로 변환
 * @param {number} diffSeconds - 초 단위 차이 (양수: 느림, 음수: 빠름)
 * @returns {string} 변환된 문자열 예: "1:12:30 느림", "0:05:00 빠름"
 */
function formatTimeDifference(diffSeconds: number) {
  const absSeconds = Math.abs(diffSeconds);

  const hours = Math.floor(absSeconds / 3600);
  const minutes = Math.floor((absSeconds % 3600) / 60);
  const seconds = absSeconds % 60;

  const timeStr = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;

  const status = diffSeconds > 0 ? '느림' : '빠름';

  return `${timeStr} ${status}`;
}

export function calculatePaces(
  course: string,
  goalHours: number,
  goalMinutes: number,
  goalSeconds: number,
  t1Minutes: number,
  t2Minutes: number,
  currentSwimMinutes: number,
  currentSwimSeconds: number,
  currentBikeKmh: number,
  currentRunMinutes: number,
  currentRunSeconds: number
): PaceResult {
  const totalGoalSeconds = goalHours * 3600 + goalMinutes * 60 + goalSeconds; // 목표 경기시간
  const transitionSeconds = (t1Minutes + t2Minutes) * 60;
  const totalGoalRaceTimeSeconds = totalGoalSeconds - transitionSeconds;

  // Check world record
  const records = worldRecords[course as keyof WorldRecords];
  const isWorldRecord = totalGoalSeconds < Math.min(records.men, records.women);

  const courseInfo = courseData[course];
  const swimDistance = course === 'olympic' ? 1500: 3800;
  const bikeDistance = course === 'olympic' ? 40: 180;
  const runDistance = course === 'olympic' ? 10: 42.195;

  const swimPaceMinutes = currentSwimMinutes;
  const swimPaceSecsRemainder = currentSwimSeconds;
  const swimTime = Math.floor(((swimPaceMinutes * 60) + swimPaceSecsRemainder) * (swimDistance / 100))

  const bikeSpeed = currentBikeKmh;
  const bikeTime = Math.floor(bikeDistance / bikeSpeed * 3600)

  const runPaceMinutes = currentRunMinutes;
  const runPaceSecsRemainder = currentRunSeconds;
  const runTime = Math.floor(runDistance * ((runPaceMinutes * 60) + runPaceSecsRemainder))

  const totalPredictSeconds = swimTime + bikeTime + runTime;   // 예상 총 경기시간(바꿈터 포함)
  const totalPredictRaceTimeSeconds = totalPredictSeconds - transitionSeconds; // 예상 경기시간

  const totalRaceDiffernce = totalPredictRaceTimeSeconds > totalGoalRaceTimeSeconds ? formatTimeDifference(totalPredictRaceTimeSeconds - totalGoalRaceTimeSeconds) : formatTimeDifference(totalPredictRaceTimeSeconds - totalGoalRaceTimeSeconds);
  const totalRaceDiffernceStatus = totalPredictRaceTimeSeconds > totalGoalRaceTimeSeconds ? 'slower' : 'faster';
  const totalDiffernce =  totalPredictSeconds > totalGoalSeconds ? formatTimeDifference(totalPredictSeconds - totalGoalSeconds) : formatTimeDifference(totalPredictSeconds - totalGoalSeconds);
  const totalDiffernceStatus =  totalPredictSeconds > totalGoalSeconds ? 'slower' : 'faster';

  const timeRaceDifference = totalPredictRaceTimeSeconds - totalGoalRaceTimeSeconds;
  const timeDifference = totalPredictSeconds - totalGoalSeconds;

  const currentStats: CurrentStats = {
    swimPer100mSeconds: currentSwimMinutes * 60 + currentSwimSeconds,   // 2분 10초
    bikeSpeedKmh: bikeSpeed,
    runPaceSecondsPerKm: currentRunMinutes * 60 + currentRunSeconds,  // 5분 30초
    swimDistanceM: swimDistance,
    bikeDistanceKm: bikeDistance,
    runDistanceKm: runDistance,
  };


  let comparison;

  // Calculate comparison if current paces are provided
  if (currentSwimMinutes !== undefined && currentBikeKmh !== undefined && currentRunMinutes !== undefined && 
      (currentSwimMinutes > 0 || currentBikeKmh > 0 || currentRunMinutes > 0)) {
    
    // Calculate current total time
    const currentSwimTimeSeconds = (currentSwimMinutes * 60 + (currentSwimSeconds || 0)) * (courseInfo.swim * 10); // per 100m to total
    const currentBikeTimeSeconds = (courseInfo.bike / currentBikeKmh) * 3600; // distance / speed * 3600
    const currentRunTimeSeconds = (currentRunMinutes * 60 + (currentRunSeconds || 0)) * courseInfo.run; // per km to total
    const currentTotalSeconds = currentSwimTimeSeconds + currentBikeTimeSeconds + currentRunTimeSeconds + (t1Minutes + t2Minutes) * 60;

    const targetReduceSeconds = timeRaceDifference;
    const suggestion = suggestImprovement(currentStats, targetReduceSeconds);

    comparison = {
      totalTimeDifference: timeDifference,
      improvementSuggestions: suggestion
    };
  }

  return {
    swimPace: { minutes: swimPaceMinutes!, seconds: swimPaceSecsRemainder! },
    bikeSpeed,
    runPace: { minutes: runPaceMinutes, seconds: runPaceSecsRemainder },
    swimTime,
    bikeTime,
    runTime,
    isWorldRecord,
    
    totalGoalSeconds: totalGoalSeconds,
    totalGoalRaceTimeSeconds: totalGoalRaceTimeSeconds,
    totalPredictSeconds: totalPredictSeconds,
    totalPredictRaceTimeSeconds: totalPredictRaceTimeSeconds,

    totalRaceDiffernce: totalRaceDiffernce,
    totalRaceDiffernceStatus: totalRaceDiffernceStatus,
    totalDiffernce: totalDiffernce,
    totalDiffernceStatus: totalDiffernceStatus,

    comparison: comparison
  };
}
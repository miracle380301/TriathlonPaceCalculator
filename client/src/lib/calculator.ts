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
  totalPredictSeconds: number;
  totalRaceTimeSeconds: number;
  improvementTip: ImprovementTips | null;
  comparison?: {
    swim: { current: string; target: string; difference: string; status: string };
    bike: { current: string; target: string; difference: string; status: string };
    run: { current: string; target: string; difference: string; status: string };
    totalTimeDifference: number; // in seconds
    improvementSuggestions: {
      swim: { reduceSeconds: number; newPace: string };
      bike: { increaseKmh: number; newSpeed: string };
      run: { reduceSeconds: number; newPace: string };
    };
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

interface ImprovementTips {
  swim?: {
    timeReduce: number; // 단위: 초
    newPace: {
      minutes: number;
      seconds: number;
    };
    message: string;
  };
  // 추후 bike, run 도 추가 가능
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

function getImprovementTip({
  overSeconds,
  swimTime,
  bikeTime,
  runTime,
  swimTimeDiff,
  runPaceDiff,
  bikeSpeedDiff,
}: ImprovementInput): ImprovementTips | null {
  if (overSeconds <= 0) {
    return null;
  }

  const tips: ImprovementTips = {};

  if (swimTimeDiff > 0) {
    const newSwimTime = swimTime - swimTimeDiff;
    const newPaceSeconds = Math.floor(newSwimTime / 15); // 1.5km = 15 * 100m
    const newPaceMinutes = Math.floor(newPaceSeconds / 60);
    const newPaceSecsRemainder = newPaceSeconds % 60;

    tips.swim = {
      timeReduce: swimTimeDiff,
      newPace: {
        minutes: newPaceMinutes,
        seconds: newPaceSecsRemainder,
      },
      message: `수영에서 ${Math.round(swimTimeDiff / 60)}분 단축이 필요합니다.`,
    };
  }

  return tips;
}

export function calculatePaces(
  course: string,
  goalHours: number,
  goalMinutes: number,
  goalSeconds: number,
  t1Minutes: number,
  t2Minutes: number,
  currentSwimMinutes?: number,
  currentSwimSeconds?: number,
  currentBikeKmh?: number,
  currentRunMinutes?: number,
  currentRunSeconds?: number
): PaceResult {
  const totalGoalSeconds = goalHours * 3600 + goalMinutes * 60 + goalSeconds;
  const transitionSeconds = (t1Minutes + t2Minutes) * 60;
  const raceTimeSeconds = totalGoalSeconds - transitionSeconds;

  // Check world record
  const records = worldRecords[course as keyof WorldRecords];
  const isWorldRecord = totalGoalSeconds < Math.min(records.men, records.women);

  // Calculate splits based on typical race distribution
  const swimPercentage = course === 'olympic' ? 0.20 : 0.15;
  const bikePercentage = course === 'olympic' ? 0.55 : 0.60;
  const runPercentage = course === 'olympic' ? 0.25 : 0.25;

  const swimTime = Math.floor(raceTimeSeconds * swimPercentage);
  const bikeTime = Math.floor(raceTimeSeconds * bikePercentage);
  const runTime = Math.floor(raceTimeSeconds * runPercentage);

  const courseInfo = courseData[course];

  // Calculate paces
  // Swimming: per 100m pace
  const swimPaceSeconds = Math.floor(swimTime / (courseInfo.swim * 10)); // per 100m
  const swimPaceMinutes = Math.floor(swimPaceSeconds / 60);
  const swimPaceSecsRemainder = swimPaceSeconds % 60;

  // Cycling: average speed in km/h
  const bikeSpeed = parseFloat((courseInfo.bike / (bikeTime / 3600)).toFixed(1));

  // Running: per km pace
  const runPaceSeconds = Math.floor(runTime / courseInfo.run); // per km
  const runPaceMinutes = Math.floor(runPaceSeconds / 60);
  const runPaceSecsRemainder = runPaceSeconds % 60;

  let comparison;
  
  // Calculate comparison if current paces are provided
  if (currentSwimMinutes !== undefined && currentBikeKmh !== undefined && currentRunMinutes !== undefined && 
      (currentSwimMinutes > 0 || currentBikeKmh > 0 || currentRunMinutes > 0)) {
    
    // Calculate current total time
    const currentSwimTimeSeconds = (currentSwimMinutes * 60 + (currentSwimSeconds || 0)) * (courseInfo.swim * 10); // per 100m to total
    const currentBikeTimeSeconds = (courseInfo.bike / currentBikeKmh) * 3600; // distance / speed * 3600
    const currentRunTimeSeconds = (currentRunMinutes * 60 + (currentRunSeconds || 0)) * courseInfo.run; // per km to total
    const currentTotalSeconds = currentSwimTimeSeconds + currentBikeTimeSeconds + currentRunTimeSeconds + (t1Minutes + t2Minutes) * 60;
    
    const timeDifference = currentTotalSeconds - totalGoalSeconds;
    
    // Calculate what needs to be improved
    const improvementPerDiscipline = Math.abs(timeDifference) / 3; // Distribute equally across 3 disciplines
    
    comparison = {
      swim: {
        current: `${currentSwimMinutes}분 ${currentSwimSeconds || 0}초 (100m당)`,
        target: `${swimPaceMinutes}분 ${swimPaceSecsRemainder}초 (100m당)`,
        difference: currentSwimTimeSeconds > swimTime ? `${Math.round((currentSwimTimeSeconds - swimTime) / 60)}분 느림` : `${Math.round((swimTime - currentSwimTimeSeconds) / 60)}분 빠름`,
        status: currentSwimTimeSeconds > swimTime ? 'slower' : 'faster'
      },
      bike: {
        current: `${currentBikeKmh}km/h`,
        target: `${bikeSpeed}km/h`,
        difference: currentBikeKmh < bikeSpeed ? `${(bikeSpeed - currentBikeKmh).toFixed(1)}km/h 느림` : `${(currentBikeKmh - bikeSpeed).toFixed(1)}km/h 빠름`,
        status: currentBikeKmh < bikeSpeed ? 'slower' : 'faster'
      },
      run: {
        current: `${currentRunMinutes}분 ${currentRunSeconds || 0}초 (km당)`,
        target: `${runPaceMinutes}분 ${runPaceSecsRemainder}초 (km당)`,
        difference: currentRunTimeSeconds > runTime ? `${Math.round((currentRunTimeSeconds - runTime) / 60)}분 느림` : `${Math.round((runTime - currentRunTimeSeconds) / 60)}분 빠름`,
        status: currentRunTimeSeconds > runTime ? 'slower' : 'faster'
      },
      totalTimeDifference: timeDifference,
      improvementSuggestions: {
        swim: {
          reduceSeconds: Math.round(improvementPerDiscipline / (courseInfo.swim * 10)), // per 100m reduction needed
          newPace: `${Math.floor((currentSwimMinutes * 60 + (currentSwimSeconds || 0) - improvementPerDiscipline / (courseInfo.swim * 10)) / 60)}분 ${Math.round((currentSwimMinutes * 60 + (currentSwimSeconds || 0) - improvementPerDiscipline / (courseInfo.swim * 10)) % 60)}초`
        },
        bike: {
          increaseKmh: parseFloat((courseInfo.bike / ((courseInfo.bike / currentBikeKmh) * 3600 - improvementPerDiscipline) * 3600 - currentBikeKmh).toFixed(1)),
          newSpeed: `${(courseInfo.bike / ((courseInfo.bike / currentBikeKmh) * 3600 - improvementPerDiscipline) * 3600).toFixed(1)}km/h`
        },
        run: {
          reduceSeconds: Math.round(improvementPerDiscipline / courseInfo.run), // per km reduction needed
          newPace: `${Math.floor((currentRunMinutes * 60 + (currentRunSeconds || 0) - improvementPerDiscipline / courseInfo.run) / 60)}분 ${Math.round((currentRunMinutes * 60 + (currentRunSeconds || 0) - improvementPerDiscipline / courseInfo.run) % 60)}초`
        }
      }
    };
  }

  return {
    swimPace: { minutes: swimPaceMinutes, seconds: swimPaceSecsRemainder },
    bikeSpeed,
    runPace: { minutes: runPaceMinutes, seconds: runPaceSecsRemainder },
    swimTime,
    bikeTime,
    runTime,
    isWorldRecord,
    totalPredictSeconds: raceTimeSeconds,
    totalRaceTimeSeconds: totalGoalSeconds,
    improvementTip: getImprovementTip({
      overSeconds: 0,
      swimTime,
      bikeTime,
      runTime,
      swimTimeDiff: 0,
      runPaceDiff: 0,
      bikeSpeedDiff: 0,
    }),
    comparison
  };
}
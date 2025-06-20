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

export function calculatePaces(
  course: string,
  goalHours: number,
  goalMinutes: number,
  goalSeconds: number,
  t1Minutes: number,
  t2Minutes: number
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

  return {
    swimPace: { minutes: swimPaceMinutes, seconds: swimPaceSecsRemainder },
    bikeSpeed,
    runPace: { minutes: runPaceMinutes, seconds: runPaceSecsRemainder },
    swimTime,
    bikeTime,
    runTime,
    isWorldRecord
  };
}
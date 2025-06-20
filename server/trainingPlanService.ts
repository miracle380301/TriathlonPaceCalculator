import { storage } from './storage';
import { calculatePaces, PaceResult } from '../shared/calculator';
import type { StravaActivity } from '@shared/schema';

interface ActivityStats {
  swim: {
    totalDistance: number;
    totalTime: number;
    averagePace: number; // seconds per 100m
    sessionCount: number;
  };
  bike: {
    totalDistance: number;
    totalTime: number;
    averageSpeed: number; // km/h
    sessionCount: number;
  };
  run: {
    totalDistance: number;
    totalTime: number;
    averagePace: number; // seconds per km
    sessionCount: number;
  };
}

interface TrainingRecommendation {
  discipline: 'swim' | 'bike' | 'run';
  priority: number; // 1-3, 1 being highest priority
  improvement_needed: string;
  weekly_plan: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
}

export class TrainingPlanService {
  
  async analyzeUserPerformance(userId: string): Promise<ActivityStats> {
    const activities = await storage.getUserRecentActivities(userId, 4);
    
    const stats: ActivityStats = {
      swim: { totalDistance: 0, totalTime: 0, averagePace: 0, sessionCount: 0 },
      bike: { totalDistance: 0, totalTime: 0, averageSpeed: 0, sessionCount: 0 },
      run: { totalDistance: 0, totalTime: 0, averagePace: 0, sessionCount: 0 }
    };

    activities.forEach(activity => {
      if (activity.type === 'Swim') {
        stats.swim.totalDistance += activity.distance || 0;
        stats.swim.totalTime += activity.movingTime || 0;
        stats.swim.sessionCount++;
      } else if (activity.type === 'Ride') {
        stats.bike.totalDistance += activity.distance || 0;
        stats.bike.totalTime += activity.movingTime || 0;
        stats.bike.sessionCount++;
      } else if (activity.type === 'Run') {
        stats.run.totalDistance += activity.distance || 0;
        stats.run.totalTime += activity.movingTime || 0;
        stats.run.sessionCount++;
      }
    });

    // Calculate averages
    if (stats.swim.totalDistance > 0) {
      stats.swim.averagePace = (stats.swim.totalTime / (stats.swim.totalDistance / 100)); // per 100m
    }
    
    if (stats.bike.totalTime > 0) {
      stats.bike.averageSpeed = (stats.bike.totalDistance / 1000) / (stats.bike.totalTime / 3600); // km/h
    }
    
    if (stats.run.totalDistance > 0) {
      stats.run.averagePace = stats.run.totalTime / (stats.run.totalDistance / 1000); // per km
    }

    return stats;
  }

  compareWithGoal(currentStats: ActivityStats, targetPaces: PaceResult): {
    swim: { current: string; target: string; difference: string; status: string };
    bike: { current: string; target: string; difference: string; status: string };
    run: { current: string; target: string; difference: string; status: string };
    priority: string;
  } {
    const formatPace = (seconds: number): string => {
      const minutes = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${minutes}분 ${secs.toString().padStart(2, '0')}초`;
    };

    // Swimming comparison
    const swimTargetSeconds = targetPaces.swimPace.minutes * 60 + targetPaces.swimPace.seconds;
    const swimDiff = currentStats.swim.averagePace - swimTargetSeconds;
    const swimStatus = swimDiff > 0 ? '목표보다 느림' : '목표보다 빠름';

    // Cycling comparison  
    const bikeDiff = currentStats.bike.averageSpeed - targetPaces.bikeSpeed;
    const bikeStatus = bikeDiff < 0 ? '목표보다 느림' : '목표보다 빠름';

    // Running comparison
    const runTargetSeconds = targetPaces.runPace.minutes * 60 + targetPaces.runPace.seconds;
    const runDiff = currentStats.run.averagePace - runTargetSeconds;
    const runStatus = runDiff > 0 ? '목표보다 느림' : '목표보다 빠름';

    // Determine priority (biggest gap)
    const gaps = [
      { discipline: '수영', gap: Math.abs(swimDiff) },
      { discipline: '자전거', gap: Math.abs(bikeDiff) * 10 }, // scale bike speed difference
      { discipline: '달리기', gap: Math.abs(runDiff) }
    ];
    
    const priority = gaps.sort((a, b) => b.gap - a.gap)[0].discipline;

    return {
      swim: {
        current: currentStats.swim.averagePace > 0 ? formatPace(currentStats.swim.averagePace) : '데이터 없음',
        target: formatPace(swimTargetSeconds),
        difference: Math.abs(swimDiff) > 0 ? `${Math.abs(Math.floor(swimDiff))}초 ${swimDiff > 0 ? '느림' : '빠름'}` : '목표 달성',
        status: swimStatus
      },
      bike: {
        current: currentStats.bike.averageSpeed > 0 ? `${currentStats.bike.averageSpeed.toFixed(1)}km/h` : '데이터 없음',
        target: `${targetPaces.bikeSpeed}km/h`,
        difference: Math.abs(bikeDiff) > 0 ? `${Math.abs(bikeDiff).toFixed(1)}km/h ${bikeDiff < 0 ? '느림' : '빠름'}` : '목표 달성',
        status: bikeStatus
      },
      run: {
        current: currentStats.run.averagePace > 0 ? formatPace(currentStats.run.averagePace) : '데이터 없음',
        target: formatPace(runTargetSeconds),
        difference: Math.abs(runDiff) > 0 ? `${Math.abs(Math.floor(runDiff))}초 ${runDiff > 0 ? '느림' : '빠름'}` : '목표 달성',
        status: runStatus
      },
      priority: priority
    };
  }

  generateTrainingPlan(comparison: ReturnType<typeof this.compareWithGoal>): TrainingRecommendation[] {
    const recommendations: TrainingRecommendation[] = [];

    // Swimming recommendations
    if (comparison.swim.status.includes('느림')) {
      recommendations.push({
        discipline: 'swim',
        priority: comparison.priority === '수영' ? 1 : 2,
        improvement_needed: `수영 페이스 개선 필요: ${comparison.swim.difference}`,
        weekly_plan: {
          tuesday: '테크닉 중심 2000m (드릴 30분 + 메인 30분)',
          thursday: '인터벌 훈련 100m × 10개 (휴식 20초)',
          saturday: '장거리 수영 3000m (목표 페이스보다 5초 빠르게)'
        }
      });
    }

    // Cycling recommendations
    if (comparison.bike.status.includes('느림')) {
      recommendations.push({
        discipline: 'bike',
        priority: comparison.priority === '자전거' ? 1 : 2,
        improvement_needed: `사이클 속도 개선 필요: ${comparison.bike.difference}`,
        weekly_plan: {
          wednesday: '템포 라이딩 60분 (목표 강도 85%)',
          friday: '인터벌 훈련 5분 × 5세트 (휴식 2분)',
          sunday: '장거리 라이딩 90분 (에어로 포지션 연습)'
        }
      });
    }

    // Running recommendations  
    if (comparison.run.status.includes('느림')) {
      recommendations.push({
        discipline: 'run',
        priority: comparison.priority === '달리기' ? 1 : 2,
        improvement_needed: `달리기 페이스 개선 필요: ${comparison.run.difference}`,
        weekly_plan: {
          monday: '6km 템포런 (목표 페이스보다 10초 빠르게)',
          wednesday: '인터벌 400m × 6개 (휴식 1분)',
          saturday: '자전거 후 5km 러닝 브릭훈련'
        }
      });
    }

    return recommendations.sort((a, b) => a.priority - b.priority);
  }

  async createPersonalizedPlan(
    userId: string, 
    course: string, 
    goalHours: number, 
    goalMinutes: number, 
    goalSeconds: number,
    t1Minutes: number,
    t2Minutes: number
  ) {
    // Calculate target paces
    const targetPaces = calculatePaces(course, goalHours, goalMinutes, goalSeconds, t1Minutes, t2Minutes);
    
    // Analyze current performance
    const currentStats = await this.analyzeUserPerformance(userId);
    
    // Compare with goals
    const comparison = this.compareWithGoal(currentStats, targetPaces);
    
    // Generate training recommendations
    const trainingPlan = this.generateTrainingPlan(comparison);

    // Save to database
    const plan = await storage.createTrainingPlan({
      userId,
      course,
      goalTime: goalHours * 3600 + goalMinutes * 60 + goalSeconds,
      currentPaces: {
        swim: currentStats.swim,
        bike: currentStats.bike,
        run: currentStats.run
      },
      targetPaces: {
        swim: { minutes: targetPaces.swimPace.minutes, seconds: targetPaces.swimPace.seconds },
        bike: { speed: targetPaces.bikeSpeed },
        run: { minutes: targetPaces.runPace.minutes, seconds: targetPaces.runPace.seconds }
      },
      weeklyPlan: trainingPlan
    });

    return {
      plan,
      comparison,
      trainingPlan,
      currentStats,
      targetPaces
    };
  }
}

export const trainingPlanService = new TrainingPlanService();
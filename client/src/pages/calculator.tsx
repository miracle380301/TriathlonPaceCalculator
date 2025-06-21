import { useState, useEffect } from "react";
import { Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import CourseSelection from "@/components/course-selection";
import GoalTimeForm from "@/components/goal-time-form";
import WorldRecordAlert from "@/components/world-record-alert";
import ResultsDisplay from "@/components/results-display";
import TrainingTips from "@/components/training-tips";
import StravaConnect from "@/components/strava-connect";
import TrainingAnalysis from "@/components/training-analysis";
import { calculatePaces, PaceResult } from "@/lib/calculator";
import { apiRequest } from "@/lib/queryClient";

type TrainingRecommendation = {
  discipline: "run" | "bike" | "swim";
  priority: number;
  improvement_needed: string;
  weekly_plan: Record<string, string>; // 요일별 훈련 계획
};

type ComparisonResult = {
  swim: DisciplineComparison;
  bike: DisciplineComparison;
  run: DisciplineComparison;
  priority: string;
};

export default function Calculator() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(
    "olympic",
  );
  const [goalHours, setGoalHours] = useState<number>(0);
  const [goalMinutes, setGoalMinutes] = useState<number>(0);
  const [goalSeconds, setGoalSeconds] = useState<number>(0);
  const [t1Minutes, setT1Minutes] = useState<number>(0);
  const [t2Minutes, setT2Minutes] = useState<number>(0);
  const [results, setResults] = useState<PaceResult | null>(null);
  const [trainingPlanData, setTrainingPlanData] = useState<{
    comparison: ComparisonResult;
    trainingPlan: TrainingRecommendation[];
  } | null>(null);
  const [isStravaConnected, setIsStravaConnected] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [activities, setActivities] = useState<any[] | null>(null);
  const { toast } = useToast();

  // Mock user ID for demo - in real app this would come from auth

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("athlete_id");
    setUserId(userId);

    apiRequest("GET", `/api/token-exists/${userId}`)
      .then((res) => {
        if (res.exists) {
          console.log("✅ Access token exists in server");
          setIsStravaConnected(true);
          toast({
            title: "Strava 계정이 연결 되어 있습니다.",
            variant: "success",
            duration: 3000,
          });
          // 예: 동기화 자동 실행할 수도 있음
          // handleSync();
        } else {
          console.log("⚠️ Access token 없음");
        }
      })
      .catch((err) => {
        console.error("❌ Token 체크 실패:", err);
      });
  }, [location.search]);

  const trainingPlanMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("/api/training/plan", {
        method: "POST",
        body: data,
      });
    },
    onSuccess: (data) => {
      setTrainingPlanData(data);
      toast({
        title: "맞춤형 훈련 플랜 생성완료",
        description:
          "Strava 데이터를 기반으로 개인화된 훈련 계획이 생성되었습니다.",
      });
    },
    onError: (error) => {
      console.error("Training plan error:", error);
      toast({
        title: "훈련 플랜 생성 실패",
        description: "Strava 연동 후 다시 시도해주세요.",
        variant: "destructive",
      });
    },
  });

  const handleCalculate = () => {
    if (!selectedCourse) {
      toast({
        title: "코스를 선택해주세요",
        description: "올림픽 코스 또는 아이언맨 코스를 선택해주세요.",
        variant: "destructive",
      });
      return;
    }

    if (goalHours === 0 && goalMinutes === 0 && goalSeconds === 0) {
      toast({
        title: "목표시간을 입력해주세요",
        description: "완주하고 싶은 목표시간을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    try {
      const calculatedResults = calculatePaces(
        selectedCourse,
        goalHours,
        goalMinutes,
        goalSeconds,
        t1Minutes,
        t2Minutes,
      );

      setResults(calculatedResults);
      // 트레이닝 부분 삭제
      setActivities(null);
      setTrainingPlanData(null);

      // If Strava is connected, generate personalized training plan
      // if (isStravaConnected) {
      //   trainingPlanMutation.mutate({
      //     userId,
      //     course: selectedCourse,
      //     goalHours,
      //     goalMinutes,
      //     goalSeconds,
      //     t1Minutes,
      //     t2Minutes,
      //   });
      // }

      // Scroll to results
      setTimeout(() => {
        const resultsElement = document.getElementById("results-section");
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } catch (error) {
      toast({
        title: "계산 오류",
        description: "입력값을 확인해주세요.",
        variant: "destructive",
      });
    }
  };

  function calculateAveragePaces(activities: any[]) {
    const result: { [key: string]: string } = {
      run: "평균 없음",
      bike: "평균 없음",
      swim: "평균 없음",
    };

    const groups = {
      Run: [] as any[],
      Ride: [] as any[],
      Swim: [] as any[],
    };

    // 활동을 종목별로 분류
    for (const activity of activities) {
      if (groups[activity.type as keyof typeof groups]) {
        groups[activity.type as keyof typeof groups].push(activity);
      }
    }

    // Run: 평균 페이스 (초 / km → mm:ss /km)
    if (groups.Run.length > 0) {
      const totalDistance = groups.Run.reduce((sum, a) => sum + a.distance, 0); // meters
      const totalTime = groups.Run.reduce((sum, a) => sum + a.movingTime, 0); // seconds
      const paceSecPerKm = totalTime / (totalDistance / 1000);
      const min = Math.floor(paceSecPerKm / 60);
      const sec = Math.round(paceSecPerKm % 60);
      result.run = `${min}:${sec.toString().padStart(2, "0")} /km`;
    }

    // Ride: 평균 속도 (km/h)
    if (groups.Ride.length > 0) {
      const totalDistance = groups.Ride.reduce((sum, a) => sum + a.distance, 0); // meters
      const totalTime = groups.Ride.reduce((sum, a) => sum + a.movingTime, 0); // seconds
      const speedKmh = totalDistance / 1000 / (totalTime / 3600);
      result.bike = `${speedKmh.toFixed(1)} km/h`;
    }

    // Swim: 평균 페이스 (초 / 100m → mm:ss / 100m)
    if (groups.Swim.length > 0) {
      const totalDistance = groups.Swim.reduce((sum, a) => sum + a.distance, 0); // meters
      const totalTime = groups.Swim.reduce((sum, a) => sum + a.movingTime, 0); // seconds
      const paceSecPer100m = totalTime / (totalDistance / 100);
      const min = Math.floor(paceSecPer100m / 60);
      const sec = Math.round(paceSecPer100m % 60);
      result.swim = `${min}:${sec.toString().padStart(2, "0")} /100m`;
    }

    return result;
  }

  const extractNumber = (str: string) => {
    const match = str.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : NaN;
  };

  function getComparisonStatus(
    currentStr: string | undefined,
    target: number | undefined,
    type: "swim" | "bike" | "run",
  ) {
    if (!currentStr || target == null) return { status: "", difference: "" };

    if (type === "bike") {
      const current = extractNumber(currentStr); // 예: "26.3 km/h"
      const diff = current - target;

      const absDiff = Math.abs(diff).toFixed(1);
      if (diff < -0.5)
        return { status: "느림", difference: `${absDiff}km/h 느림` };
      if (diff > 0.5)
        return { status: "빠름", difference: `${absDiff}km/h 빠름` };
      return { status: "적절", difference: "목표에 근접" };
    }

    if (type === "run" || type === "swim") {
      // 예: "6:30 /km" 또는 "1:45 / 100m" 형태
      const match = currentStr.match(/(\d+):(\d+)/);
      console.log("match:", match);
      if (!match) return { status: "알 수 없음", difference: "데이터 없음" };

      const currentSec = parseInt(match[1]) * 60 + parseInt(match[2]);
      const targetSec = target;
      const diff = currentSec - targetSec;
      const absDiff = Math.abs(diff);

      // console.log("current:", currentSec);
      // console.log("target:", targetSec);
      // console.log("diff:", absDiff);

      if (diff > 10) return { status: "느림", difference: `${absDiff}초 느림` };
      if (diff < -10)
        return { status: "빠름", difference: `${absDiff}초 빠름` };
      return { status: "적절", difference: "목표에 근접" };
    }

    return { status: "", difference: "" };
  }

  function getImprovementPriority(comparison: {
    swim: { difference: string; status: string };
    bike: { difference: string; status: string };
    run: { difference: string; status: string };
  }) {
    const extractGap = (diffStr: string, type: "run" | "swim" | "bike") => {
      console.log("type: ", type);
      console.log("diffStr:", diffStr);
      const match = diffStr.match(/(\d+)/); // "30초 느림" or "2km/h 느림"
      console.log("match:", match);
      if (!match) return 0;

      const value = parseInt(match[1]);

      if (type === "bike") return value * 10; // km/h 기준이므로 차이를 키워서 비교
      return value; // run, swim은 초 단위 그대로
    };

    const swimGap = extractGap(comparison.swim.difference, "swim");
    const bikeGap = extractGap(comparison.bike.difference, "bike");
    const runGap = extractGap(comparison.run.difference, "run");

    const maxGap = Math.max(swimGap, bikeGap, runGap);

    if (maxGap === runGap) return "달리기 페이스 개선이 필요합니다.";
    if (maxGap === bikeGap) return "자전거 속도 개선이 필요합니다.";
    if (maxGap === swimGap) return "수영 페이스 개선이 필요합니다.";
    return "";
  }

  function getTotalSeconds(pace?: { minutes: number; seconds: number }) {
    if (!pace) return null;
    return pace.minutes * 60 + pace.seconds;
  }

  async function analyzeActivities(activities: any[]) {
    // 예시 분석 로직 (임시로 단순 평균/목표 비교)
    const paces = calculateAveragePaces(activities);
    console.log("Average paces:", paces);
    console.log("Target paces:", results);

    const swimSeconds = getTotalSeconds(results?.swimPace) ?? undefined;
    const swimComparison =
      swimSeconds !== undefined
        ? getComparisonStatus(paces.swim, swimSeconds, "swim")
        : { status: "", difference: "" };

    const bikeComparison = getComparisonStatus(
      paces.bike,
      results?.bikeSpeed,
      "bike",
    ) || { status: "", difference: "" };

    const runSeconds = getTotalSeconds(results?.runPace) ?? undefined;
    const runComparison = getComparisonStatus(
      paces.run, // "6:30 /km" 같은 문자열
      runSeconds, // 6*60 + 30 = 390 숫자
      "run",
    ) || { status: "", difference: "" };

    const comparison = {
      swim: {
        current: paces.swim,
        target:
          results?.swimPace?.minutes != null &&
          results?.swimPace?.seconds != null
            ? `${results.swimPace.minutes}:${results.swimPace.seconds
                .toString()
                .padStart(2, "0")} / 100m`
            : "목표 없음",
        difference: swimComparison?.difference,
        status: swimComparison?.status,
      },
      bike: {
        current: paces.bike,
        target: results?.bikeSpeed ? `${results.bikeSpeed}km/h` : "목표 없음",
        difference: bikeComparison.difference,
        status: bikeComparison.status,
      },
      run: {
        current: paces.run,
        target:
          results?.runPace?.minutes != null && results?.runPace?.seconds != null
            ? `${results.runPace.minutes}:${results.runPace.seconds
                .toString()
                .padStart(2, "0")} /km`
            : "목표 없음",
        difference: runComparison.difference,
        status: runComparison.status,
      },
      priority: getImprovementPriority({
        swim: swimComparison,
        bike: bikeComparison,
        run: runComparison,
      }),
    };

    const trainingPlan = await apiRequest("POST", "/api/training-plan", {
      comparison,
    });

    console.log("TrainingPlan (resolved):", trainingPlan);

    // const trainingPlan = [
    //   {
    //     discipline: "run",
    //     improvement_needed: "페이스를 5:30/km로 맞추는 훈련이 필요해요",
    //     priority: 1,
    //     weekly_plan: {
    //       monday: "5km 조깅",
    //       tuesday: "",
    //       wednesday: "인터벌 트레이닝",
    //       thursday: "",
    //       friday: "10km 지속주",
    //       saturday: "",
    //       sunday: "LSD 15km",
    //     },
    //   },
    //   {
    //     discipline: "bike",
    //     improvement_needed: "지속적인 고강도 라이딩 훈련",
    //     priority: 2,
    //     weekly_plan: {
    //       monday: "",
    //       tuesday: "FTP 테스트",
    //       wednesday: "",
    //       thursday: "인터벌",
    //       friday: "",
    //       saturday: "60km 라이딩",
    //       sunday: "",
    //     },
    //   },
    // ];

    return { comparison, trainingPlan };
  }

  const handleStravaConnectionUpdate = async (
    connected: boolean,
    fetchedActivities: any[],
  ) => {
    setIsStravaConnected(connected);
    setActivities(fetchedActivities);

    if (fetchedActivities) {
      console.log("Fetched activities:", fetchedActivities);
      const result = await analyzeActivities(fetchedActivities);
      setTrainingPlanData(result); // { comparison, trainingPlan }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-sports-blue p-3 rounded-xl">
              <Activity className="text-white text-xl" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-neutral-dark">
                철인 3종 목표페이스 계산기
              </h1>
              <p className="text-gray-600 text-sm">
                목표시간에 맞는 각 종목별 페이스를 계산해보세요
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <CourseSelection
          selectedCourse={selectedCourse}
          onCourseSelect={setSelectedCourse}
        />

        <GoalTimeForm
          goalHours={goalHours}
          goalMinutes={goalMinutes}
          goalSeconds={goalSeconds}
          t1Minutes={t1Minutes}
          t2Minutes={t2Minutes}
          onGoalHoursChange={setGoalHours}
          onGoalMinutesChange={setGoalMinutes}
          onGoalSecondsChange={setGoalSeconds}
          onT1MinutesChange={setT1Minutes}
          onT2MinutesChange={setT2Minutes}
          onCalculate={handleCalculate}
          selectedCourse={selectedCourse}
        />

        <StravaConnect
          userId={userId}
          isConnected={isStravaConnected}
          onConnectionUpdate={handleStravaConnectionUpdate}
        />

        <WorldRecordAlert show={results?.isWorldRecord || false} />

        <div id="results-section">
          <ResultsDisplay
            results={results}
            t1Minutes={t1Minutes}
            t2Minutes={t2Minutes}
          />
        </div>

        {isStravaConnected && trainingPlanData && (
          <TrainingAnalysis
            comparison={trainingPlanData.comparison}
            trainingPlan={trainingPlanData.trainingPlan}
          />
        )}

        <TrainingTips />
      </main>

      <footer className="mt-12 bg-white border-t py-6">
        <div className="max-w-4xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>철인 3종 목표페이스 계산기 | 세계기록 기준: 공식 대회 기록</p>
        </div>
      </footer>
    </div>
  );
}

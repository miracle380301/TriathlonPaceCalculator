import { useState } from "react";
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

export default function Calculator() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>('olympic');
  const [goalHours, setGoalHours] = useState<number>(0);
  const [goalMinutes, setGoalMinutes] = useState<number>(0);
  const [goalSeconds, setGoalSeconds] = useState<number>(0);
  const [t1Minutes, setT1Minutes] = useState<number>(0);
  const [t2Minutes, setT2Minutes] = useState<number>(0);
  const [results, setResults] = useState<PaceResult | null>(null);
  const [trainingPlanData, setTrainingPlanData] = useState<any>(null);
  const [isStravaConnected, setIsStravaConnected] = useState<boolean>(false);
  const { toast } = useToast();

  // Mock user ID for demo - in real app this would come from auth
  const userId = 'demo-user-123';

  const trainingPlanMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('/api/training/plan', {
        method: 'POST',
        body: data
      });
    },
    onSuccess: (data) => {
      setTrainingPlanData(data);
      toast({
        title: "맞춤형 훈련 플랜 생성완료",
        description: "Strava 데이터를 기반으로 개인화된 훈련 계획이 생성되었습니다.",
      });
    },
    onError: (error) => {
      console.error('Training plan error:', error);
      toast({
        title: "훈련 플랜 생성 실패", 
        description: "Strava 연동 후 다시 시도해주세요.",
        variant: "destructive",
      });
    }
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
        t2Minutes
      );
      
      setResults(calculatedResults);

      // If Strava is connected, generate personalized training plan
      if (isStravaConnected) {
        trainingPlanMutation.mutate({
          userId,
          course: selectedCourse,
          goalHours,
          goalMinutes,
          goalSeconds,
          t1Minutes,
          t2Minutes
        });
      }
      
      // Scroll to results
      setTimeout(() => {
        const resultsElement = document.getElementById('results-section');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth' });
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

  const handleStravaConnectionUpdate = () => {
    setIsStravaConnected(true);
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
              <h1 className="text-2xl font-bold text-neutral-dark">철인 3종 목표페이스 계산기</h1>
              <p className="text-gray-600 text-sm">목표시간에 맞는 각 종목별 페이스를 계산해보세요</p>
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

        {trainingPlanData && (
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

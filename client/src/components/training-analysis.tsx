import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Waves,
  Bike,
  Footprints,
  TrendingUp,
  Target,
  Calendar,
} from "lucide-react";

interface TrainingAnalysisProps {
  comparison: {
    swim: {
      current: string;
      target: string;
      difference: string;
      status: string;
    };
    bike: {
      current: string;
      target: string;
      difference: string;
      status: string;
    };
    run: {
      current: string;
      target: string;
      difference: string;
      status: string;
    };
    priority: string;
  };
  trainingPlan: Array<{
    discipline: string;
    priority: number;
    improvement_needed: string;
    weekly_plan: Record<string, string>;
  }>;
}

export default function TrainingAnalysis({
  comparison,
  trainingPlan,
}: TrainingAnalysisProps) {
  const disciplines = [
    {
      key: "swim",
      name: "수영",
      icon: Waves,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      emoji: "🏊",
    },
    {
      key: "bike",
      name: "자전거",
      icon: Bike,
      color: "text-green-500",
      bgColor: "bg-green-50",
      emoji: "🚴",
    },
    {
      key: "run",
      name: "달리기",
      icon: Footprints,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      emoji: "🏃",
    },
  ];

  const dayNames = {
    monday: "월",
    tuesday: "화",
    wednesday: "수",
    thursday: "목",
    friday: "금",
    saturday: "토",
    sunday: "일",
  };

  return (
    <div className="space-y-6">
      {/* Performance Comparison */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-neutral-dark mb-4 flex items-center gap-2">
          <Target className="text-sports-blue" size={20} />
          현재 vs 목표 페이스 분석
        </h2>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {disciplines.map((discipline) => {
            const data = comparison?.[
              discipline.key as keyof typeof comparison
            ] ?? { status: "", difference: "" };
            console.log("data:", data);
            const isSlower = data.status.includes("느림");

            return (
              <div
                key={discipline.key}
                className={`${discipline.bgColor} rounded-xl p-5`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`${discipline.color.replace("text-", "bg-").replace("-500", "-500")} p-2 rounded-lg`}
                  >
                    <discipline.icon className="text-white" size={16} />
                  </div>
                  <h3
                    className={`font-semibold ${discipline.color.replace("-500", "-700")}`}
                  >
                    {discipline.emoji} {discipline.name}
                  </h3>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">현재:</span> {data.current}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">목표:</span> {data.target}
                  </div>
                  <div className="text-sm">
                    <Badge
                      variant={isSlower ? "destructive" : "default"}
                      className="text-xs"
                    >
                      {data.difference}
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-yellow-600" size={16} />
            <span className="font-semibold text-yellow-800">
              가장 개선이 필요한 구간
            </span>
          </div>
          <p className="text-yellow-700">{comparison.priority}</p>
        </div>
      </Card>

      {/* Training Recommendations */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-neutral-dark mb-4 flex items-center gap-2">
          <Calendar className="text-achievement-green" size={20} />
          맞춤형 훈련 플랜
        </h2>

        <div className="space-y-6">
          {trainingPlan.map((plan, index) => {
            console.log("trainingPlan:", trainingPlan);
            console.log("typeof trainingPlan:", typeof trainingPlan);

            const discipline = disciplines.find(
              (d) => d.key === plan.discipline,
            );

            return (
              <div
                key={index}
                className="border border-gray-200 rounded-xl p-5"
              >
                <div className="flex items-center gap-3 mb-4">
                  {discipline && (
                    <div
                      className={`${discipline.color.replace("text-", "bg-").replace("-500", "-500")} p-2 rounded-lg`}
                    >
                      <discipline.icon className="text-white" size={16} />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-800">
                        {discipline?.emoji} {discipline?.name} 훈련
                      </h3>
                      <Badge
                        variant={
                          plan.priority === 1 ? "destructive" : "secondary"
                        }
                        className="text-xs"
                      >
                        우선순위 {plan.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {plan.improvement_needed}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-7 gap-2">
                  {Object.entries(dayNames).map(([day, dayKor]) => {
                    const workout = plan.weekly_plan[day];

                    return (
                      <div key={day} className="text-center">
                        <div className="text-xs font-medium text-gray-500 mb-1">
                          {dayKor}
                        </div>
                        <div
                          className={`text-xs p-2 rounded ${
                            workout
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-gray-50 text-gray-400"
                          }`}
                        >
                          {workout || "휴식"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <h4 className="font-semibold text-blue-800 mb-2">💡 훈련 팁</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 훈련 강도는 점진적으로 증가시키세요</li>
            <li>• 브릭 훈련(바이크→런)을 통해 전환 연습을 하세요</li>
            <li>• 충분한 휴식과 영양 섭취를 병행하세요</li>
            <li>
              • 매주 훈련 기록을 Strava에 업로드하여 진행사항을 확인하세요
            </li>
          </ul>
        </div>
      </Card>
    </div>
  );
}

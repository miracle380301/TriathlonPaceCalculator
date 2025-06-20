import { Card } from "@/components/ui/card";
import { Waves, Bike, Footprints, Lightbulb } from "lucide-react";

export default function TrainingTips() {
  const tips = [
    {
      icon: Waves,
      title: "수영 훈련",
      description: "오픈워터 수영 연습과 웻슈트 착용 훈련을 병행하세요.",
      color: "text-blue-500"
    },
    {
      icon: Bike,
      title: "사이클 훈련",
      description: "지속적인 파워 유지와 에어로 포지션 연습이 중요합니다.",
      color: "text-green-500"
    },
    {
      icon: Footprints,
      title: "달리기 훈련",
      description: "사이클 후 달리기(브릭 운동) 연습을 꾸준히 하세요.",
      color: "text-orange-500"
    }
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-neutral-dark mb-4 flex items-center gap-2">
        <Lightbulb className="text-yellow-500" size={20} />
        훈련 팁
      </h3>
      <div className="grid md:grid-cols-3 gap-4 text-sm">
        {tips.map((tip, index) => (
          <div key={index} className="flex gap-3">
            <tip.icon className={`${tip.color} mt-1`} size={16} />
            <div>
              <div className="font-medium text-gray-700">{tip.title}</div>
              <div className="text-gray-600">{tip.description}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

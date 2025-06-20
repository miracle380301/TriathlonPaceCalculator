import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, Play } from "lucide-react";

interface GoalTimeFormProps {
  goalHours: number;
  goalMinutes: number;
  goalSeconds: number;
  t1Minutes: number;
  t2Minutes: number;
  onGoalHoursChange: (value: number) => void;
  onGoalMinutesChange: (value: number) => void;
  onGoalSecondsChange: (value: number) => void;
  onT1MinutesChange: (value: number) => void;
  onT2MinutesChange: (value: number) => void;
  onCalculate: () => void;
  selectedCourse: string | null;
}

export default function GoalTimeForm({
  goalHours,
  goalMinutes,
  goalSeconds,
  t1Minutes,
  t2Minutes,
  onGoalHoursChange,
  onGoalMinutesChange,
  onGoalSecondsChange,
  onT1MinutesChange,
  onT2MinutesChange,
  onCalculate,
  selectedCourse
}: GoalTimeFormProps) {
  return (
    <Card className="p-6 mb-6">
      <h2 className="text-xl font-semibold text-neutral-dark mb-4 flex items-center gap-2">
        <Calculator className="text-sports-blue" size={20} />
        목표시간 입력
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">목표 완주시간</Label>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                type="number"
                placeholder="시간"
                min="0"
                max="23"
                value={goalHours || ''}
                onChange={(e) => onGoalHoursChange(parseInt(e.target.value) || 0)}
                className="font-inter"
              />
              <div className="text-xs text-gray-500 mt-1">시간</div>
            </div>
            <div className="flex-1">
              <Input
                type="number"
                placeholder="분"
                min="0"
                max="59"
                value={goalMinutes || ''}
                onChange={(e) => onGoalMinutesChange(parseInt(e.target.value) || 0)}
                className="font-inter"
              />
              <div className="text-xs text-gray-500 mt-1">분</div>
            </div>
            <div className="flex-1">
              <Input
                type="number"
                placeholder="초"
                min="0"
                max="59"
                value={goalSeconds || ''}
                onChange={(e) => onGoalSecondsChange(parseInt(e.target.value) || 0)}
                className="font-inter"
              />
              <div className="text-xs text-gray-500 mt-1">초</div>
            </div>
          </div>
        </div>

        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">바꿈터 시간 (선택)</Label>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                type="number"
                placeholder="T1 분"
                min="0"
                max="30"
                value={t1Minutes || ''}
                onChange={(e) => onT1MinutesChange(parseInt(e.target.value) || 0)}
                className="font-inter"
              />
              <div className="text-xs text-gray-500 mt-1">수영→사이클</div>
            </div>
            <div className="flex-1">
              <Input
                type="number"
                placeholder="T2 분"
                min="0"
                max="30"
                value={t2Minutes || ''}
                onChange={(e) => onT2MinutesChange(parseInt(e.target.value) || 0)}
                className="font-inter"
              />
              <div className="text-xs text-gray-500 mt-1">사이클→달리기</div>
            </div>
          </div>
        </div>
      </div>

      <Button
        onClick={onCalculate}
        className="w-full mt-6 bg-sports-blue text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center gap-2 h-auto"
        disabled={!selectedCourse}
      >
        <Play size={16} />
        페이스 계산하기
      </Button>
    </Card>
  );
}

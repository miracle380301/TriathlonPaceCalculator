import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, Play } from "lucide-react";
import { Waves, Bike, Footprints } from "lucide-react";

interface GoalTimeFormProps {
  goalHours: number | null;
  goalMinutes: number| null;
  goalSeconds: number| null;
  t1Minutes: number| null;
  t2Minutes: number| null;
  onGoalHoursChange: (value: number | null) => void;
  onGoalMinutesChange: (value: number| null) => void;
  onGoalSecondsChange: (value: number| null) => void;
  onT1MinutesChange: (value: number| null) => void;
  onT2MinutesChange: (value: number| null) => void;

  swimGoalMinutes: number| null;
  swimGoalSeconds: number| null;
  bikeGoalKmh: number| null;
  runGoalMinutes: number| null;
  runGoalSeconds: number| null;
  onSwimGoalMinutesChange: (value: number | null) => void;
  onSwimGoalSecondsChange: (value: number| null) => void;
  onBikeGoalKmhChange: (value: number| null) => void;
  onRunGoalMinutesChange: (value: number| null) => void;
  onRunGoalSecondsChange: (value: number| null) => void;

  onCalculate: () => void;
  selectedCourse: string | null;
}

const disciplines = [
  { label: "수영", key: "swim" },
  { label: "자전거", key: "bike" },
  { label: "달리기", key: "run" },
];

const disciplineIcons: Record<"swim" | "bike" | "run", JSX.Element> = {
  swim: <Waves size={16} className="text-blue-500" />,
  bike: <Bike size={16} className="text-green-500" />,
  run: <Footprints size={16} className="text-orange-500" />,
};

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

  swimGoalMinutes,
  swimGoalSeconds,
  bikeGoalKmh,
  runGoalMinutes,
  runGoalSeconds,

  onSwimGoalMinutesChange,
  onSwimGoalSecondsChange,
  onBikeGoalKmhChange,
  onRunGoalMinutesChange,
  onRunGoalSecondsChange,

  onCalculate,
  selectedCourse,
}: GoalTimeFormProps) {
  return (
    <Card className="p-6 mb-6">
      <h2 className="text-xl font-semibold text-neutral-dark mb-4 flex items-center gap-2">
        <Calculator className="text-sports-blue" size={20} />
        목표시간 입력
      </h2>

      {/* 목표 완주시간 & 바꿈터 시간 */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">
            목표 완주시간
          </Label>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                type="number"
                placeholder="시간"
                min="0"
                max="23"
                value={goalHours === null || goalHours === undefined ? "" : goalHours}
                onChange={(e) => {
                  const val = e.target.value;
                  onGoalHoursChange(val === "" ? 0 : parseInt(val));
                }}
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
                value={goalMinutes === null || goalMinutes === undefined ? "" : goalMinutes}
                onChange={(e) => {
                  const val = e.target.value;
                  onGoalMinutesChange(val === "" ? 0 : parseInt(val));
                }}
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
                value={goalSeconds === null || goalSeconds === undefined ? "" : goalSeconds}
                onChange={(e) => {
                  const val = e.target.value;
                  onGoalSecondsChange(val === "" ? 0 : parseInt(val));
                }}
                className="font-inter"
              />
              <div className="text-xs text-gray-500 mt-1">초</div>
            </div>
          </div>
        </div>

        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">
            바꿈터 시간 (선택)
          </Label>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                type="number"
                placeholder="T1 분"
                min="0"
                max="30"
                value={t1Minutes === null || t1Minutes === undefined ? "" : t1Minutes}                
                onChange={(e) => {
                  const val = e.target.value;
                  onT1MinutesChange(val === "" ? 0 : parseInt(val));
                }}
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
                value={t2Minutes === null || t2Minutes === undefined ? "" : t2Minutes}
                onChange={(e) => {
                  const val = e.target.value;
                  onT2MinutesChange(val === "" ? 0 : parseInt(val));
                }}
                className="font-inter"
              />
              <div className="text-xs text-gray-500 mt-1">사이클→달리기</div>
            </div>
          </div>
        </div>
      </div>

      {/* 종목별 페이스 입력 */}
      <div className="mt-4">
        <h2 className="text-xl font-semibold text-neutral-dark mb-4 flex items-center gap-2">
          <Calculator className="text-sports-blue" size={20} />
          예상종목별 페이스 입력
        </h2>
        <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
          {/* 수영 */}
          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3">
            <Label className="flex items-center text-sm font-medium text-gray-700 gap-1 w-24 sm:w-28 flex-shrink-0">
              {disciplineIcons["swim"]}
              수영
            </Label>
            <div className="flex flex-1 gap-3">
              <Input
                type="number"
                placeholder="분"
                min="0"
                max="59"
                className="font-inter w-full min-w-[60px]"
                value={swimGoalMinutes === null || swimGoalMinutes === undefined ? "" : swimGoalMinutes}
                onChange={(e) => {
                  const val = e.target.value;
                  onSwimGoalMinutesChange(val === "" ? 0 : parseInt(val));
                }}                
              />
              <Input
                type="number"
                placeholder="초"
                min="0"
                max="59"
                className="font-inter w-full min-w-[60px]"
                value={swimGoalSeconds === null || swimGoalSeconds === undefined ? "" : swimGoalSeconds}
                onChange={(e) => {
                  const val = e.target.value;
                  onSwimGoalSecondsChange(val === "" ? 0 : parseInt(val));
                }}
              />
              <span className="text-xs text-gray-500 font-bold whitespace-nowrap flex items-center">
                분 /100m
              </span>
            </div>
          </div>

          {/* 자전거 */}
          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3">
            <Label className="flex items-center text-sm font-medium text-gray-700 gap-1 w-24 sm:w-28 flex-shrink-0">
              {disciplineIcons["bike"]}
              자전거
            </Label>
            <div className="flex flex-1 gap-3 items-center">
              <Input
                type="number"
                min="0"
                step="0.1"
                className="font-inter w-full min-w-[60px]"
                value={bikeGoalKmh === null || bikeGoalKmh === undefined ? "" : bikeGoalKmh}
                onChange={(e) => {
                  const val = e.target.value;
                  onBikeGoalKmhChange(val === "" ? 0 : parseInt(val));
                }}                
              />
              <span className="text-xs text-gray-500 font-bold whitespace-nowrap">
                km/h
              </span>
            </div>
          </div>

          {/* 달리기 */}
          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3">
            <Label className="flex items-center text-sm font-medium text-gray-700 gap-1 w-24 sm:w-28 flex-shrink-0">
              {disciplineIcons["run"]}
              달리기
            </Label>
            <div className="flex flex-1 gap-3">
              <Input
                type="number"
                placeholder="분"
                min="0"
                max="59"
                className="font-inter w-full min-w-[60px]"
                value={runGoalMinutes === null || runGoalMinutes === undefined ? "" : runGoalMinutes}                
                onChange={(e) =>
                  onRunGoalMinutesChange(parseInt(e.target.value) || 0)
                }
              />
              <Input
                type="number"
                placeholder="초"
                min="0"
                max="59"
                className="font-inter w-full min-w-[60px]"
                value={runGoalSeconds === null || runGoalSeconds === undefined ? "" : runGoalSeconds}                                
                onChange={(e) =>
                  onRunGoalSecondsChange(parseInt(e.target.value) || 0)
                }
              />
              <span className="text-xs text-gray-500 font-bold whitespace-nowrap flex items-center">
                분 /km
              </span>
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

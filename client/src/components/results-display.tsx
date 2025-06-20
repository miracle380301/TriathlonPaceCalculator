import { Card } from "@/components/ui/card";
import { Waves, Bike, Footprints, Flag } from "lucide-react";
import { PaceResult, formatTime, formatPaceTime } from "@/lib/calculator";

interface ResultsDisplayProps {
  results: PaceResult | null;
  t1Minutes: number;
  t2Minutes: number;
}

export default function ResultsDisplay({ results, t1Minutes, t2Minutes }: ResultsDisplayProps) {
  if (!results) return null;

  return (
    <Card className="p-6 mb-6">
      <h2 className="text-xl font-semibold text-neutral-dark mb-6 flex items-center gap-2">
        <Flag className="text-achievement-green" size={20} />
        목표페이스 결과
      </h2>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Swimming Result */}
        <div className="bg-blue-50 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-blue-500 p-2 rounded-lg">
              <Waves className="text-white" size={16} />
            </div>
            <h3 className="font-semibold text-blue-700">수영</h3>
          </div>
          <div className="text-2xl font-bold font-inter text-blue-800">
            {formatPaceTime(results.swimPace.minutes, results.swimPace.seconds)}
          </div>
          <div className="text-sm text-blue-600 mt-1">100m당</div>
          <div className="text-xs text-blue-500 mt-2">
            총 소요시간: {formatTime(results.swimTime)}
          </div>
        </div>

        {/* Cycling Result */}
        <div className="bg-green-50 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-green-500 p-2 rounded-lg">
              <Bike className="text-white" size={16} />
            </div>
            <h3 className="font-semibold text-green-700">사이클</h3>
          </div>
          <div className="text-2xl font-bold font-inter text-green-800">
            {results.bikeSpeed} km/h
          </div>
          <div className="text-sm text-green-600 mt-1">평균 속도</div>
          <div className="text-xs text-green-500 mt-2">
            총 소요시간: {formatTime(results.bikeTime)}
          </div>
        </div>

        {/* Running Result */}
        <div className="bg-orange-50 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-orange-500 p-2 rounded-lg">
              <Footprints className="text-white" size={16} />
            </div>
            <h3 className="font-semibold text-orange-700">달리기</h3>
          </div>
          <div className="text-2xl font-bold font-inter text-orange-800">
            {formatPaceTime(results.runPace.minutes, results.runPace.seconds)}
          </div>
          <div className="text-sm text-orange-600 mt-1">1km당</div>
          <div className="text-xs text-orange-500 mt-2">
            총 소요시간: {formatTime(results.runTime)}
          </div>
        </div>
      </div>

      {/* Time Breakdown */}
      <div className="mt-6 bg-gray-50 rounded-xl p-4">
        <h4 className="font-semibold text-gray-700 mb-3">시간 분배</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
          <div className="text-center">
            <div className="text-blue-600 font-medium">{formatTime(results.swimTime)}</div>
            <div className="text-gray-500">수영</div>
          </div>
          <div className="text-center">
            <div className="text-gray-600 font-medium">{t1Minutes}:00</div>
            <div className="text-gray-500">T1</div>
          </div>
          <div className="text-center">
            <div className="text-green-600 font-medium">{formatTime(results.bikeTime)}</div>
            <div className="text-gray-500">사이클</div>
          </div>
          <div className="text-center">
            <div className="text-gray-600 font-medium">{t2Minutes}:00</div>
            <div className="text-gray-500">T2</div>
          </div>
          <div className="text-center">
            <div className="text-orange-600 font-medium">{formatTime(results.runTime)}</div>
            <div className="text-gray-500">달리기</div>
          </div>
        </div>
      </div>
    </Card>
  );
}

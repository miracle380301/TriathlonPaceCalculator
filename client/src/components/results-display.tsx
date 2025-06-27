import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Waves, Bike, Footprints, Trophy, Clock, TrendingUp } from "lucide-react";
import { PaceResult, formatTime, formatPaceTime, formatTimeKorean } from "@/lib/calculator";

interface ResultsDisplayProps {
  results: PaceResult | null;
  t1Minutes: number;
  t2Minutes: number;
  totalPredictSeconds?: number;
  totalRaceTimeSeconds?: number;
}

function formatSecondsToKoreanTime(totalSeconds: number): string {
  return formatTimeKorean(totalSeconds);
}

function getOverMinutes(targetSeconds: number, predictSeconds: number): number {
  return Math.floor((predictSeconds - targetSeconds) / 60);
}

export default function ResultsDisplay({
  results,
  t1Minutes,
  t2Minutes,
}: ResultsDisplayProps) {
  if (!results) {
    return null;
  }

  const overMinutes = getOverMinutes(
    results.totalRaceTimeSeconds,
    results.totalPredictSeconds,
  );

  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center gap-2 mb-6">
        <Target className="text-sports-blue" size={20} />
        <h2 className="text-xl font-semibold text-neutral-dark">목표 페이스 결과</h2>
      </div>

      {/* 페이스 카드들 */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* 수영 페이스 */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-blue-500 p-2 rounded-lg">
              <Waves className="text-white" size={20} />
            </div>
            <span className="font-semibold text-blue-800">🏊 수영</span>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-900 mb-1">
              {formatPaceTime(results.swimPace.minutes, results.swimPace.seconds)}
            </div>
            <div className="text-blue-700 text-sm">100m당</div>
            <div className="text-blue-600 text-xs mt-2">
              총 {formatTime(results.swimTime)}
            </div>
          </div>
        </div>

        {/* 자전거 속도 */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-green-500 p-2 rounded-lg">
              <Bike className="text-white" size={20} />
            </div>
            <span className="font-semibold text-green-800">🚴 자전거</span>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-900 mb-1">
              {results.bikeSpeed}km/h
            </div>
            <div className="text-green-700 text-sm">평균 속도</div>
            <div className="text-green-600 text-xs mt-2">
              총 {formatTime(results.bikeTime)}
            </div>
          </div>
        </div>

        {/* 달리기 페이스 */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-orange-500 p-2 rounded-lg">
              <Footprints className="text-white" size={20} />
            </div>
            <span className="font-semibold text-orange-800">🏃 달리기</span>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-900 mb-1">
              {formatPaceTime(results.runPace.minutes, results.runPace.seconds)}
            </div>
            <div className="text-orange-700 text-sm">km당</div>
            <div className="text-orange-600 text-xs mt-2">
              총 {formatTime(results.runTime)}
            </div>
          </div>
        </div>
      </div>

      {/* 전환 시간 및 총 시간 */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-gray-800">
              {t1Minutes}분
            </div>
            <div className="text-gray-500">T1 (수영→자전거)</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-800">
              {t2Minutes}분
            </div>
            <div className="text-gray-500">T2 (자전거→달리기)</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-sports-blue">
              {formatTime(results.totalPredictSeconds)}
            </div>
            <div className="text-gray-500">경기시간</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-achievement-green">
              {formatTime(results.totalRaceTimeSeconds)}
            </div>
            <div className="text-gray-500">총 시간</div>
          </div>
        </div>
      </div>

      {/* Performance Comparison */}
      {results?.comparison && (
        <div className="mt-8 p-6 bg-gray-50 rounded-xl">
          <h3 className="text-lg font-semibold text-neutral-dark mb-4 flex items-center gap-2">
            <TrendingUp className="text-sports-blue" size={20} />
            현재 vs 목표 페이스 비교
          </h3>
          
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Waves className="text-blue-600" size={16} />
                <span className="font-semibold text-blue-800">🏊 수영</span>
              </div>
              <div className="text-sm space-y-1">
                <div><span className="font-medium">현재:</span> {results.comparison.swim.current}</div>
                <div><span className="font-medium">목표:</span> {results.comparison.swim.target}</div>
                <div className={`font-medium ${results.comparison.swim.status === 'slower' ? 'text-red-600' : 'text-green-600'}`}>
                  {results.comparison.swim.difference}
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Bike className="text-green-600" size={16} />
                <span className="font-semibold text-green-800">🚴 자전거</span>
              </div>
              <div className="text-sm space-y-1">
                <div><span className="font-medium">현재:</span> {results.comparison.bike.current}</div>
                <div><span className="font-medium">목표:</span> {results.comparison.bike.target}</div>
                <div className={`font-medium ${results.comparison.bike.status === 'slower' ? 'text-red-600' : 'text-green-600'}`}>
                  {results.comparison.bike.difference}
                </div>
              </div>
            </div>
            
            <div className="bg-orange-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Footprints className="text-orange-600" size={16} />
                <span className="font-semibold text-orange-800">🏃 달리기</span>
              </div>
              <div className="text-sm space-y-1">
                <div><span className="font-medium">현재:</span> {results.comparison.run.current}</div>
                <div><span className="font-medium">목표:</span> {results.comparison.run.target}</div>
                <div className={`font-medium ${results.comparison.run.status === 'slower' ? 'text-red-600' : 'text-green-600'}`}>
                  {results.comparison.run.difference}
                </div>
              </div>
            </div>
          </div>

          {/* Total Time Difference */}
          <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-4 mb-4">
            <h4 className="font-semibold text-gray-800 mb-2">⏱️ 전체 시간 차이</h4>
            <div className="text-lg font-bold">
              {results.comparison.totalTimeDifference > 0 ? (
                <span className="text-red-600">
                  목표보다 {formatSecondsToKoreanTime(Math.abs(results.comparison.totalTimeDifference))} 느림
                </span>
              ) : results.comparison.totalTimeDifference < 0 ? (
                <span className="text-green-600">
                  목표보다 {formatSecondsToKoreanTime(Math.abs(results.comparison.totalTimeDifference))} 빠름
                </span>
              ) : (
                <span className="text-gray-600">목표 시간과 동일</span>
              )}
            </div>
          </div>

          {/* Improvement Suggestions */}
          {results.comparison.totalTimeDifference > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <h4 className="font-semibold text-yellow-800 mb-3">💡 개선 제안</h4>
              <p className="text-sm text-yellow-700 mb-3">
                목표 시간 달성을 위해 각 종목에서 다음과 같이 개선하면 됩니다:
              </p>
              <div className="grid md:grid-cols-3 gap-3 text-sm">
                <div className="bg-white rounded-lg p-3">
                  <div className="font-medium text-blue-700 mb-1">🏊 수영</div>
                  <div>100m당 <span className="font-bold">{results.comparison.improvementSuggestions.swim.reduceSeconds}초</span> 단축</div>
                  <div className="text-gray-600">→ {results.comparison.improvementSuggestions.swim.newPace}</div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="font-medium text-green-700 mb-1">🚴 자전거</div>
                  <div>평균 <span className="font-bold">{results.comparison.improvementSuggestions.bike.increaseKmh}km/h</span> 향상</div>
                  <div className="text-gray-600">→ {results.comparison.improvementSuggestions.bike.newSpeed}</div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="font-medium text-orange-700 mb-1">🏃 달리기</div>
                  <div>km당 <span className="font-bold">{results.comparison.improvementSuggestions.run.reduceSeconds}초</span> 단축</div>
                  <div className="text-gray-600">→ {results.comparison.improvementSuggestions.run.newPace}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
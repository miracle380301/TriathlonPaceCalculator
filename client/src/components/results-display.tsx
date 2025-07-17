import { Card } from "@/components/ui/card";
import { Target, Waves, Bike, Footprints, Trophy, Clock, TrendingUp } from "lucide-react";
import { PaceResult, formatTime, formatPaceTime, formatTimeKorean } from "@/lib/calculator";
import { Button } from "@/components/ui/button";
import { createTCX } from '../lib/createTcx';
import { useLanguage } from "@/contexts/LanguageContext";

interface ResultsDisplayProps {
  results: PaceResult | null;
  t1Minutes: number | null;
  t2Minutes: number| null;
  totalPredictSeconds?: number;
  totalRaceTimeSeconds?: number;
}

function formatSecondsToKoreanTime(totalSeconds: number): string {
  return formatTimeKorean(totalSeconds);
}

function handleDownload({results,
  t1Minutes,
  t2Minutes
}: ResultsDisplayProps) {
  if (!results) return; // Add this null check
  const date = new Date().toISOString();

  const trainingPlan = [
    { type: 'Swim', distance: results.swimPace.swimDistance, duration: results.swimTime },
    { type: 'T1', distance: 0, duration: t1Minutes ?? 0 },
    { type: 'Bike', distance: results.bikePace.bikeDistance * 1000, duration: results.bikeTime },
    { type: 'T2', distance: 0, duration: t2Minutes ?? 0  },
    { type: 'Run', distance: results.runPace.runDistance * 1000, duration: results.runTime },
  ];

  const tcx = createTCX({ date, activities: trainingPlan });

  const blob = new Blob([tcx], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'triathlon_training_plan.tcx';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function ResultsDisplay({
  results,
  t1Minutes,
  t2Minutes,
}: ResultsDisplayProps) {
  const { t } = useLanguage();
  
  if (!results) {
    return null;
  }

  return (
    <Card className="p-6 mb-6 bg-white dark:bg-gray-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="text-sports-blue" size={20} />
          <h2 className="text-xl font-semibold text-neutral-dark dark:text-white">{t('expectedPaceTime')}</h2>
        </div>

        <Button
          onClick={() => handleDownload({results, t1Minutes, t2Minutes})}
          className="bg-neutral-400 text-white py-2 px-4 rounded-lg font-semibold hover:bg-neutral-500 transition-colors duration-200 flex items-center gap-1 h-auto"
        >
          <Clock className="text-white" size={16} />
            {t('tcxDownload')}
        </Button>
      </div>
      
      {/* 페이스 카드들 */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-blue-500 p-2 rounded-lg">
              <Waves className="text-white" size={20} />
            </div>
            <span className="font-semibold text-blue-800 dark:text-blue-200">🏊 {t('swimming')}</span>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-1">
              {formatPaceTime(results.swimPace.minutes, results.swimPace.seconds)}
            </div>
            <div className="text-blue-700 dark:text-blue-300 text-sm">{t('per100m')}</div>
            <div className="text-blue-600 dark:text-blue-400 text-xs mt-2">
              {t('totalTime')} {formatTime(results.swimTime)}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-green-500 p-2 rounded-lg">
              <Bike className="text-white" size={20} />
            </div>
            <span className="font-semibold text-green-800 dark:text-green-200">🚴 {t('cycling')}</span>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-900 dark:text-green-100 mb-1">
              {results.bikePace.bikeSpeed}km/h
            </div>
            <div className="text-green-700 dark:text-green-300 text-sm">{t('averageSpeed')}</div>
            <div className="text-green-600 dark:text-green-400 text-xs mt-2">
              {t('totalTime')} {formatTime(results.bikeTime)}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-orange-500 p-2 rounded-lg">
              <Footprints className="text-white" size={20} />
            </div>
            <span className="font-semibold text-orange-800 dark:text-orange-200">🏃 {t('running')}</span>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100 mb-1">
              {formatPaceTime(results.runPace.minutes, results.runPace.seconds)}
            </div>
            <div className="text-orange-700 dark:text-orange-300 text-sm">{t('perKm')}</div>
            <div className="text-orange-600 dark:text-orange-400 text-xs mt-2">
              {t('totalTime')} {formatTime(results.runTime)}
            </div>
          </div>
        </div>
      </div>

      {/* 예상시간: 전환 시간 및 총 시간 */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {t1Minutes}{t('minutes')}
            </div>
            <div className="text-gray-500 dark:text-gray-400">{t('t1Transition')}</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {t2Minutes}{t('minutes')}
            </div>
            <div className="text-gray-500 dark:text-gray-400">{t('t2Transition')}</div>
          </div>
          <div>
              <div className="text-lg font-semibold text-sports-blue">
                {formatTime(results.totalPredictRaceTimeSeconds)}
              </div>

            <div className="text-gray-500 dark:text-gray-400">
              {t('raceTime')}
              <div className="text-xs text-gray-400 p-2">
                <div
                  className={`text-xs p-2 flex flex-col items-center gap-1 text-center ${
                    results.totalRaceDiffernceStatus === 'slower' ? 'text-red-500' : 'text-green-500'
                  }`}
                >
                </div>
              </div>
            </div>

          </div>
          <div>
              <div
                className={`text-lg font-semibold ${
                  results.totalRaceDiffernceStatus === 'slower' ? 'text-red-500' : 'text-achievement-green'
                }`}
              >
                {formatTime(results.totalPredictSeconds)}
              </div>
            <div className="text-gray-500 dark:text-gray-400">{t('totalTimeText')}</div>
              <div className="text-xs text-gray-400 p-2">
                <div
                  className={`text-xs p-2 flex flex-col items-center gap-1 text-center ${
                    results.totalDiffernceStatus === 'slower' ? 'text-red-500' : 'text-green-500'
                  }`}
                >
                  <span className="font-bold">
                    {results.totalDiffernceStatus === 'slower' ? '🔻' : '✅'}{results.totalDiffernce}
                  </span>
                </div>
              </div>            
          </div>
        </div>
      </div>
      {/* 목표시간 : 전환 시간 및 총 시간 */}
      <div className="flex items-center gap-2 mb-6">
        <Target className="text-sports-blue" size={20} />
        <h2 className="text-xl font-semibold text-neutral-dark dark:text-white">{t('goalTime')}</h2>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {t1Minutes}{t('minutes')}
            </div>
            <div className="text-gray-500 dark:text-gray-400">{t('t1TransitionText')}</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {t2Minutes}{t('minutes')}
            </div>
            <div className="text-gray-500 dark:text-gray-400">{t('t2TransitionText')}</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-sports-blue">
              {formatTime(results.totalGoalRaceTimeSeconds)}
            </div>
            <div className="text-gray-500 dark:text-gray-400">{t('raceTimeText')}</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-achievement-green">
              {formatTime(results.totalGoalSeconds)}
            </div>
            <div className="text-gray-500 dark:text-gray-400">{t('totalTimeText')}</div>
          </div>
        </div>
      </div>      

      {/* Performance Comparison */}
      {results?.comparison && (
        <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
          {/* <h3 className="text-lg font-semibold text-neutral-dark mb-4 flex items-center gap-2">
            <TrendingUp className="text-sports-blue" size={20} />
            현재 vs 목표 페이스 비교
          </h3> */}
          
          {/* <div className="grid md:grid-cols-3 gap-4 mb-6">
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
          </div> */}

          {/* Total Time Difference */}
          <div className="bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 mb-4">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">⏱️ {t('overallTimeDiff')}</h4>
            <div className="text-lg font-bold">
              {results.comparison.totalTimeDifference > 0 ? (
                <span className="text-red-600">
                  {t('slowerThanGoal')} {formatSecondsToKoreanTime(Math.abs(results.comparison.totalTimeDifference))} {t('slowText')}
                </span>
              ) : results.comparison.totalTimeDifference < 0 ? (
                <span className="text-green-600">
                  {t('fasterThanGoal')} {formatSecondsToKoreanTime(Math.abs(results.comparison.totalTimeDifference))} {t('fastText')}
                </span>
              ) : (
                <span className="text-gray-600 dark:text-gray-400">{t('sameAsGoalTime')}</span>
              )}
            </div>
          </div>

          {/* Improvement Suggestions */}
          {results.comparison.totalTimeDifference > 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-xl p-4">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-3">💡 {t('improvementSuggestionsText')}</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                {t('improvementDescText')}
              </p>
              <div className="grid md:grid-cols-3 gap-3 text-sm">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                  <div className="font-medium text-blue-700 dark:text-blue-300 mb-1">🏊 {t('swimming')}</div>
                  <div>100m{t('perText')} <span className="font-bold">{results.comparison.improvementSuggestions.swim.reduceSeconds}</span></div>
                  <div className="text-gray-600 dark:text-gray-400">→ {results.comparison.improvementSuggestions.swim.newPace} {t('shortenText')}</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                  <div className="font-medium text-green-700 dark:text-green-300 mb-1">🚴 {t('cycling')}</div>
                  <div>{t('averageText')} <span className="font-bold">{results.comparison.improvementSuggestions.bike.increaseKmh}km/h</span> {t('improveText')}</div>
                  <div className="text-gray-600 dark:text-gray-400">→ {results.comparison.improvementSuggestions.bike.newSpeed} {t('shortenText')}</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                  <div className="font-medium text-orange-700 dark:text-orange-300 mb-1">🏃 {t('running')}</div>
                  <div>km{t('perText')} <span className="font-bold">{results.comparison.improvementSuggestions.run.reduceSeconds}</span></div>
                  <div className="text-gray-600 dark:text-gray-400">→ {results.comparison.improvementSuggestions.run.newPace} {t('shortenText')}</div>
                </div>
                 {/* 🔽 여기 messages 출력 */}
                 {results.comparison.improvementSuggestions.messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className="bg-white dark:bg-gray-800 rounded-lg p-3 md:col-span-3 text-gray-700 dark:text-gray-300"
                    >
                      {msg}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
import { useState } from "react";
import { Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import CourseSelection from "@/components/course-selection";
import GoalTimeForm from "@/components/goal-time-form";
import WorldRecordAlert from "@/components/world-record-alert";
import ResultsDisplay from "@/components/results-display";
import TrainingTips from "@/components/training-tips";
import { calculatePaces, PaceResult } from "@/lib/calculator";

export default function Calculator() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>('olympic');
  const [goalHours, setGoalHours] = useState<number | null>(null);
  const [goalMinutes, setGoalMinutes] = useState<number | null>(null);
  const [goalSeconds, setGoalSeconds] = useState<number | null>(null);
  const [t1Minutes, setT1Minutes] = useState<number | null>(null);
  const [t2Minutes, setT2Minutes] = useState<number | null>(null);
  const [results, setResults] = useState<PaceResult | null>(null);
  
  // Current pace inputs for comparison
  const [swimGoalMinutes, setSwimGoalMinutes] = useState<number | null>(null);
  const [swimGoalSeconds, setSwimGoalSeconds] = useState<number | null>(null);
  const [bikeGoalKmh, setBikeGoalKmh] = useState<number | null>(null);
  const [runGoalMinutes, setRunGoalMinutes] = useState<number | null>(null);
  const [runGoalSeconds, setRunGoalSeconds] = useState<number | null>(null);
  
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleCalculate = () => {
    if (!selectedCourse) {
      toast({
        title: t('selectCourse'),
        description: t('selectCourseDescription'),
        variant: "destructive",
      });
      return;
    }

    if (goalHours === 0 && goalMinutes === 0 && goalSeconds === 0) {
      toast({
        title: t('enterGoalTime'),
        description: t('enterGoalTimeDescription'),
        variant: "destructive",
      });
      return;
    }

    try {
      const calculatedResults = calculatePaces(
        selectedCourse,
        goalHours ?? 0,
        goalMinutes ?? 0,
        goalSeconds ?? 0,
        t1Minutes ?? 0,
        t2Minutes ?? 0,
        swimGoalMinutes ?? 0,
        swimGoalSeconds ?? 0,
        bikeGoalKmh ?? 0,
        runGoalMinutes ?? 0,
        runGoalSeconds ?? 0
      );
      
      setResults(calculatedResults);
      
      // Scroll to results
      setTimeout(() => {
        const resultsElement = document.getElementById('results-section');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (error) {
      toast({
        title: t('calculationError'),
        description: t('calculationErrorDescription'),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-indigo-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <header className="bg-white dark:bg-card shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-xl">
                <Activity className="text-white" size={28} />
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Tri-Pacer
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">{t('appDescription')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />
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
          
          swimGoalMinutes={swimGoalMinutes}
          swimGoalSeconds={swimGoalSeconds}
          bikeGoalKmh={bikeGoalKmh}
          runGoalMinutes={runGoalMinutes}
          runGoalSeconds={runGoalSeconds}
          onSwimGoalMinutesChange={setSwimGoalMinutes}
          onSwimGoalSecondsChange={setSwimGoalSeconds}
          onBikeGoalKmhChange={setBikeGoalKmh}
          onRunGoalMinutesChange={setRunGoalMinutes}
          onRunGoalSecondsChange={setRunGoalSeconds}
          
          onCalculate={handleCalculate}
          selectedCourse={selectedCourse}
        />

        <WorldRecordAlert show={results?.isWorldRecord || false} />

        <div id="results-section">
          <ResultsDisplay
            results={results}
            t1Minutes={t1Minutes}
            t2Minutes={t2Minutes}
          />
        </div>

        <TrainingTips />
      </main>
    </div>
  );
}
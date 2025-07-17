import { Card } from "@/components/ui/card";
import { Waves, Bike, Footprints, Lightbulb } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function TrainingTips() {
  const { t } = useLanguage();
  
  const tips = [
    {
      icon: Waves,
      title: t('swimTraining'),
      description: t('swimTrainingDesc'),
      color: "text-blue-500"
    },
    {
      icon: Bike,
      title: t('cycleTraining'),
      description: t('cycleTrainingDesc'),
      color: "text-green-500"
    },
    {
      icon: Footprints,
      title: t('runTraining'),
      description: t('runTrainingDesc'),
      color: "text-orange-500"
    }
  ];

  return (
    <Card className="p-6 bg-white dark:bg-gray-800">
      <h3 className="text-lg font-semibold text-neutral-dark dark:text-white mb-4 flex items-center gap-2">
        <Lightbulb className="text-yellow-500" size={20} />
        {t('trainingTipsTitle')}
      </h3>
      <div className="grid md:grid-cols-3 gap-4 text-sm">
        {tips.map((tip, index) => (
          <div key={index} className="flex gap-3">
            <tip.icon className={`${tip.color} mt-1`} size={16} />
            <div>
              <div className="font-medium text-gray-700 dark:text-gray-300">{tip.title}</div>
              <div className="text-gray-600 dark:text-gray-400">{tip.description}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

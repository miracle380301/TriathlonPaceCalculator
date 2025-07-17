import { Trophy } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface WorldRecordAlertProps {
  show: boolean;
}

export default function WorldRecordAlert({ show }: WorldRecordAlertProps) {
  const { t } = useLanguage();
  
  if (!show) return null;

  return (
    <div className="bg-gradient-to-r from-record-red to-pink-500 text-white rounded-2xl p-4 mb-6 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="bg-white/20 p-2 rounded-full">
          <Trophy className="text-xl" size={20} />
        </div>
        <div>
          <div className="font-bold text-lg">{t('worldRecordChallenge')}</div>
          <div className="text-white/90 text-sm">{t('worldRecordDescription')}</div>
        </div>
      </div>
    </div>
  );
}

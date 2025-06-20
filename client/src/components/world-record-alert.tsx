import { Trophy } from "lucide-react";

interface WorldRecordAlertProps {
  show: boolean;
}

export default function WorldRecordAlert({ show }: WorldRecordAlertProps) {
  if (!show) return null;

  return (
    <div className="bg-gradient-to-r from-record-red to-pink-500 text-white rounded-2xl p-4 mb-6 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="bg-white/20 p-2 rounded-full">
          <Trophy className="text-xl" size={20} />
        </div>
        <div>
          <div className="font-bold text-lg">와우! 당신은 세계 신기록에 도전하시는 군요.</div>
          <div className="text-white/90 text-sm">입력하신 시간이 현재 세계기록보다 빠릅니다!</div>
        </div>
      </div>
    </div>
  );
}

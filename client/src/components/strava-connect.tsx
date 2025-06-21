import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, ExternalLink, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface StravaConnectProps {
  userId: string;
  isConnected: boolean;
  onConnectionUpdate: (connected: boolean, activities: any[]) => void; // activities를 인자로 받음
}

export default function StravaConnect({
  userId,
  isConnected,
  onConnectionUpdate,
}: StravaConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  console.log("userID : ", userId);
  const handleConnect = async () => {
    console.log("Connecting to Strava...");
    try {
      setIsConnecting(true);
      const response = await apiRequest("GET", "/api/strava/auth");
      console.log("Strava auth response:", response);

      if (response.authUrl) {
        window.location.href = response.authUrl; // 이게 빠졌으면 리다이렉트 안됨
      } else {
        throw new Error("No authUrl in response");
      }
    } catch (error) {
      console.error("Strava connect error:", error);
      toast({
        title: "연결 실패",
        description: "Strava 연결 중 문제가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleLogout = async () => {
    // localStorage 초기화
    localStorage.removeItem("stravaUserId");

    // 백엔드에 로그아웃 요청 (선택사항)
    await apiRequest("POST", "/api/strava/logout", {
      userId, // 필요하면 넘기기
    });

    // 상태 초기화
    onConnectionUpdate(false, null); // 연결 상태 false로 업데이트
    toast({
      title: "Strava 연결 해제됨",
      variant: "default",
      duration: 3000,
    });
  };

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      const activities = await apiRequest("GET", `/api/activities/${userId}`);

      console.log("Fetched activities:", activities);

      toast({
        title: "데이터 확인 완료",
        description: `최근 4주간 ${activities.length}개의 운동 기록을 확인했습니다.`,
      });

      onConnectionUpdate(true, activities);
    } catch (error) {
      console.error("Strava sync error:", error);
      toast({
        title: "데이터 확인 실패",
        description: "활동 데이터 확인 중 문제가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-orange-500 p-2 rounded-lg">
            <Activity className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-neutral-dark">
              Strava 연동
            </h2>
            <p className="text-gray-600 text-sm">
              운동 데이터를 연동하여 개인화된 훈련 플랜을 받아보세요
            </p>
          </div>
        </div>
        {isConnected && (
          <Badge
            variant="default"
            className="bg-green-100 text-green-800 border-green-200"
          >
            <Zap size={12} className="mr-1" />
            연결됨
          </Badge>
        )}
      </div>

      <div className="space-y-4">
        {" "}
        {!isConnected ? (
          <div className="text-center py-6">
            <div className="text-gray-500 mb-4">
              <Activity size={48} className="mx-auto mb-2 text-gray-300" />
              <p>Strava 계정을 연결하여 최근 4주간의 운동 기록을 분석하고</p>
              <p>목표 달성을 위한 맞춤형 훈련 계획을 받아보세요.</p>
            </div>
            <Button
              onClick={handleConnect}
              disabled={isConnecting}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 mx-auto"
            >
              <ExternalLink size={16} />
              {isConnecting ? "Strava 연결 중..." : "Strava 연결하기"}
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">
                Strava 계정이 연결되어 있습니다
              </span>
            </div>
            <Button
              onClick={handleSync}
              disabled={isSyncing}
              variant="outline"
              className="flex items-center gap-2 bg-sports-blue text-blue-500 text-white border-blue-300 hover:bg-blue-50"
            >
              <Activity size={16} />
              {isSyncing ? "현재 vs 목표 분석중..." : "현재 vs 목표 분석"}
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2 text-red-500 border-red-300 hover:bg-red-50"
            >
              로그아웃
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

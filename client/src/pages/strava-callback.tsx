import { useEffect } from "react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function StravaCallback() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');
      
      if (error) {
        toast({
          title: "Strava 연결 실패",
          description: "사용자가 권한을 거부했습니다.",
          variant: "destructive",
        });
        setLocation('/');
        return;
      }

      if (!code) {
        toast({
          title: "Strava 연결 실패",
          description: "인증 코드가 없습니다.",
          variant: "destructive",
        });
        setLocation('/');
        return;
      }

      try {
        const userId = localStorage.getItem('stravaUserId');
        if (!userId) {
          throw new Error('User ID not found');
        }

        await apiRequest('/api/strava/callback', {
          method: 'POST',
          body: { code, userId }
        });

        toast({
          title: "Strava 연결 성공",
          description: "계정이 성공적으로 연결되었습니다.",
        });

        // Clean up localStorage
        localStorage.removeItem('stravaUserId');
        
        // Redirect back to main page
        setLocation('/');
      } catch (error) {
        console.error('Strava callback error:', error);
        toast({
          title: "Strava 연결 실패",
          description: "연결 중 오류가 발생했습니다.",
          variant: "destructive",
        });
        setLocation('/');
      }
    };

    handleCallback();
  }, [setLocation, toast]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sports-blue mx-auto mb-4"></div>
        <p className="text-gray-600">Strava 계정 연결 중...</p>
      </div>
    </div>
  );
}
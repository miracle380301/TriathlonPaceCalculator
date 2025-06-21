import axios from "axios";
import { storage } from "./storage";

interface StravaTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  athlete: {
    id: number;
    firstname: string;
    lastname: string;
    profile: string;
  };
}

interface StravaActivity {
  id: number;
  name: string;
  type: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  start_date: string;
  average_speed?: number;
}

export class StravaService {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor() {
    this.clientId = process.env.STRAVA_CLIENT_ID || "77505";
    this.clientSecret =
      process.env.STRAVA_CLIENT_SECRET ||
      "5fa802f6ee3011bf8362f22b28db3ac233a3a053";
    this.redirectUri =
      process.env.STRAVA_REDIRECT_URI ||
      "https://d4f89ef6-379d-495b-882e-53603f6deae3-00-1kqrh8p9tblw2.kirk.replit.dev/api/strava/callback";
  }

  getAuthUrl(): string {
    return `https://strava-auth-server.onrender.com/login`;
  }

  async exchangeCodeForTokens(code: string): Promise<StravaTokenResponse> {
    try {
      const response = await axios.post("https://www.strava.com/oauth/token", {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code,
        grant_type: "authorization_code",
      });

      return response.data;
    } catch (error) {
      console.error("Error exchanging code for tokens:", error);
      throw new Error("Failed to authenticate with Strava");
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<StravaTokenResponse> {
    try {
      const response = await axios.post("https://www.strava.com/oauth/token", {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      });

      return response.data;
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw new Error("Failed to refresh Strava token");
    }
  }

  async getActivities(
    accessToken: string,
    page: number = 1,
    perPage: number = 30,
  ): Promise<StravaActivity[]> {
    try {
      const response = await axios.get(
        "https://www.strava.com/api/v3/athlete/activities",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            page,
            per_page: perPage,
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching activities:", error);
      throw new Error("Failed to fetch Strava activities");
    }
  }

  async getUserActivitiesOnce(accessToken: string): Promise<StravaActivity[]> {
    console.log("@@ getUserActivitiesOnce");
    // Fetch activities from Strava API
    const res = await fetch(
      "https://www.strava.com/api/v3/athlete/activities?per_page=100&page=1",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!res.ok) {
      throw new Error("Failed to fetch activities from Strava");
    }

    const activities = await res.json();

    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

    const allActivities = activities;
    // console.log("🔥 전체 활동 수:", allActivities.length);
    // console.log("🔥 전체 활동 예시:", allActivities.slice(0, 3)); // 일부만 출력

    const filteredActivities = allActivities.filter((activity: any) => {
      // console.log("👉 activity.type:", activity.type);
      // console.log("📆 activity.start_date:", activity.start_date);
      // console.log("📆 기준일자:", fourWeeksAgo.toISOString());

      const isTriathlon = ["Swim", "Ride", "Run"].includes(activity.type);
      const isRecent = new Date(activity.start_date) > fourWeeksAgo;
      return isTriathlon && isRecent;
    });
    // console.log("✅ 필터링된 활동 수:", filteredActivities.length);
    // console.log("✅ 필터링된 활동 예시:", filteredActivities.slice(0, 3)); // 일부만 출력

    const mappedActivities = filteredActivities.map((activity: any) => ({
      id: activity.id.toString(),
      name: activity.name,
      type: activity.type,
      distance: Math.round(activity.distance),
      movingTime: activity.moving_time,
      startDate: new Date(activity.start_date),
      averageSpeed: activity.average_speed || undefined,
    }));
    //console.log("📦 최종 매핑된 활동:", mappedActivities.slice(0, 3)); // 일부만 출력

    return mappedActivities;
  }
}

export const stravaService = new StravaService();

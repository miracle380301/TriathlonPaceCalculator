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
    const scope = "read,activity:read_all";
    return `https://www.strava.com/oauth/authorize?client_id=${this.clientId}&response_type=code&redirect_uri=${encodeURIComponent(this.redirectUri)}&approval_prompt=force&scope=${scope}`;
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

  async getUserActivities(userId: string): Promise<StravaActivity[]> {
    const user = storage.getUser(userId);
    if (!user?.stravaAccessToken) {
      throw new Error('User not connected to Strava');
    }

    let accessToken = user.stravaAccessToken;

    // Check if token needs refresh
    if (user.stravaTokenExpiry && new Date() > user.stravaTokenExpiry) {
      if (user.stravaRefreshToken) {
        const tokenData = await this.refreshAccessToken(user.stravaRefreshToken);
        storage.setUserStravaTokens(
          userId,
          tokenData.access_token,
          tokenData.refresh_token,
          new Date(tokenData.expires_at * 1000)
        );
        accessToken = tokenData.access_token;
      } else {
        throw new Error('Strava token expired and no refresh token available');
      }
    }

    // Fetch activities for the last 4 weeks
    const activities = await this.getActivities(accessToken, 1, 100);
    
    // Filter for triathlon activities (Swim, Ride, Run) from last 4 weeks
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
    
    return activities
      .filter(activity => ['Swim', 'Ride', 'Run'].includes(activity.type))
      .filter(activity => new Date(activity.start_date) > fourWeeksAgo)
      .map(activity => ({
        id: activity.id.toString(),
        name: activity.name,
        type: activity.type,
        distance: Math.round(activity.distance),
        movingTime: activity.moving_time,
        startDate: new Date(activity.start_date),
        averageSpeed: activity.average_speed ? activity.average_speed : undefined,
      }));
  }
}

export const stravaService = new StravaService();

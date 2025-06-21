// Simple in-memory storage for session-based data
interface User {
  id: string;
  stravaAccessToken?: string;
  stravaRefreshToken?: string;
  stravaTokenExpiry?: Date;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
}

interface StravaActivity {
  id: string;
  name: string;
  type: string;
  distance: number;
  movingTime: number;
  startDate: Date;
  averageSpeed?: number;
}

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): User | undefined;
  setUserStravaTokens(userId: string, accessToken: string, refreshToken: string, expiryDate: Date): void;
  updateUser(userId: string, userData: Partial<User>): void;
}

export class MemoryStorage implements IStorage {
  private users: Map<string, User> = new Map();

  getUser(id: string): User | undefined {
    return this.users.get(id);
  }

  setUserStravaTokens(userId: string, accessToken: string, refreshToken: string, expiryDate: Date): void {
    const user = this.users.get(userId) || { id: userId };
    user.stravaAccessToken = accessToken;
    user.stravaRefreshToken = refreshToken;
    user.stravaTokenExpiry = expiryDate;
    this.users.set(userId, user);
  }

  updateUser(userId: string, userData: Partial<User>): void {
    const user = this.users.get(userId) || { id: userId };
    Object.assign(user, userData);
    this.users.set(userId, user);
  }
}

export const storage = new MemoryStorage();

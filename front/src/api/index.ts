import axios from 'axios';

const request = axios.create({
  baseURL: '/api',
});

export const Auth = {
  google: {
    validate: async (idToken: string) => {
      const { data } = await request.post<APIResponse<GoogleAuthValidate>>('/v1/auth/google', { id_token: idToken });
      return data.data;
    }
  },
  status: {
    get: async () => {
      const { data } = await request.get<APIResponse<AuthStatus>>('/v1/auth/status');
      return data.data;
    }
  },
};

export const Seed = {
  get: async () => {
    const { data } = await request.get<APIResponse<number>>('/v1/seed');
    return data.data;
  },
};

type LeaderboardItem = {
  username: string,
  score: number,
  touches: number,
};

type LeaderboardPayload = LeaderboardItem & {
  touch_history: string, // JSON.stringify(Point[])
  seed: number,
};

export const Leaderboard = {
  get: async () => {
    const { data } = await request.get<APIResponse<LeaderboardItem[]>>('/v1/leaderboard');
    return data.data;
  },
  post: async (payload: LeaderboardPayload) => {
    const { data } = await request.post<APIResponse<null>>('/v1/leaderboard', payload);
    return data.data;
  }
};

export type { LeaderboardItem };

import { apiRequest } from "./queryClient";

export interface AuthResponse {
  success: boolean;
  message?: string;
  authenticated?: boolean;
}

export const authApi = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await apiRequest("POST", "/api/auth/login", { username, password });
    return response.json();
  },

  logout: async (): Promise<AuthResponse> => {
    const response = await apiRequest("POST", "/api/auth/logout");
    return response.json();
  },

  me: async (): Promise<AuthResponse> => {
    const response = await apiRequest("GET", "/api/auth/me");
    return response.json();
  },
};

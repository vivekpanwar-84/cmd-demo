import api from "@/lib/axios";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface User {
  id: string;
  full_name: string;
  email: string;
  role: "ADMIN" | "USER" | string;
}

export interface Organization {
  plan_status: string;
  limits: Record<string, unknown>;
  services: string[];
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
  organization?: Organization;
}

export const authService = {
  login: async (credentials: LoginPayload): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", credentials);

    if (!response.data?.token || !response.data?.user) {
      throw new Error("Invalid login response");
    }

    return response.data;
  },

  me: async (): Promise<{ user: User }> => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },
};
import api from "./api";
import { AuthResponse } from "../types";

export const authService = {
  register: async (name: string, email: string, password: string) => {
    const response = await api.post<AuthResponse>("/auth/register", {
      name,
      email,
      password,
    });
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post<AuthResponse>("/auth/login", {
      email,
      password,
    });
    return response.data;
  },
};

// src/features/auth/states/authStore.ts
import { defineStore } from "pinia";
import { loginApi, registerApi, logoutApi } from "../api/authApi";
import {
  putAccessToken,
  removeAccessToken,
  getAccessToken,
} from "../../../helpers/apiHelper";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  }),

  getters: {
    currentUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated,
  },

  actions: {
    async login(email: string, password: string): Promise<void> {
      this.isLoading = true;
      this.error = null;
      try {
        const data = await loginApi(email, password);
        putAccessToken(data.token);
        this.user = data.user;
        this.isAuthenticated = true;
      } catch (err) {
        this.error = err instanceof Error ? err.message : "Login gagal";
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async register(
      name: string,
      email: string,
      password: string
    ): Promise<void> {
      this.isLoading = true;
      this.error = null;
      try {
        await registerApi(name, email, password);
      } catch (err) {
        this.error = err instanceof Error ? err.message : "Registrasi gagal";
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async logout(): Promise<void> {
      this.isLoading = true;
      try {
        await logoutApi();
      } catch {
        // silently ignore logout errors
      } finally {
        removeAccessToken();
        this.user = null;
        this.isAuthenticated = false;
        this.isLoading = false;
      }
    },

    checkAuth(): boolean {
      const token = getAccessToken();
      if (token) {
        this.isAuthenticated = true;
        return true;
      }
      return false;
    },

    setUser(user: AuthUser): void {
      this.user = user;
      this.isAuthenticated = true;
    },
  },
});

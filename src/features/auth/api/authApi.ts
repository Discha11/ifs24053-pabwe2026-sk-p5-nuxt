// src/features/auth/api/authApi.ts
import { fetchAPI } from "../../../helpers/apiHelper";

export interface LoginResponse {
  user: {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
  };
  token: string;
}

export async function loginApi(
  email: string,
  password: string
): Promise<LoginResponse> {
  return fetchAPI<LoginResponse>("/auth/login", {
    method: "POST",
    body: { email, password },
    useAuth: false,
  });
}

export async function registerApi(
  name: string,
  email: string,
  password: string
): Promise<void> {
  await fetchAPI("/auth/register", {
    method: "POST",
    body: { name, email, password },
    useAuth: false,
  });
}

export async function logoutApi(): Promise<void> {
  await fetchAPI("/auth/logout", { method: "POST" });
}

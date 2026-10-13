// src/features/users/api/userApi.ts
import { fetchAPI, apiGet, apiPut } from "../../../helpers/apiHelper";

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  photo: string;
  created_at: string;
  updated_at: string;
}

export async function getAllUsersApi(): Promise<{ users: User[] }> {
  return apiGet<{ users: User[] }>("/users");
}

export async function getUserByIdApi(id: number): Promise<{ user: User }> {
  return apiGet<{ user: User }>(`/users/${id}`);
}

export async function getProfileApi(): Promise<{ user: User }> {
  return apiGet<{ user: User }>("/users/me");
}

export async function updateProfileApi(
  name: string,
  email: string
): Promise<{ user: User }> {
  return apiPut<{ user: User }>("/users/me", { name, email });
}

export async function uploadPhotoApi(photo: File): Promise<void> {
  const formData = new FormData();
  formData.append("photo", photo);
  await fetchAPI("/users/me/photo", {
    method: "POST",
    body: formData,
    isFormData: true,
  });
}

export async function changePasswordApi(
  password: string,
  new_password: string,
  new_password_confirmation: string
): Promise<void> {
  await apiPut("/users/password", {
    password,
    new_password,
    new_password_confirmation,
  });
}

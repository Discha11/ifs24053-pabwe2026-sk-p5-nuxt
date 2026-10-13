// src/features/users/states/usersStore.ts
import { defineStore } from "pinia";
import type { User } from "../api/userApi";
import {
  getAllUsersApi,
  getProfileApi,
  updateProfileApi,
  uploadPhotoApi,
  changePasswordApi,
} from "../api/userApi";

export interface UsersState {
  users: User[];
  profile: User | null;
  isLoading: boolean;
  error: string | null;
}

export const useUsersStore = defineStore("users", {
  state: (): UsersState => ({
    users: [],
    profile: null,
    isLoading: false,
    error: null,
  }),

  getters: {
    currentProfile: (state) => state.profile,
    allUsers: (state) => state.users,
  },

  actions: {
    async fetchUsers(): Promise<void> {
      this.isLoading = true;
      this.error = null;
      try {
        const data = await getAllUsersApi();
        this.users = data.users;
      } catch (err) {
        this.error =
          err instanceof Error ? err.message : "Gagal mengambil data pengguna";
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchProfile(): Promise<void> {
      this.isLoading = true;
      this.error = null;
      try {
        const data = await getProfileApi();
        this.profile = data.user;
      } catch (err) {
        this.error =
          err instanceof Error ? err.message : "Gagal mengambil profil";
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async updateProfile(name: string, email: string): Promise<void> {
      this.isLoading = true;
      this.error = null;
      try {
        const data = await updateProfileApi(name, email);
        this.profile = data.user;
      } catch (err) {
        this.error =
          err instanceof Error ? err.message : "Gagal memperbarui profil";
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async uploadPhoto(photo: File): Promise<void> {
      this.isLoading = true;
      this.error = null;
      try {
        await uploadPhotoApi(photo);
        await this.fetchProfile();
      } catch (err) {
        this.error = err instanceof Error ? err.message : "Gagal upload foto";
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async changePassword(
      password: string,
      new_password: string,
      new_password_confirmation: string
    ): Promise<void> {
      this.isLoading = true;
      this.error = null;
      try {
        await changePasswordApi(password, new_password, new_password_confirmation);
      } catch (err) {
        this.error =
          err instanceof Error ? err.message : "Gagal mengubah password";
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
  },
});

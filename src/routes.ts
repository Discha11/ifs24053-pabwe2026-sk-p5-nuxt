// src/routes.ts
import type { RouteRecordRaw } from "vue-router";
import AuthLayout from "./features/auth/layouts/AuthLayout.vue";
import CashFlowLayout from "./features/cashflows/layouts/CashFlowLayout.vue";
import LoginPage from "./features/auth/pages/LoginPage.vue";
import RegisterPage from "./features/auth/pages/RegisterPage.vue";
import HomePage from "./features/cashflows/pages/HomePage.vue";
import DetailPage from "./features/cashflows/pages/DetailPage.vue";
import UsersPage from "./features/users/pages/UsersPage.vue";
import ProfilePage from "./features/users/pages/ProfilePage.vue";
import NotFoundPage from "./features/common/pages/NotFoundPage.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/auth",
    component: AuthLayout,
    children: [
      {
        path: "login",
        component: LoginPage,
        meta: { title: "Login - Delcom Todo" },
      },
      {
        path: "register",
        component: RegisterPage,
        meta: { title: "Daftar - Delcom Todo" },
      },
    ],
  },
  {
    path: "/",
    component: CashFlowLayout,
    children: [
      {
        path: "",
        component: HomePage,
        meta: { title: "Dashboard Arus Kas - Delcom Todo" },
      },
      {
        path: "cash-flows/:cashFlowId",
        component: DetailPage,
        meta: { title: "Detail Transaksi - Delcom Todo" },
      },
      {
        path: "users",
        component: UsersPage,
        meta: { title: "Direktori Pengguna - Delcom Todo" },
      },
      {
        path: "profile",
        component: ProfilePage,
        meta: { title: "Profil Saya - Delcom Todo" },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    component: NotFoundPage,
    meta: { title: "404 - Halaman Tidak Ditemukan" },
  },
];

export default routes;

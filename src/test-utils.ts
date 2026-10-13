// src/test-utils.ts
import { render, type RenderOptions } from "@testing-library/vue";
import { createPinia, setActivePinia, type Pinia } from "pinia";
import { createRouter, createMemoryHistory } from "vue-router";
import type { Component } from "vue";
import routes from "./routes";

export interface RenderWithProvidersOptions extends Omit<RenderOptions, "global"> {
  pinia?: Pinia;
}

export function createMockPinia() {
  const pinia = createPinia();
  setActivePinia(pinia);
  return pinia;
}

export function renderWithProviders(
  component: Component,
  options: RenderWithProvidersOptions = {}
) {
  const { pinia: customPinia, ...renderOptions } = options;

  const pinia = customPinia ?? createMockPinia();

  const router = createRouter({
    history: createMemoryHistory(),
    routes,
  });

  return render(component, {
    ...renderOptions,
    global: {
      plugins: [pinia, router],
    },
  });
}

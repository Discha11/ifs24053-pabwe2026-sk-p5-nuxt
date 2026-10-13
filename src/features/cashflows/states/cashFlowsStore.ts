// src/features/cashflows/states/cashFlowsStore.ts
import { defineStore } from "pinia";
import type {
  CashFlow,
  CashFlowStats,
  CashFlowQueryParams,
  StatsDaily,
  StatsMonthly,
} from "../api/cashFlowApi";
import {
  getCashFlowsApi,
  getCashFlowDetailApi,
  addCashFlowApi,
  updateCashFlowApi,
  deleteCashFlowApi,
  getLabelsApi,
  getStatsDailyApi,
  getStatsMonthlyApi,
  deleteAllCashFlowsApi,
} from "../api/cashFlowApi";

export interface CashFlowsState {
  cashFlows: CashFlow[];
  cashFlow: CashFlow | null;
  stats: CashFlowStats | null;
  labels: string[];
  statsDaily: StatsDaily | null;
  statsMonthly: StatsMonthly | null;

  isLoading: boolean;
  error: string | null;

  // Mutation status flags
  isCashFlowAdd: boolean;
  isCashFlowAdded: boolean;
  isCashFlowChange: boolean;
  isCashFlowChanged: boolean;
  isCashFlowDelete: boolean;
  isCashFlowDeleted: boolean;
  isCashFlowDeleteAll: boolean;
  isCashFlowDeletedAll: boolean;
}

export const useCashFlowsStore = defineStore("cashFlows", {
  state: (): CashFlowsState => ({
    cashFlows: [],
    cashFlow: null,
    stats: null,
    labels: [],
    statsDaily: null,
    statsMonthly: null,

    isLoading: false,
    error: null,

    isCashFlowAdd: false,
    isCashFlowAdded: false,
    isCashFlowChange: false,
    isCashFlowChanged: false,
    isCashFlowDelete: false,
    isCashFlowDeleted: false,
    isCashFlowDeleteAll: false,
    isCashFlowDeletedAll: false,
  }),

  getters: {
    totalInflow: (state) => state.stats?.total_inflow ?? 0,
    totalOutflow: (state) => state.stats?.total_outflow ?? 0,
    netCashflow: (state) => state.stats?.cashflow ?? 0,
  },

  actions: {
    async fetchCashFlows(params?: CashFlowQueryParams): Promise<void> {
      this.isLoading = true;
      this.error = null;
      try {
        const data = await getCashFlowsApi(params);
        this.cashFlows = data.cash_flows;
        this.stats = data.stats;
      } catch (err) {
        this.error =
          err instanceof Error ? err.message : "Gagal mengambil data arus kas";
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchCashFlowDetail(id: number): Promise<void> {
      this.isLoading = true;
      this.error = null;
      try {
        const data = await getCashFlowDetailApi(id);
        this.cashFlow = data.cash_flow;
      } catch (err) {
        this.error =
          err instanceof Error ? err.message : "Gagal mengambil detail arus kas";
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async addCashFlow(payload: {
      type: "inflow" | "outflow";
      source: "cash" | "savings" | "loans";
      label: string;
      description: string;
      nominal: number;
    }): Promise<void> {
      this.isCashFlowAdd = true;
      this.isCashFlowAdded = false;
      this.error = null;
      try {
        await addCashFlowApi(payload);
        this.isCashFlowAdded = true;
      } catch (err) {
        this.error =
          err instanceof Error ? err.message : "Gagal menambahkan arus kas";
        throw err;
      } finally {
        this.isCashFlowAdd = false;
      }
    },

    async updateCashFlow(
      id: number,
      payload: {
        type: "inflow" | "outflow";
        source: "cash" | "savings" | "loans";
        label: string;
        description: string;
        nominal: number;
      }
    ): Promise<void> {
      this.isCashFlowChange = true;
      this.isCashFlowChanged = false;
      this.error = null;
      try {
        await updateCashFlowApi(id, payload);
        this.isCashFlowChanged = true;
      } catch (err) {
        this.error =
          err instanceof Error ? err.message : "Gagal mengubah arus kas";
        throw err;
      } finally {
        this.isCashFlowChange = false;
      }
    },

    async deleteCashFlow(id: number): Promise<void> {
      this.isCashFlowDelete = true;
      this.isCashFlowDeleted = false;
      this.error = null;
      try {
        await deleteCashFlowApi(id);
        this.isCashFlowDeleted = true;
        this.cashFlows = this.cashFlows.filter((cf) => cf.id !== id);
      } catch (err) {
        this.error =
          err instanceof Error ? err.message : "Gagal menghapus arus kas";
        throw err;
      } finally {
        this.isCashFlowDelete = false;
      }
    },

    async fetchLabels(): Promise<void> {
      try {
        const data = await getLabelsApi();
        this.labels = data.labels;
      } catch {
        // ignore
      }
    },

    async fetchStatsDaily(): Promise<void> {
      try {
        this.statsDaily = await getStatsDailyApi();
      } catch {
        // ignore
      }
    },

    async fetchStatsMonthly(): Promise<void> {
      try {
        this.statsMonthly = await getStatsMonthlyApi();
      } catch {
        // ignore
      }
    },

    async deleteAllCashFlows(): Promise<void> {
      this.isCashFlowDeleteAll = true;
      this.isCashFlowDeletedAll = false;
      this.error = null;
      try {
        await deleteAllCashFlowsApi();
        this.cashFlows = [];
        this.stats = null;
        this.isCashFlowDeletedAll = true;
      } catch (err) {
        this.error =
          err instanceof Error ? err.message : "Gagal menghapus semua arus kas";
        throw err;
      } finally {
        this.isCashFlowDeleteAll = false;
      }
    },

    resetMutationFlags(): void {
      this.isCashFlowAdded = false;
      this.isCashFlowChanged = false;
      this.isCashFlowDeleted = false;
      this.isCashFlowDeletedAll = false;
    },
  },
});

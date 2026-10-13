// src/features/cashflows/api/cashFlowApi.ts
import { apiGet, apiPost, apiPut, apiDelete } from "../../../helpers/apiHelper";

export interface CashFlow {
  id: number;
  user_id: number;
  type: "inflow" | "outflow";
  source: "cash" | "savings" | "loans";
  label: string;
  description: string;
  nominal: number;
  created_at: string;
  updated_at: string;
}

export interface CashFlowStats {
  cashflow: number;
  total_inflow: number;
  total_outflow: number;
  [key: string]: number;
}

export interface CashFlowQueryParams {
  type?: "inflow" | "outflow";
  source?: "cash" | "savings" | "loans";
  label?: string;
  start_date?: string;
  end_date?: string;
}

export interface StatsDaily {
  stats_inflow: Record<string, number>;
  stats_outflow: Record<string, number>;
  stats_cashflow: Record<string, number>;
}

export interface StatsMonthly {
  stats_inflow: Record<string, number>;
  stats_outflow: Record<string, number>;
  stats_cashflow: Record<string, number>;
}

function buildQuery(params: Record<string, string | undefined>): string {
  const filtered = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== ""
  );
  if (!filtered.length) return "";
  return "?" + filtered.map(([k, v]) => `${k}=${encodeURIComponent(v!)}`).join("&");
}

export async function getCashFlowsApi(
  params: CashFlowQueryParams = {}
): Promise<{ cash_flows: CashFlow[]; stats: CashFlowStats }> {
  const query = buildQuery(params as Record<string, string | undefined>);
  return apiGet<{ cash_flows: CashFlow[]; stats: CashFlowStats }>(
    `/cash-flows${query}`
  );
}

export async function getCashFlowDetailApi(
  id: number
): Promise<{ cash_flow: CashFlow }> {
  return apiGet<{ cash_flow: CashFlow }>(`/cash-flows/${id}`);
}

export async function addCashFlowApi(payload: {
  type: "inflow" | "outflow";
  source: "cash" | "savings" | "loans";
  label: string;
  description: string;
  nominal: number;
}): Promise<{ cash_flow_id: number }> {
  return apiPost<{ cash_flow_id: number }>("/cash-flows", payload);
}

export async function updateCashFlowApi(
  id: number,
  payload: {
    type: "inflow" | "outflow";
    source: "cash" | "savings" | "loans";
    label: string;
    description: string;
    nominal: number;
  }
): Promise<void> {
  await apiPut(`/cash-flows/${id}`, payload);
}

export async function deleteCashFlowApi(id: number): Promise<void> {
  await apiDelete(`/cash-flows/${id}`);
}

export async function getLabelsApi(): Promise<{ labels: string[] }> {
  return apiGet<{ labels: string[] }>("/cash-flows/labels");
}

export async function getStatsDailyApi(params?: {
  end_date?: string;
  total_data?: number;
}): Promise<StatsDaily> {
  const query = buildQuery({
    end_date: params?.end_date,
    total_data: params?.total_data?.toString(),
  });
  return apiGet<StatsDaily>(`/cash-flows/stats/daily${query}`);
}

export async function getStatsMonthlyApi(params?: {
  end_date?: string;
  total_data?: number;
}): Promise<StatsMonthly> {
  const query = buildQuery({
    end_date: params?.end_date,
    total_data: params?.total_data?.toString(),
  });
  return apiGet<StatsMonthly>(`/cash-flows/stats/monthly${query}`);
}

export async function deleteAllCashFlowsApi(): Promise<void> {
  await apiDelete("/cash-flows");
}

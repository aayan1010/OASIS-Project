"use client";

// Typed API client for the OASIS Express backend.
// All requests go through the Next.js rewrite: /api/backend/* -> BACKEND_URL/api/*
// Every hook falls back to the local mock data if the backend is unreachable,
// so the UI keeps working without a running backend.

import useSWR from "swr";

import {
  assetLocations as mockAssets,
  telemetryStreams as mockTelemetry,
  type AssetLocation,
} from "../mocks/assets";
import { alertRecords as mockAlerts, type AlertRecord } from "../mocks/alerts";
import { sites as mockSites, type Site } from "../mocks/sites";
import { workOrders as mockWorkOrders, type WorkOrder } from "../mocks/maintenance";
import {
  monthlyBudget as mockMonthlyBudget,
  opexBreakdown as mockOpexBreakdown,
  revenueStreams as mockRevenueStreams,
  costPerUnit as mockCostPerUnit,
  capexProjects as mockCapexProjects,
} from "../mocks/finance";
import { scheduleAdherence as mockScheduleAdherence } from "../mocks/production";

const API_BASE = "/api/backend";

async function fetcher<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    throw new Error(`API request failed: ${res.status} ${path}`);
  }
  return res.json();
}

async function mutate<T>(path: string, method: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    throw new Error(`API request failed: ${res.status} ${method} ${path}`);
  }
  return res.json();
}

const swrOptions = {
  revalidateOnFocus: false,
  shouldRetryOnError: false,
};

// ---------- Types ----------

export type TelemetrySensor = (typeof mockTelemetry)[number];
export type MonthlyBudgetEntry = (typeof mockMonthlyBudget)[number];
export type OpexEntry = (typeof mockOpexBreakdown)[number];
export type RevenueStreamEntry = (typeof mockRevenueStreams)[number];
export type CostPerUnitEntry = (typeof mockCostPerUnit)[number];
export type CapexProject = (typeof mockCapexProjects)[number];
export type ScheduleAdherenceEntry = (typeof mockScheduleAdherence)[number];

export interface ProductionDailyRecord {
  id: string;
  site_id: string;
  // Firestore stores date as a Timestamp object; the backend serialises it as { _seconds, _nanoseconds }.
  date: string | { _seconds: number; _nanoseconds: number };
  production_target: number;
  actual_production: number;
  efficiency_percentage: number;
  downtime_hours: number;
  energy_used_kwh: number;
}

export interface ProductionPlanRecord {
  id: string;
  siteId: string;
  siteName: string;
  targetOutput: number;
  targetEfficiency: number;
  effectiveFrom: string;
  effectiveTo: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface DrillRecord {
  id: string;
  drillNumber: string;
  type: string;
  date: string;
  time: string;
  site: string;
  participants: number;
  notes: string;
  status: string;
}

export interface IncidentRecord {
  id: string;
  incidentNumber: string;
  type: string;
  category: string;
  severity: "low" | "medium" | "high" | "critical";
  site: string;
  description: string;
  status: string;
  dateLogged: string;
}

// ---------- Local Mock Fallbacks ----------
const mockDrills: DrillRecord[] = [];

// ---------- Read hooks (fall back to mocks on error) ----------

function useCollection<T>(path: string, fallback: T[]) {
  const { data, error, isLoading, mutate: revalidate } = useSWR<T[]>(path, fetcher, swrOptions);
  return {
    data: data ?? fallback,
    isLive: !error && data !== undefined,
    isLoading,
    revalidate,
  };
}

export function useAssets() {
  return useCollection<AssetLocation>("/assets", mockAssets);
}

export function useTelemetry() {
  return useCollection<TelemetrySensor>("/telemetry", mockTelemetry);
}

export function useAlerts() {
  return useCollection<AlertRecord>("/alerts", mockAlerts);
}

export function useSites() {
  return useCollection<Site>("/sites", mockSites);
}

export function useWorkOrders() {
  return useCollection<WorkOrder>("/maintenance", mockWorkOrders);
}

export function useMonthlyBudget() {
  return useCollection<MonthlyBudgetEntry>("/finance/budget", mockMonthlyBudget);
}

export function useOpexBreakdown() {
  return useCollection<OpexEntry>("/finance/opex", mockOpexBreakdown);
}

export function useRevenueStreams() {
  return useCollection<RevenueStreamEntry>("/finance/revenue", mockRevenueStreams);
}

export function useCostPerUnit() {
  return useCollection<CostPerUnitEntry>("/finance/cost-per-unit", mockCostPerUnit);
}

export function useCapexProjects() {
  return useCollection<CapexProject>("/finance/capex", mockCapexProjects);
}

export function useScheduleAdherence() {
  return useCollection<ScheduleAdherenceEntry>("/production/schedule-adherence", mockScheduleAdherence);
}

export function useDailyYield() {
  return useCollection<ProductionDailyRecord>("/production/daily-yield", []);
}

export function useProductionRecords() {
  return useCollection<ProductionDailyRecord>("/production/records", []);
}

export function useDrills() {
  return useCollection<DrillRecord>("/drills", mockDrills);
}

export function useProductionPlans() {
  return useCollection<ProductionPlanRecord>("/plans", []);
}

export function useLatestProductionPlan() {
  const { data, isLive, isLoading, revalidate } = useProductionPlans();
  return { data: data[0] ?? null, isLive, isLoading, revalidate };
}

export function useIncidents() {
  return useCollection<IncidentRecord>("/incidents", []);
}

// ---------- Mutations ----------

export function acknowledgeAlert(id: string) {
  return mutate(`/alerts/${id}/acknowledge`, "POST");
}

export function resolveAlert(id: string) {
  return mutate(`/alerts/${id}/resolve`, "POST");
}

export function createWorkOrder(workOrder: Partial<WorkOrder>) {
  return mutate("/maintenance", "POST", workOrder);
}

export function updateWorkOrder(id: string, updates: Partial<WorkOrder>) {
  return mutate(`/maintenance/${id}`, "PATCH", updates);
}

export function createCapexProject(project: Partial<CapexProject>) {
  return mutate("/finance/capex", "POST", project);
}

export async function createProductionPlan(plan: Omit<ProductionPlanRecord, "id" | "createdAt" | "updatedAt">) {
  return mutate<ProductionPlanRecord>("/plans", "POST", plan);
}

export async function createDrill(drill: Partial<DrillRecord>) {
  try {
    return await mutate("/drills", "POST", drill);
  } catch {
    // If the backend fails or isn't built yet, update the local cache so the UI works
    mockDrills.unshift(drill as DrillRecord);
    return drill;
  }
}

export async function createIncident(incident: Partial<IncidentRecord>) {
  return mutate("/incidents", "POST", incident);
}

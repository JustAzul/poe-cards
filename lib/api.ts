import type { LeagueDataResponse, LeaguesListResponse } from "@/lib/types/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

async function apiFetch<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    let message = `API error: ${res.status} ${res.statusText}`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore parse failure
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export async function fetchLeagues(): Promise<LeaguesListResponse> {
  return apiFetch<LeaguesListResponse>(`${API_BASE}/api/prices/leagues`);
}

export async function fetchLeagueData(league: string): Promise<LeagueDataResponse> {
  return apiFetch<LeagueDataResponse>(
    `${API_BASE}/api/prices/${encodeURIComponent(league)}`
  );
}

import apiClient from './apiClient';

export interface ReportPayload {
  equipment: string;
  data: Record<string, unknown>;
}

export interface ReportResponse {
  message: string;
  report: {
    id: string;
    idempotencyKey: string;
    savedAt: string;
    [key: string]: unknown;
  };
}

export interface ReportsListResponse {
  count: number;
  reports: ReportResponse['report'][];
}

// Submit an inspection report
export function submitReport(payload: ReportPayload, idempotencyKey: string) {
  return apiClient.post<ReportResponse>('/reports', payload, {
    idempotencyKey,
  } as any);
}


export function fetchReports() {
  return apiClient.get<ReportsListResponse>('/reports');
}

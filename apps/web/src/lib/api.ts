const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || 'API Error');
  }
  return res.json();
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    fetchAPI<any>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  // Patients
  getPatients: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return fetchAPI<any[]>(`/patients${qs}`);
  },
  getPatient: (id: string) => fetchAPI<any>(`/patients/${id}`),

  // Encounters
  getEncounters: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return fetchAPI<any[]>(`/encounters${qs}`);
  },
  getEncounter: (id: string) => fetchAPI<any>(`/encounters/${id}`),

  // Vitals
  getVitals: (encounterId: string) => fetchAPI<any[]>(`/vitals/encounter/${encounterId}`),

  // Labs
  getLabs: (encounterId: string) => fetchAPI<any[]>(`/labs/encounter/${encounterId}`),

  // Imaging
  getImaging: (encounterId: string) => fetchAPI<any[]>(`/imaging/encounter/${encounterId}`),

  // NIHSS
  getNIHSS: (encounterId: string) => fetchAPI<any[]>(`/nihss/encounter/${encounterId}`),
  getTPADose: (weightKg: number) => fetchAPI<any>(`/nihss/tpa-dose/${weightKg}`),

  // Consultations
  getConsultations: (encounterId: string) => fetchAPI<any[]>(`/consultations/encounter/${encounterId}`),
  getConsultation: (id: string) => fetchAPI<any>(`/consultations/${id}`),
  sendMessage: (consultationId: string, content: string) =>
    fetchAPI<any>(`/consultations/${consultationId}/messages`, { method: 'POST', body: JSON.stringify({ content }) }),
  getMessages: (consultationId: string) => fetchAPI<any[]>(`/consultations/${consultationId}/messages`),

  // Orders
  getOrders: (encounterId: string) => fetchAPI<any[]>(`/orders/encounter/${encounterId}`),
  createOrder: (data: any) => fetchAPI<any>('/orders', { method: 'POST', body: JSON.stringify(data) }),
  createTPAOrder: (data: any) => fetchAPI<any>('/orders/tpa', { method: 'POST', body: JSON.stringify(data) }),

  // Alerts
  getMyAlerts: (status?: string) => {
    const qs = status ? `?status=${status}` : '';
    return fetchAPI<any[]>(`/alerts/my${qs}`);
  },
  acknowledgeAlert: (id: string) => fetchAPI<any>(`/alerts/${id}/acknowledge`, { method: 'PATCH' }),
  transmitAndAlert: (data: any) => fetchAPI<any>('/alerts/transmit', { method: 'POST', body: JSON.stringify(data) }),

  // Audit
  getAuditLogs: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return fetchAPI<any>(`/audit${qs}`);
  },
};

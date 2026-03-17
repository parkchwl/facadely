export interface SignupPayload {
  email: string;
  password: string;
  name: string;
  locale: string;
  agreeTerms: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface TermsAgreePayload {
  termsVersion: string;
  privacyVersion: string;
  locale: string;
}

export interface MeResponse {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  termsAgreed: boolean;
}

const DEFAULT_API_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://api.facadely.com/api/v1'
    : 'http://localhost:8080/api/v1';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/$/, '');

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });

  if (!response.ok) {
    let message = '요청 처리 중 오류가 발생했습니다.';
    try {
      const body = await response.json() as { message?: string };
      if (body?.message) {
        message = body.message;
      }
    } catch {
      // no-op
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function signup(payload: SignupPayload): Promise<MeResponse> {
  return request<MeResponse>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function login(payload: LoginPayload): Promise<MeResponse> {
  return request<MeResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function logout(): Promise<void> {
  await request<void>('/auth/logout', {
    method: 'POST',
  });
}

export async function refresh(): Promise<MeResponse> {
  return request<MeResponse>('/auth/refresh', {
    method: 'POST',
  });
}

export async function me(): Promise<MeResponse> {
  return request<MeResponse>('/auth/me', {
    method: 'GET',
  });
}

export async function agreeTerms(payload: TermsAgreePayload): Promise<{ message: string }> {
  return request<{ message: string }>('/auth/terms/agree', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getGoogleAuthUrl(): string {
  return `${API_BASE_URL}/auth/oauth2/authorization/google`;
}

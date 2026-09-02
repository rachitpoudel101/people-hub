const API_BASE = import.meta.env.VITE_API_URL;

export interface TokenPair {
  access: string;
  refresh: string;
}

export function getTokens(): TokenPair | null {
  const access = localStorage.getItem("access_token");
  const refresh = localStorage.getItem("refresh_token");
  if (access && refresh) return { access, refresh };
  return null;
}

export function setTokens(tokens: TokenPair) {
  localStorage.setItem("access_token", tokens.access);
  localStorage.setItem("refresh_token", tokens.refresh);
}

export function clearTokens() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
}

async function refreshToken(): Promise<string | null> {
  const tokens = getTokens();
  if (!tokens) return null;
  try {
    const res = await fetch(`${API_BASE}/api/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: tokens.refresh }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    setTokens({ access: data.access, refresh: tokens.refresh });
    return data.access;
  } catch {
    return null;
  }
}

export async function apiRequest<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const tokens = getTokens();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (tokens) {
    headers["Authorization"] = `Bearer ${tokens.access}`;
  }

  let res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });

  if (res.status === 401 && tokens) {
    const newAccess = await refreshToken();
    if (newAccess) {
      headers["Authorization"] = `Bearer ${newAccess}`;
      res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    } else {
      clearTokens();
      window.location.href = "/login";
      throw new Error("Session expired");
    }
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || JSON.stringify(error));
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export async function login(username: string, password: string) {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Login failed" }));
    throw new Error(err.detail || "Invalid credentials");
  }
  return res.json();
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

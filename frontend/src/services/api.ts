/* Sin NEXT_PUBLIC_API_URL: proxy same-origin en /api-proxy (evita CORS). Con env: URL directa al API. */
function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  }
  if (typeof window !== "undefined") {
    return `${window.location.origin}/api-proxy`;
  }
  /* SSR: mismo host que el build no aplica; fallback al backend local */
  return "http://localhost:5087/api";
}

export const api = {
  async get(endpoint: string) {
    return fetchWithAuth(endpoint, { method: "GET" });
  },
  
  async post(endpoint: string, body: unknown) {
    return fetchWithAuth(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },
  
  async put(endpoint: string, body: unknown) {
    return fetchWithAuth(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  },
  
  async delete(endpoint: string) {
    return fetchWithAuth(endpoint, { method: "DELETE" });
  },

  async getFile(endpoint: string) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${getBaseUrl()}${endpoint}`, {
      method: "GET",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) throw new Error("Failed to download file");
    return response.blob();
  }
};

async function fetchWithAuth(endpoint: string, options: RequestInit) {
  let token = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem("token");
  }

  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${getBaseUrl()}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem("token");
      window.location.href = '/login';
    }
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `API Error: ${response.status}`);
  }

  // Si devuelve 204 No Content, parsear JSON falla, retornamos null
  if (response.status === 204) return null;
  
  return response.json();
}

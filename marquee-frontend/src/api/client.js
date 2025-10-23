const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export async function api(path, { method="GET", body } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    credentials: "include",              // <-- cookie roundtrip
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data?.message || data?.error || `HTTP ${res.status}`);
    err.status = res.status;
    err.info = data;
    throw err;
  }
  return data;
}

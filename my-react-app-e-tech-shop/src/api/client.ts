export const API_BASE = "https://localhost:7150/api";

export const getHeaders = (token?: string) => ({
  "Content-Type": "application/json",
  ...(token && { Authorization: "Bearer " + token }),
});

export async function handleResponse(res: Response) {
  if (!res.ok) {
    let message = "Server error";

    try {
      const data = await res.json();
      message = data.message || message;
    } catch {}

    throw new Error(message);
  }

  return res.json();
}
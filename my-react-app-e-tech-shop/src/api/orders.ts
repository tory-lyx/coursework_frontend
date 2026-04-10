import { API_BASE, getHeaders, handleResponse } from "./client";

export const createOrder = (token: string, cart: Record<number, number>) =>
  fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(cart),
  }).then(handleResponse);

export const getMyOrders = (token: string) =>
  fetch(`${API_BASE}/orders/my`, {
    headers: getHeaders(token),
  }).then(handleResponse);

export const changeOrderStatus = (
  token: string,
  id: number,
  status: string
) =>
  fetch(`${API_BASE}/orders/${id}/status?status=${status}`, {
    method: "PUT",
    headers: getHeaders(token),
  }).then(handleResponse);
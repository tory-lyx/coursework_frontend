import { API_BASE, getHeaders, handleResponse } from "./client";

export const getProducts = (token: string) =>
  fetch(`${API_BASE}/products`, {
    headers: getHeaders(token),
  }).then(handleResponse);

export const createProduct = (
  token: string,
  product: { name: string; price: number; stockQuantity: number }
) =>
  fetch(`${API_BASE}/products`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(product),
  }).then(handleResponse);

export const deleteProduct = (token: string, id: number) =>
  fetch(`${API_BASE}/products/${id}`, {
    method: "DELETE",
    headers: getHeaders(token),
  }).then(handleResponse);
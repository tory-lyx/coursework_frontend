import { API_BASE, getHeaders, handleResponse } from "./client";

export const loginRequest = (login: string, password: string) =>
  fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ login, password }),
  }).then(handleResponse);

export const registerRequest = (login: string, password: string) =>
  fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ login, password }),
  }).then(handleResponse);
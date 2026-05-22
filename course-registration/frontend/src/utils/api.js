const API_BASE = 'https://final-production-a961.up.railway.app';

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('cr_token');
  const res = await fetch(`${API_BASE}${path}`, {
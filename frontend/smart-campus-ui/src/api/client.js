const TOKEN_KEY = 'smart_campus_token'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '') || ''

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export async function apiFetch(path, options = {}) {
  const headers = new Headers(options.headers || {})
  const token = getToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)
  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  const url = `${API_BASE_URL}${path}`
  const res = await fetch(url, { ...options, headers })
  if (res.status === 401) {
    setToken(null)
    window.dispatchEvent(new CustomEvent('smart-campus:auth'))
  }
  return res
}

export async function parseJson(res) {
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

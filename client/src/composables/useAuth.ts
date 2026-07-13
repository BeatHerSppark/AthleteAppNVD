import { ref, readonly } from 'vue'
import { jwtDecode } from 'jwt-decode'
import type { CurrentUser, JwtPayload, UserRole, CreateAppUserDTO } from '../types'
import apiClient from '../services/apiClient'

const TOKEN_KEY = 'auth_token'
const _currentUser = ref<CurrentUser | null>(null)

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

function setCurrentUserFromToken(token: string): void {
  try {
    const payload = jwtDecode<JwtPayload>(token)
    if (payload.exp * 1000 <= Date.now()) {
      logoutLocal()
      return
    }
    _currentUser.value = {
      personId: payload.personId ?? null,
      userId: payload.userId,
      embg: payload.sub,
      role: payload.role,
      firstName: payload.firstName,
      lastName: payload.lastName,
      exp: payload.exp
    }
  } catch {
    logoutLocal()
  }
}

// Initialize from token on startup
const token = getToken()
if (token) setCurrentUserFromToken(token)

function logoutLocal(): void {
  localStorage.removeItem(TOKEN_KEY)
  _currentUser.value = null
}

export function useAuth() {
  async function login(embg: string, password: string): Promise<string> {
    const response = await apiClient.post('/api/login', { embg, password }, { responseType: 'text' })
    const token = (response.data || '').trim()
    if (!token) throw new Error('Invalid login response')
    setToken(token)
    setCurrentUserFromToken(token)
    return token
  }

  async function register(payload: CreateAppUserDTO): Promise<string> {
    const response = await apiClient.post('/api/register', payload, { responseType: 'text' })
    const token = (response.data || '').trim()
    if (!token) throw new Error('Empty token from server')
    setToken(token)
    setCurrentUserFromToken(token)
    return token
  }

  function logout(): void {
    logoutLocal()
  }

  function getRole(): UserRole | null {
    const token = getToken()
    if (!token) return null
    try {
      const decoded = jwtDecode<JwtPayload>(token)
      return decoded.role ?? null
    } catch {
      return null
    }
  }

  function isLoggedIn(): boolean {
    return !!getToken()
  }

  function getCurrentUser(): CurrentUser | null {
    return _currentUser.value
  }

  return {
    currentUser: readonly(_currentUser),
    login,
    register,
    logout,
    getRole,
    isLoggedIn,
    getCurrentUser,
    getToken
  }
}

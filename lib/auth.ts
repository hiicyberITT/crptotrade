export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'admin' | 'user'
  walletAddress: string
  isVerified: boolean
  kycStatus?: 'pending' | 'approved' | 'rejected' | 'none'
  balance?: {
    BTC: number
    ETH: number
    USD: number
    USDT: number
  }
  profile?: {
    fullName: string
    dateOfBirth: string
    nationality: string
    idType: string
    idNumber: string
    address: string
    city: string
    country: string
    phone: string
    occupation: string
  }
  tradingLimits?: {
    daily: number
    monthly: number
    withdrawal: number
  }
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null
  
  try {
    const userData = localStorage.getItem('user')
    return userData ? JSON.parse(userData) : null
  } catch {
    return null
  }
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  
  const token = localStorage.getItem('auth-token')
  const user = getCurrentUser()
  
  return !!(token && user)
}

export function logout(): void {
  if (typeof window === 'undefined') return
  
  localStorage.removeItem('user')
  localStorage.removeItem('auth-token')
}

export function signToken(payload: { userId: string; email: string; role: string }): string {
  const tokenData = {
    ...payload,
    exp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 ngày
  }
  return Buffer.from(JSON.stringify(tokenData)).toString('base64')
}

export function verifyToken(token: string): any {
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString())
    if (decoded.exp < Date.now()) {
      return null // Token hết hạn
    }
    return decoded
  } catch {
    return null
  }
}

export function hashPassword(password: string): string {
  // Trong thực tế nên dùng bcrypt, đây chỉ là demo
  const crypto = require('crypto')
  return crypto.createHash('sha256').update(password + 'salt').digest('hex')
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash
}

export function requiresKYC(user: User): boolean {
  return !user.kycStatus || user.kycStatus === 'pending' || user.kycStatus === 'rejected'
}

export function canTrade(user: User): boolean {
  return user.kycStatus === 'approved'
}

export function getTradingLimits(user: User) {
  if (user.kycStatus === 'approved') {
    return {
      daily: 10000,
      monthly: 100000,
      withdrawal: 5000
    }
  }
  return {
    daily: 0,
    monthly: 0,
    withdrawal: 0
  }
}

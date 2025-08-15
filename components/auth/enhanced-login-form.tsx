'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Mail, Lock, Shield, Smartphone, QrCode, Fingerprint, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface LoginFormProps {
  onSwitchToRegister: () => void
}

export function EnhancedLoginForm({ onSwitchToRegister }: LoginFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
    twoFactorCode: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [lockTimeRemaining, setLockTimeRemaining] = useState(0)
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false)
  const [requiresDeviceVerification, setRequiresDeviceVerification] = useState(false)
  const [showBiometric, setShowBiometric] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)

  useEffect(() => {
    if (isLocked && lockTimeRemaining > 0) {
      const timer = setInterval(() => {
        setLockTimeRemaining(prev => {
          if (prev <= 1) {
            setIsLocked(false)
            setLoginAttempts(0)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isLocked, lockTimeRemaining])

  useEffect(() => {
    // Check if biometric authentication is available
    if (typeof window !== 'undefined' && 'credentials' in navigator) {
      setShowBiometric(true)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, rememberMe: checked }))
  }

  const handleDemoLogin = (email: string) => {
    setFormData(prev => ({
      ...prev,
      email,
      password: 'password'
    }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isLocked) {
      setError(`Tài khoản đã bị khóa. Vui lòng thử lại sau ${Math.ceil(lockTimeRemaining / 60)} phút.`)
      return
    }

    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/auth/enhanced-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          twoFactorCode: formData.twoFactorCode,
          rememberMe: formData.rememberMe,
          deviceInfo: {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            timestamp: new Date().toISOString()
          }
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess('Đăng nhập thành công! Đang chuyển hướng...')
        setTimeout(() => {
          router.push('/')
        }, 1500)
      } else {
        if (data.requiresTwoFactor) {
          setRequiresTwoFactor(true)
          setSuccess('Vui lòng nhập mã xác thực 2FA')
        } else if (data.requiresDeviceVerification) {
          setRequiresDeviceVerification(true)
          setSuccess('Thiết bị mới được phát hiện. Vui lòng xác thực.')
        } else {
          setError(data.error || 'Đăng nhập thất bại')
          setLoginAttempts(prev => prev + 1)
          
          if (data.attemptsRemaining !== undefined && data.attemptsRemaining <= 0) {
            setIsLocked(true)
            setLockTimeRemaining(300) // 5 minutes
            setError('Tài khoản đã bị khóa do đăng nhập sai quá nhiều lần. Vui lòng thử lại sau 5 phút.')
          }
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Không thể kết nối đến server. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBiometricLogin = async () => {
    try {
      setIsLoading(true)
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: new Uint8Array(32),
          rp: { name: "BTC Exchange Pro" },
          user: {
            id: new Uint8Array(16),
            name: formData.email,
            displayName: formData.email
          },
          pubKeyCredParams: [{ alg: -7, type: "public-key" }],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required"
          }
        }
      })
      
      if (credential) {
        setSuccess('Xác thực sinh trắc học thành công!')
        setTimeout(() => {
          router.push('/')
        }, 1500)
      }
    } catch (error) {
      setError('Xác thực sinh trắc học thất bại')
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Đăng nhập</CardTitle>
        <CardDescription className="text-center">
          Truy cập vào tài khoản BTC Exchange Pro của bạn
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <AlertTriangle className="w-4 h-4" />
            {error}
          </div>
        )}
        
        {success && (
          <div className="flex items-center gap-2 p-3 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <CheckCircle className="w-4 h-4" />
            {success}
          </div>
        )}

        {isLocked && (
          <div className="flex items-center gap-2 p-3 text-sm text-orange-600 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <Clock className="w-4 h-4" />
            Tài khoản bị khóa: {formatTime(lockTimeRemaining)}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleInputChange}
                className="pl-10"
                required
                disabled={isLoading || isLocked}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                value={formData.password}
                onChange={handleInputChange}
                className="pl-10 pr-10"
                required
                disabled={isLoading || isLocked}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading || isLocked}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {requiresTwoFactor && (
            <div className="space-y-2">
              <Label htmlFor="twoFactorCode">Mã xác thực 2FA</Label>
              <div className="relative">
                <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="twoFactorCode"
                  name="twoFactorCode"
                  type="text"
                  placeholder="123456"
                  value={formData.twoFactorCode}
                  onChange={handleInputChange}
                  className="pl-10"
                  maxLength={6}
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Nhập mã 6 số từ ứng dụng xác thực của bạn
              </p>
            </div>
          )}

          {requiresDeviceVerification && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <Smartphone className="w-4 h-4" />
                <span className="font-medium">Xác thực thiết bị mới</span>
              </div>
              <p className="text-xs text-blue-600 mt-1">
                Chúng tôi đã gửi mã xác thực đến email của bạn
              </p>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="rememberMe"
              checked={formData.rememberMe}
              onCheckedChange={handleCheckboxChange}
              disabled={isLoading || isLocked}
            />
            <Label htmlFor="rememberMe" className="text-sm">
              Ghi nhớ đăng nhập
            </Label>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || isLocked}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Đang đăng nhập...
              </>
            ) : (
              'Đăng nhập'
            )}
          </Button>
        </form>

        <div className="space-y-3">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Hoặc đăng nhập bằng
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {showBiometric && (
              <Button
                variant="outline"
                onClick={handleBiometricLogin}
                disabled={isLoading || isLocked}
                className="flex items-center gap-2"
              >
                <Fingerprint className="w-4 h-4" />
                Sinh trắc học
              </Button>
            )}
            
            <Button
              variant="outline"
              onClick={() => setShowQRCode(!showQRCode)}
              disabled={isLoading || isLocked}
              className="flex items-center gap-2"
            >
              <QrCode className="w-4 h-4" />
              QR Code
            </Button>
          </div>

          {showQRCode && (
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
              <div className="w-32 h-32 bg-white mx-auto mb-2 rounded-lg flex items-center justify-center">
                <QrCode className="w-16 h-16 text-gray-400" />
              </div>
              <p className="text-xs text-muted-foreground">
                Quét mã QR bằng ứng dụng di động
              </p>
            </div>
          )}
        </div>

        <div className="text-center space-y-2">
          <Link 
            href="/auth/forgot-password" 
            className="text-sm text-primary hover:underline"
          >
            Quên mật khẩu?
          </Link>
          
          <div className="text-sm text-muted-foreground">
            Chưa có tài khoản?{' '}
            <Button
              variant="link"
              className="p-0 h-auto text-primary"
              onClick={onSwitchToRegister}
            >
              Đăng ký ngay
            </Button>
          </div>
        </div>

        {/* Demo Account Info */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p className="text-xs text-center text-muted-foreground mb-3">
            Tài khoản demo để test:
          </p>
          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => handleDemoLogin('admin@btcexchange.com')}
              disabled={isLoading || isLocked}
            >
              <strong>Admin:</strong> admin@btcexchange.com
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => handleDemoLogin('user@example.com')}
              disabled={isLoading || isLocked}
            >
              <strong>User:</strong> user@example.com
            </Button>
          </div>
          <p className="text-xs text-center text-muted-foreground mt-2">
            Mật khẩu: <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">password</code>
          </p>
        </div>

        <div className="pt-4 border-t">
          <div className="text-xs text-center text-muted-foreground space-y-1">
            <p>Đăng nhập có nghĩa là bạn đồng ý với</p>
            <div className="space-x-2">
              <Link href="/terms" className="text-primary hover:underline">
                Điều khoản dịch vụ
              </Link>
              <span>và</span>
              <Link href="/privacy" className="text-primary hover:underline">
                Chính sách bảo mật
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

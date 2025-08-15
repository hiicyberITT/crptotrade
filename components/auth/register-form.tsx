'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, UserPlus, AlertCircle, CheckCircle, Shield } from 'lucide-react'

interface RegisterFormProps {
  onSuccess: () => void
  onSwitchToLogin?: () => void
}

export function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    console.log('Bắt đầu đăng ký với dữ liệu:', { ...formData, password: '***', confirmPassword: '***' })

    // Kiểm tra phía client
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin')
      setIsLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự')
      setIsLoading(false)
      return
    }

    try {
      console.log('Gửi yêu cầu đăng ký...')
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      console.log('Response status:', response.status)

      if (!response.ok) {
        console.log('Response không ok, status:', response.status)
        const errorText = await response.text()
        console.log('Error response text:', errorText)
        
        try {
          const errorData = JSON.parse(errorText)
          throw new Error(errorData.error || `HTTP ${response.status}`)
        } catch (parseError) {
          throw new Error(`Server error: ${response.status}`)
        }
      }

      const data = await response.json()
      console.log('Response data:', { ...data, token: data.token ? '***' : undefined })

      if (data.success) {
        setSuccess(data.message || 'Đăng ký thành công!')
        
        // Lưu thông tin user
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user))
          console.log('Đã lưu user vào localStorage')
        }
        
        if (data.token) {
          localStorage.setItem('auth-token', data.token)
          console.log('Đã lưu token vào localStorage')
        }
        
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: ''
        })

        // Gọi callback sau 2 giây
        setTimeout(() => {
          console.log('Gọi onSuccess callback')
          onSuccess()
        }, 2000)
      } else {
        console.log('Đăng ký thất bại:', data.error)
        setError(data.error || 'Đăng ký thất bại')
      }
    } catch (error) {
      console.error('Lỗi đăng ký:', error)
      
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Có lỗi xảy ra. Vui lòng thử lại.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError('') // Xóa lỗi khi user bắt đầu nhập
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Tạo Tài Khoản</CardTitle>
        <p className="text-muted-foreground">Tham gia CryptoTrade ngay hôm nay</p>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4 border-blue-200 bg-blue-50 text-blue-800">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Tài khoản mới cần hoàn thành xác thực danh tính (KYC) để có thể giao dịch.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Họ</Label>
              <Input
                id="firstName"
                placeholder="Nguyễn"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Tên</Label>
              <Input
                id="lastName"
                placeholder="Văn A"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Tạo mật khẩu"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Nhập lại mật khẩu"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                required
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Đang tạo tài khoản...
              </div>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Tạo Tài Khoản
              </>
            )}
          </Button>

          {onSwitchToLogin && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Đã có tài khoản?{' '}
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto font-normal"
                  onClick={onSwitchToLogin}
                  disabled={isLoading}
                >
                  Đăng nhập
                </Button>
              </p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Eye, EyeOff, Mail, Lock, User, Phone, Shield, Gift, Star, CheckCircle, AlertTriangle, Check, X } from 'lucide-react'

interface RegisterFormProps {
  onSwitchToLogin: () => void
}

export function EnhancedRegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToMarketing: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null)
  const [phoneAvailable, setPhoneAvailable] = useState<boolean | null>(null)
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)
  const [isCheckingPhone, setIsCheckingPhone] = useState(false)

  const calculatePasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 6) strength += 20
    if (password.length >= 8) strength += 20
    if (/[A-Z]/.test(password)) strength += 20
    if (/[a-z]/.test(password)) strength += 20
    if (/[0-9]/.test(password)) strength += 20
    return Math.min(strength, 100)
  }

  const getPasswordStrengthText = (strength: number) => {
    if (strength < 40) return 'Yếu'
    if (strength < 60) return 'Trung bình'
    if (strength < 80) return 'Mạnh'
    return 'Rất mạnh'
  }

  const getPasswordStrengthColor = (strength: number) => {
    if (strength < 40) return 'bg-red-500'
    if (strength < 60) return 'bg-yellow-500'
    if (strength < 80) return 'bg-blue-500'
    return 'bg-green-500'
  }

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(formData.password))
  }, [formData.password])

  useEffect(() => {
    const checkEmailAvailability = async () => {
      if (formData.email && formData.email.includes('@') && formData.email.includes('.')) {
        setIsCheckingEmail(true)
        try {
          const response = await fetch('/api/auth/check-availability', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: formData.email })
          })
          const data = await response.json()
          setEmailAvailable(data.available)
        } catch (error) {
          console.error('Email check error:', error)
          setEmailAvailable(null)
        } finally {
          setIsCheckingEmail(false)
        }
      } else {
        setEmailAvailable(null)
      }
    }

    const debounceTimer = setTimeout(checkEmailAvailability, 800)
    return () => clearTimeout(debounceTimer)
  }, [formData.email])

  useEffect(() => {
    const checkPhoneAvailability = async () => {
      const cleanPhone = formData.phone.replace(/[\s\-()]/g, '')
      if (cleanPhone && cleanPhone.length >= 10) {
        setIsCheckingPhone(true)
        try {
          const response = await fetch('/api/auth/check-availability', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: formData.phone })
          })
          const data = await response.json()
          setPhoneAvailable(data.available)
        } catch (error) {
          console.error('Phone check error:', error)
          setPhoneAvailable(null)
        } finally {
          setIsCheckingPhone(false)
        }
      } else {
        setPhoneAvailable(null)
      }
    }

    const debounceTimer = setTimeout(checkPhoneAvailability, 800)
    return () => clearTimeout(debounceTimer)
  }, [formData.phone])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }))
  }

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError('Vui lòng nhập họ')
      return false
    }
    if (!formData.lastName.trim()) {
      setError('Vui lòng nhập tên')
      return false
    }
    if (!formData.email.trim()) {
      setError('Vui lòng nhập email')
      return false
    }
    if (!formData.phone.trim()) {
      setError('Vui lòng nhập số điện thoại')
      return false
    }
    if (!formData.password) {
      setError('Vui lòng nhập mật khẩu')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp')
      return false
    }
    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự')
      return false
    }
    if (emailAvailable === false) {
      setError('Email này đã được sử dụng')
      return false
    }
    if (phoneAvailable === false) {
      setError('Số điện thoại này đã được sử dụng')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      console.log('Submitting registration:', formData)
      
      const response = await fetch('/api/auth/enhanced-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      console.log('Registration response:', data)

      if (response.ok && data.success) {
        setSuccess('Đăng ký thành công! Chào mừng bạn đến với BTC Exchange Pro.')
        
        // Clear form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          agreeToMarketing: false
        })
        
        // Switch to login after 2 seconds
        setTimeout(() => {
          onSwitchToLogin()
        }, 2000)
      } else {
        setError(data.error || 'Đăng ký thất bại. Vui lòng thử lại.')
      }
    } catch (error) {
      console.error('Registration error:', error)
      setError('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng và thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Đăng ký</CardTitle>
        <CardDescription className="text-center">
          Tạo tài khoản BTC Exchange Pro mới
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Welcome Benefits */}
        <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="w-5 h-5 text-orange-500" />
            <span className="font-semibold text-orange-700 dark:text-orange-300">Ưu đãi người dùng mới</span>
          </div>
          <div className="space-y-1 text-sm text-orange-600 dark:text-orange-400">
            <div className="flex items-center gap-2">
              <Star className="w-3 h-3" />
              <span>0.001 BTC miễn phí</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-3 h-3" />
              <span>$10 USD bonus</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-3 h-3" />
              <span>Hỗ trợ 24/7 bằng tiếng Việt</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        {success && (
          <div className="flex items-center gap-2 p-3 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Họ *</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Nguyễn"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Tên *</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Văn A"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleInputChange}
                className="pl-10 pr-10"
                required
                disabled={isLoading}
              />
              {isCheckingEmail && (
                <div className="absolute right-3 top-3">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {!isCheckingEmail && emailAvailable !== null && (
                <div className="absolute right-3 top-3">
                  {emailAvailable ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <X className="w-4 h-4 text-red-500" />
                  )}
                </div>
              )}
            </div>
            {emailAvailable === false && (
              <p className="text-xs text-red-500">Email này đã được sử dụng</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Số điện thoại *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="0901234567"
                value={formData.phone}
                onChange={handleInputChange}
                className="pl-10 pr-10"
                required
                disabled={isLoading}
              />
              {isCheckingPhone && (
                <div className="absolute right-3 top-3">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {!isCheckingPhone && phoneAvailable !== null && (
                <div className="absolute right-3 top-3">
                  {phoneAvailable ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <X className="w-4 h-4 text-red-500" />
                  )}
                </div>
              )}
            </div>
            {phoneAvailable === false && (
              <p className="text-xs text-red-500">Số điện thoại này đã được sử dụng</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu *</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                value={formData.password}
                onChange={handleInputChange}
                className="pl-10 pr-10"
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
            {formData.password && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span>Độ mạnh mật khẩu:</span>
                  <span className={`font-medium ${
                    passwordStrength < 40 ? 'text-red-500' : 
                    passwordStrength < 60 ? 'text-yellow-500' : 
                    passwordStrength < 80 ? 'text-blue-500' : 'text-green-500'
                  }`}>
                    {getPasswordStrengthText(passwordStrength)}
                  </span>
                </div>
                <Progress 
                  value={passwordStrength} 
                  className="h-2"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu *</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Nhập lại mật khẩu"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="pl-10 pr-10"
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
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="text-xs text-red-500">Mật khẩu xác nhận không khớp</p>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="agreeToMarketing"
                checked={formData.agreeToMarketing}
                onCheckedChange={(checked) => handleCheckboxChange('agreeToMarketing', checked as boolean)}
                disabled={isLoading}
                className="mt-1"
              />
              <Label htmlFor="agreeToMarketing" className="text-sm leading-5">
                Tôi muốn nhận thông tin về sản phẩm và khuyến mãi qua email
              </Label>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Đang tạo tài khoản...
              </>
            ) : (
              'Tạo tài khoản'
            )}
          </Button>
        </form>

        <div className="text-center">
          <div className="text-sm text-muted-foreground">
            Đã có tài khoản?{' '}
            <Button
              variant="link"
              className="p-0 h-auto text-primary"
              onClick={onSwitchToLogin}
              disabled={isLoading}
            >
              Đăng nhập ngay
            </Button>
          </div>
        </div>

        {/* Security Badges */}
        <div className="pt-4 border-t">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="space-y-1">
              <Shield className="w-6 h-6 text-green-500 mx-auto" />
              <p className="text-xs text-muted-foreground">Bảo mật SSL 256-bit</p>
            </div>
            <div className="space-y-1">
              <CheckCircle className="w-6 h-6 text-blue-500 mx-auto" />
              <p className="text-xs text-muted-foreground">Tuân thủ KYC/AML</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

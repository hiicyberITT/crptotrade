'use client'

import { useState, useEffect } from 'react'
import { EnhancedLoginForm } from '@/components/auth/enhanced-login-form'
import { EnhancedRegisterForm } from '@/components/auth/enhanced-register-form'
import { OAuthButtons } from '@/components/auth/oauth-buttons'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bitcoin, Shield, Users, TrendingUp, Star, CheckCircle, AlertTriangle, X } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { useSearchParams } from 'next/navigation'

export default function EnhancedAuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState('')
  const searchParams = useSearchParams()

  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam) {
      const errorMessages: { [key: string]: string } = {
        'oauth_cancelled': 'Đăng nhập bị hủy bởi người dùng',
        'oauth_error': 'Đã xảy ra lỗi trong quá trình đăng nhập',
        'oauth_state_mismatch': 'Lỗi bảo mật. Vui lòng thử lại',
        'oauth_invalid_request': 'Yêu cầu không hợp lệ',
        'oauth_callback_failed': 'Không thể hoàn tất đăng nhập',
        'email_not_provided': 'Email không được cung cấp từ mạng xã hội',
        'user_not_found': 'Tài khoản không tồn tại. Vui lòng đăng ký',
        'user_already_exists': 'Tài khoản đã tồn tại. Vui lòng đăng nhập'
      }
      
      setError(errorMessages[errorParam] || 'Đã xảy ra lỗi không xác định')
      
      // Clean URL after showing error
      const url = new URL(window.location.href)
      url.searchParams.delete('error')
      window.history.replaceState({}, '', url.toString())
    }
  }, [searchParams])

  const clearError = () => setError('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center min-h-screen">
          {/* Left Side - Branding & Features */}
          <div className="space-y-8">
            {/* Logo & Title */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl">
                  <Bitcoin className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    BTC Exchange Pro
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Sàn giao dịch Bitcoin hàng đầu Việt Nam
                  </p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="grid gap-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Bảo mật cấp ngân hàng
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Mã hóa SSL 256-bit, xác thực 2FA và lưu trữ lạnh cho tài sản của bạn
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Giao dịch chuyên nghiệp
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Biểu đồ nâng cao, API trading và thanh khoản cao nhất thị trường
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Hỗ trợ 24/7
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Đội ngũ hỗ trợ tiếng Việt chuyên nghiệp, sẵn sàng giúp đỡ mọi lúc
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 p-6 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">500K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Người dùng</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">$2.5B+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Khối lượng</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">99.9%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Uptime</div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center lg:justify-start gap-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Tuân thủ KYC/AML</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">4.8/5 Rating</span>
              </div>
            </div>
          </div>

          {/* Right Side - Auth Forms */}
          <div className="flex justify-center">
            <div className="w-full max-w-md space-y-6">
              {/* Error Display */}
              {error && (
                <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearError}
                        className="h-auto p-1 text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Auth Forms */}
              {isLogin ? (
                <EnhancedLoginForm onSwitchToRegister={() => setIsLogin(false)} />
              ) : (
                <EnhancedRegisterForm onSwitchToLogin={() => setIsLogin(true)} />
              )}

              {/* OAuth Section */}
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          Hoặc tiếp tục với
                        </span>
                      </div>
                    </div>
                    
                    <OAuthButtons />
                  </div>
                </CardContent>
              </Card>

              {/* Footer Links */}
              <div className="text-center space-y-2">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Bằng cách đăng nhập, bạn đồng ý với{' '}
                  <a href="/terms" className="text-primary hover:underline">
                    Điều khoản dịch vụ
                  </a>{' '}
                  và{' '}
                  <a href="/privacy" className="text-primary hover:underline">
                    Chính sách bảo mật
                  </a>
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  © 2024 BTC Exchange Pro. Tất cả quyền được bảo lưu.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

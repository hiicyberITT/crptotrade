'use client'

import { useState } from 'react'
import { LoginForm } from './login-form'
import { RegisterForm } from './register-form'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bitcoin, Shield, TrendingUp, Users, Globe, Zap } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

interface LoginInterfaceProps {
  onSuccess: () => void
}

export function LoginInterface({ onSuccess }: LoginInterfaceProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Bitcoin className="w-12 h-12 text-orange-500 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
              BTC Exchange Pro
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Sàn giao dịch Bitcoin chuyên nghiệp với công nghệ bảo mật hàng đầu
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start max-w-6xl mx-auto">
          {/* Auth Forms */}
          <div className="order-2 lg:order-1">
            {mode === 'login' ? (
              <LoginForm 
                onSuccess={onSuccess}
                onSwitchToRegister={() => setMode('register')}
              />
            ) : (
              <RegisterForm 
                onSuccess={onSuccess}
                onSwitchToLogin={() => setMode('login')}
              />
            )}
          </div>

          {/* Features */}
          <div className="order-1 lg:order-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2 text-green-500" />
                  Tính năng nổi bật
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Bảo mật tối đa</h4>
                      <p className="text-sm text-muted-foreground">
                        Xác thực 2 bước, mã hóa end-to-end, cold storage
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Zap className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Giao dịch nhanh</h4>
                      <p className="text-sm text-muted-foreground">
                        Xử lý giao dịch trong vài giây với phí thấp
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="w-5 h-5 text-purple-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Biểu đồ chuyên nghiệp</h4>
                      <p className="text-sm text-muted-foreground">
                        Công cụ phân tích kỹ thuật đầy đủ từ TradingView
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Globe className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Hỗ trợ 24/7</h4>
                      <p className="text-sm text-muted-foreground">
                        Đội ngũ hỗ trợ chuyên nghiệp luôn sẵn sàng
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Users className="w-6 h-6 mr-2 text-blue-500" />
                  Thống kê nền tảng
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">50K+</div>
                    <div className="text-sm text-muted-foreground">Người dùng hoạt động</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">$2.5B</div>
                    <div className="text-sm text-muted-foreground">Khối lượng giao dịch</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">99.9%</div>
                    <div className="text-sm text-muted-foreground">Thời gian hoạt động</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">24/7</div>
                    <div className="text-sm text-muted-foreground">Hỗ trợ khách hàng</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card className="border-blue-200 dark:border-blue-800">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <Shield className="w-6 h-6 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
                      Cam kết bảo mật
                    </h4>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      Chúng tôi sử dụng công nghệ bảo mật hàng đầu để bảo vệ tài sản của bạn. 
                      95% tài sản được lưu trữ offline trong cold storage.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

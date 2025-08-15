'use client'

import { ThemeToggle } from '@/components/theme-toggle'
import { Bitcoin, Shield, Zap, Users, TrendingUp } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"

interface AuthLayoutProps {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const features = [
    {
      icon: Shield,
      title: "Bảo mật tối đa",
      description: "2FA, mã hóa end-to-end và cold storage"
    },
    {
      icon: Zap,
      title: "Giao dịch nhanh",
      description: "Xử lý giao dịch trong vài giây"
    },
    {
      icon: Users,
      title: "Hỗ trợ 24/7",
      description: "Đội ngũ hỗ trợ chuyên nghiệp"
    },
    {
      icon: TrendingUp,
      title: "Phí thấp",
      description: "Phí giao dịch cạnh tranh nhất thị trường"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-blue-500/5" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-orange-500/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute top-40 right-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-green-500/10 rounded-full blur-xl animate-pulse delay-2000" />
      
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bitcoin className="w-10 h-10 text-orange-500" />
              <div className="absolute inset-0 w-10 h-10 bg-orange-500/20 rounded-full blur-md" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                BTC Exchange Pro
              </h1>
              <p className="text-sm text-muted-foreground">Professional Trading Platform</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      <div className="flex min-h-screen">
        {/* Left Side - Features */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 relative z-10">
          <div className="max-w-lg">
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Sàn giao dịch Bitcoin
                <span className="block text-transparent bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text">
                  hàng đầu Việt Nam
                </span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Giao dịch Bitcoin an toàn, nhanh chóng với công nghệ blockchain tiên tiến
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/80 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <feature.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-lg border border-orange-500/20">
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold text-orange-500">1M+</div>
                <div>
                  <p className="font-semibold text-foreground">Người dùng tin tưởng</p>
                  <p className="text-sm text-muted-foreground">Hơn 1 triệu trader đã chọn chúng tôi</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="p-6 text-center text-sm text-muted-foreground">
          <p>© 2024 BTC Exchange Pro. Tất cả quyền được bảo lưu.</p>
          <div className="flex justify-center gap-6 mt-2">
            <a href="/terms" className="hover:text-foreground transition-colors">
              Điều khoản
            </a>
            <a href="/privacy" className="hover:text-foreground transition-colors">
              Bảo mật
            </a>
            <a href="/support" className="hover:text-foreground transition-colors">
              Hỗ trợ
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

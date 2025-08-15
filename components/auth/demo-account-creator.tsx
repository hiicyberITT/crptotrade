'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Bitcoin, Copy, CheckCircle, AlertCircle, Wallet, TrendingUp, DollarSign, Users, Clock, ArrowRight, Sparkles, Gift, Target, BarChart3 } from 'lucide-react'
import Link from 'next/link'

interface DemoAccount {
  email: string
  password: string
  balance: {
    BTC: number
    ETH: number
    USD: number
    USDT: number
  }
  stats: {
    totalTrades: number
    winRate: number
    totalProfit: number
    totalVolume: number
    activeDays: number
  }
  walletAddress: string
  trades: number
  transactions: number
  pendingOrders: number
}

export function DemoAccountCreator() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [demoAccount, setDemoAccount] = useState<DemoAccount | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const createDemoAccount = async () => {
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/auth/create-demo-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      const result = await response.json()

      if (response.ok) {
        setDemoAccount(result.account)
        setSuccess('Tài khoản demo đã được tạo thành công!')
      } else {
        setError(result.error || 'Không thể tạo tài khoản demo')
      }
    } catch (error) {
      console.error('Demo account creation error:', error)
      setError('Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'USD' || currency === 'USDT') {
      return `$${amount.toLocaleString()}`
    }
    return `${amount} ${currency}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Bitcoin className="w-12 h-12 text-orange-500" />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">
                BTC Exchange Pro
              </h1>
              <p className="text-muted-foreground">Tạo tài khoản Demo miễn phí</p>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Trải nghiệm giao dịch <span className="text-orange-500">không rủi ro</span>
          </h2>
          <p className="text-muted-foreground">
            Tài khoản demo với dữ liệu thực tế, không cần xác thực email
          </p>
        </div>

        {!demoAccount ? (
          <Card className="backdrop-blur-sm bg-card/95 border-border/50 shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 text-orange-500" />
                Tạo tài khoản Demo
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700 dark:text-green-300">
                    {success}
                  </AlertDescription>
                </Alert>
              )}

              {/* Features Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Wallet className="w-6 h-6 text-orange-600" />
                    <h3 className="font-semibold">Số dư Demo phong phú</h3>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div>• 0.05 BTC (~$2,000)</div>
                    <div>• 1.5 ETH (~$3,000)</div>
                    <div>• $1,000 USD</div>
                    <div>• $500 USDT</div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                    <h3 className="font-semibold">Dữ liệu giao dịch thực tế</h3>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div>• 47+ giao dịch hoàn thành</div>
                    <div>• Tỷ lệ thắng 68.5%</div>
                    <div>• Lợi nhuận $2,450</div>
                    <div>• Lệnh đang chờ</div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Target className="w-6 h-6 text-green-600" />
                    <h3 className="font-semibold">Tính năng đầy đủ</h3>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div>• Biểu đồ chuyên nghiệp</div>
                    <div>• Lệnh Buy/Sell</div>
                    <div>• Lịch sử giao dịch</div>
                    <div>• Quản lý ví</div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Gift className="w-6 h-6 text-purple-600" />
                    <h3 className="font-semibold">Không giới hạn</h3>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div>• Không cần xác thực email</div>
                    <div>• Sử dụng vô thời hạn</div>
                    <div>• Đầy đủ tính năng</div>
                    <div>• Dữ liệu thời gian thực</div>
                  </div>
                </div>
              </div>

              <Button 
                onClick={createDemoAccount}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Đang tạo tài khoản...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Tạo tài khoản Demo miễn phí
                  </>
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                <p>Tài khoản demo được tạo tự động với dữ liệu phong phú</p>
                <p>Không cần email xác thực • Sử dụng ngay lập tức</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Account Info Card */}
            <Card className="backdrop-blur-sm bg-card/95 border-border/50 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle className="w-6 h-6" />
                  Tài khoản Demo đã sẵn sàng!
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Login Credentials */}
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Thông tin đăng nhập
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Email</Label>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 p-2 bg-background rounded border text-sm">
                          {demoAccount.email}
                        </code>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(demoAccount.email, 'email')}
                        >
                          {copiedField === 'email' ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Mật khẩu</Label>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 p-2 bg-background rounded border text-sm">
                          {demoAccount.password}
                        </code>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(demoAccount.password, 'password')}
                        >
                          {copiedField === 'password' ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Balance Overview */}
                <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Wallet className="w-5 h-5" />
                    Số dư tài khoản Demo
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                      <div className="text-lg font-bold text-orange-600">
                        {formatCurrency(demoAccount.balance.BTC, 'BTC')}
                      </div>
                      <div className="text-sm text-muted-foreground">Bitcoin</div>
                    </div>
                    
                    <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">
                        {formatCurrency(demoAccount.balance.ETH, 'ETH')}
                      </div>
                      <div className="text-sm text-muted-foreground">Ethereum</div>
                    </div>
                    
                    <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">
                        {formatCurrency(demoAccount.balance.USD, 'USD')}
                      </div>
                      <div className="text-sm text-muted-foreground">US Dollar</div>
                    </div>
                    
                    <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                      <div className="text-lg font-bold text-purple-600">
                        {formatCurrency(demoAccount.balance.USDT, 'USDT')}
                      </div>
                      <div className="text-sm text-muted-foreground">Tether</div>
                    </div>
                  </div>
                </div>

                {/* Trading Stats */}
                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Thống kê giao dịch
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{demoAccount.stats.totalTrades}</div>
                      <div className="text-sm text-muted-foreground">Giao dịch</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{demoAccount.stats.winRate}%</div>
                      <div className="text-sm text-muted-foreground">Tỷ lệ thắng</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">${demoAccount.stats.totalProfit.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Lợi nhuận</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">${demoAccount.stats.totalVolume.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Khối lượng</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-pink-600">{demoAccount.stats.activeDays}</div>
                      <div className="text-sm text-muted-foreground">Ngày hoạt động</div>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-lg font-bold">{demoAccount.trades}</div>
                    <div className="text-sm text-muted-foreground">Lịch sử giao dịch</div>
                  </div>
                  
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-lg font-bold">{demoAccount.transactions}</div>
                    <div className="text-sm text-muted-foreground">Giao dịch ví</div>
                  </div>
                  
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-lg font-bold">{demoAccount.pendingOrders}</div>
                    <div className="text-sm text-muted-foreground">Lệnh đang chờ</div>
                  </div>
                </div>

                {/* Wallet Address */}
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Bitcoin className="w-5 h-5" />
                    Địa chỉ ví Bitcoin
                  </h3>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 p-2 bg-background rounded border text-sm break-all">
                      {demoAccount.walletAddress}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(demoAccount.walletAddress, 'wallet')}
                    >
                      {copiedField === 'wallet' ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/login" className="flex-1">
                    <Button className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700">
                      <ArrowRight className="w-5 h-5 mr-2" />
                      Đăng nhập ngay với tài khoản Demo
                    </Button>
                  </Link>
                  
                  <Button
                    variant="outline"
                    onClick={() => {
                      setDemoAccount(null)
                      setSuccess('')
                    }}
                    className="h-12 px-6"
                  >
                    Tạo tài khoản khác
                  </Button>
                </div>

                {/* Instructions */}
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center gap-2 text-blue-800 dark:text-blue-200">
                    <Clock className="w-5 h-5" />
                    Hướng dẫn sử dụng
                  </h3>
                  <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                    <div>1. Copy email và mật khẩu ở trên</div>
                    <div>2. Click "Đăng nhập ngay với tài khoản Demo"</div>
                    <div>3. Dán thông tin đăng nhập và click "Đăng nhập"</div>
                    <div>4. Bắt đầu trải nghiệm giao dịch với dữ liệu thực tế!</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

function Label({ className, children, ...props }: any) {
  return (
    <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className || ''}`} {...props}>
      {children}
    </label>
  )
}

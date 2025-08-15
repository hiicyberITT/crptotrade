'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Shield, TrendingUp, BarChart3, Users, Settings, Activity, Database, Eye, LogIn, Monitor, Smartphone } from 'lucide-react'

export function InterfaceGuide() {
  const handleDemoLogin = (userType: 'user' | 'admin') => {
    if (userType === 'admin') {
      window.location.href = '/admin'
    } else {
      window.location.href = '/'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            CryptoTrade Platform Guide
          </h1>
          <p className="text-xl text-blue-200">
            Hướng dẫn sử dụng giao diện người dùng và admin
          </p>
        </div>

        <Tabs defaultValue="user" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="user" className="text-lg py-3">
              <User className="w-5 h-5 mr-2" />
              Giao Diện Người Dùng
            </TabsTrigger>
            <TabsTrigger value="admin" className="text-lg py-3">
              <Shield className="w-5 h-5 mr-2" />
              Giao Diện Admin
            </TabsTrigger>
          </TabsList>

          {/* User Interface Tab */}
          <TabsContent value="user" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="w-6 h-6 text-blue-400" />
                  Giao Diện Người Dùng - Trading Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Demo Access */}
                <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-700">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    🚀 Truy Cập Demo
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-blue-200">Tài khoản demo người dùng:</p>
                      <div className="bg-slate-900 p-3 rounded font-mono text-sm">
                        <div className="text-green-400">Email: user@example.com</div>
                        <div className="text-green-400">Password: password</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Button 
                        onClick={() => handleDemoLogin('user')}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        <LogIn className="w-4 h-4 mr-2" />
                        Truy Cập Dashboard
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="bg-slate-900/50 border-slate-600">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <TrendingUp className="w-8 h-8 text-green-400" />
                        <div>
                          <h4 className="font-semibold text-white">Biểu Đồ Giao Dịch</h4>
                          <Badge className="bg-green-600 text-white text-xs">Live Data</Badge>
                        </div>
                      </div>
                      <ul className="text-sm text-slate-300 space-y-1">
                        <li>• Biểu đồ BTC/USDT thời gian thực</li>
                        <li>• Nhiều khung thời gian (1m-1w)</li>
                        <li>• Tích hợp Binance API</li>
                        <li>• Chỉ báo kỹ thuật</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/50 border-slate-600">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <BarChart3 className="w-8 h-8 text-blue-400" />
                        <div>
                          <h4 className="font-semibold text-white">Thị Trường</h4>
                          <Badge className="bg-blue-600 text-white text-xs">Real-time</Badge>
                        </div>
                      </div>
                      <ul className="text-sm text-slate-300 space-y-1">
                        <li>• Danh sách các cặp tiền tệ</li>
                        <li>• Tìm kiếm nhanh</li>
                        <li>• Giá và thay đổi 24h</li>
                        <li>• Volume và market cap</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/50 border-slate-600">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Activity className="w-8 h-8 text-purple-400" />
                        <div>
                          <h4 className="font-semibold text-white">Thống Kê</h4>
                          <Badge className="bg-purple-600 text-white text-xs">Live</Badge>
                        </div>
                      </div>
                      <ul className="text-sm text-slate-300 space-y-1">
                        <li>• Giá hiện tại BTC</li>
                        <li>• High/Low 24h</li>
                        <li>• Volume giao dịch</li>
                        <li>• Cập nhật liên tục</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/50 border-slate-600">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Monitor className="w-8 h-8 text-cyan-400" />
                        <div>
                          <h4 className="font-semibold text-white">Giao Diện</h4>
                          <Badge className="bg-cyan-600 text-white text-xs">Responsive</Badge>
                        </div>
                      </div>
                      <ul className="text-sm text-slate-300 space-y-1">
                        <li>• Dark theme chuyên nghiệp</li>
                        <li>• Responsive design</li>
                        <li>• Tối ưu cho trading</li>
                        <li>• Dễ sử dụng</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/50 border-slate-600">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Smartphone className="w-8 h-8 text-orange-400" />
                        <div>
                          <h4 className="font-semibold text-white">Mobile</h4>
                          <Badge className="bg-orange-600 text-white text-xs">Optimized</Badge>
                        </div>
                      </div>
                      <ul className="text-sm text-slate-300 space-y-1">
                        <li>• Tối ưu cho mobile</li>
                        <li>• Touch-friendly</li>
                        <li>• Giao diện thu gọn</li>
                        <li>• Truy cập mọi lúc</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/50 border-slate-600">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Eye className="w-8 h-8 text-yellow-400" />
                        <div>
                          <h4 className="font-semibold text-white">Demo Mode</h4>
                          <Badge className="bg-yellow-600 text-white text-xs">Safe</Badge>
                        </div>
                      </div>
                      <ul className="text-sm text-slate-300 space-y-1">
                        <li>• Dữ liệu thật từ Binance</li>
                        <li>• Không rủi ro tài chính</li>
                        <li>• Học cách giao dịch</li>
                        <li>• Test chiến lược</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Admin Interface Tab */}
          <TabsContent value="admin" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-6 h-6 text-red-400" />
                  Giao Diện Admin - Management Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Demo Access */}
                <div className="bg-red-900/30 p-4 rounded-lg border border-red-700">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    🔐 Truy Cập Admin
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-red-200">Tài khoản admin demo:</p>
                      <div className="bg-slate-900 p-3 rounded font-mono text-sm">
                        <div className="text-red-400">Email: admin@btcexchange.com</div>
                        <div className="text-red-400">Password: password</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Button 
                        onClick={() => handleDemoLogin('admin')}
                        className="w-full bg-red-600 hover:bg-red-700"
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Truy Cập Admin Panel
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Admin Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="bg-slate-900/50 border-slate-600">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <BarChart3 className="w-8 h-8 text-blue-400" />
                        <div>
                          <h4 className="font-semibold text-white">Thống Kê Tổng Quan</h4>
                          <Badge className="bg-blue-600 text-white text-xs">Dashboard</Badge>
                        </div>
                      </div>
                      <ul className="text-sm text-slate-300 space-y-1">
                        <li>• Tổng số người dùng: 1,247</li>
                        <li>• Volume giao dịch: $45.6M</li>
                        <li>• Đơn hàng: 8,934</li>
                        <li>• Người dùng online: 234</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/50 border-slate-600">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Users className="w-8 h-8 text-green-400" />
                        <div>
                          <h4 className="font-semibold text-white">Quản Lý Người Dùng</h4>
                          <Badge className="bg-green-600 text-white text-xs">Management</Badge>
                        </div>
                      </div>
                      <ul className="text-sm text-slate-300 space-y-1">
                        <li>• Danh sách tài khoản</li>
                        <li>• Thêm/sửa/xóa user</li>
                        <li>• Xuất dữ liệu</li>
                        <li>• Gửi thông báo</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/50 border-slate-600">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <TrendingUp className="w-8 h-8 text-purple-400" />
                        <div>
                          <h4 className="font-semibold text-white">Đơn Hàng</h4>
                          <Badge className="bg-purple-600 text-white text-xs">Orders</Badge>
                        </div>
                      </div>
                      <ul className="text-sm text-slate-300 space-y-1">
                        <li>• Theo dõi giao dịch</li>
                        <li>• Trạng thái đơn hàng</li>
                        <li>• Lịch sử giao dịch</li>
                        <li>• Phân tích xu hướng</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/50 border-slate-600">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Database className="w-8 h-8 text-cyan-400" />
                        <div>
                          <h4 className="font-semibold text-white">Hệ Thống</h4>
                          <Badge className="bg-cyan-600 text-white text-xs">Health</Badge>
                        </div>
                      </div>
                      <ul className="text-sm text-slate-300 space-y-1">
                        <li>• CPU Usage: 45%</li>
                        <li>• Memory: 67%</li>
                        <li>• Database: 23%</li>
                        <li>• API Response: 120ms</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/50 border-slate-600">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Activity className="w-8 h-8 text-orange-400" />
                        <div>
                          <h4 className="font-semibold text-white">Nhật Ký</h4>
                          <Badge className="bg-orange-600 text-white text-xs">Logs</Badge>
                        </div>
                      </div>
                      <ul className="text-sm text-slate-300 space-y-1">
                        <li>• System logs</li>
                        <li>• Error tracking</li>
                        <li>• User activities</li>
                        <li>• Security events</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/50 border-slate-600">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Settings className="w-8 h-8 text-yellow-400" />
                        <div>
                          <h4 className="font-semibold text-white">Cấu Hình</h4>
                          <Badge className="bg-yellow-600 text-white text-xs">Settings</Badge>
                        </div>
                      </div>
                      <ul className="text-sm text-slate-300 space-y-1">
                        <li>• Cài đặt hệ thống</li>
                        <li>• Phân quyền</li>
                        <li>• Backup/Restore</li>
                        <li>• Bảo mật</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Security Notice */}
                <div className="bg-yellow-900/30 p-4 rounded-lg border border-yellow-700">
                  <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-yellow-400" />
                    Lưu Ý Bảo Mật
                  </h3>
                  <ul className="text-sm text-yellow-200 space-y-1">
                    <li>• Chỉ admin mới có thể truy cập dashboard này</li>
                    <li>• Tất cả hoạt động admin đều được ghi log</li>
                    <li>• Hệ thống tự động logout sau 30 phút không hoạt động</li>
                    <li>• Sử dụng 2FA cho tài khoản admin trong production</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Access Buttons */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Card className="bg-gradient-to-r from-blue-900/50 to-blue-800/50 border-blue-700">
            <CardContent className="p-6 text-center">
              <User className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Giao Diện Người Dùng</h3>
              <p className="text-blue-200 mb-4">
                Trải nghiệm giao dịch Bitcoin chuyên nghiệp với dữ liệu thời gian thực
              </p>
              <Button 
                onClick={() => handleDemoLogin('user')}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Vào Trading Dashboard
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-900/50 to-red-800/50 border-red-700">
            <CardContent className="p-6 text-center">
              <Shield className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Giao Diện Admin</h3>
              <p className="text-red-200 mb-4">
                Quản lý hệ thống, người dùng và giám sát hoạt động giao dịch
              </p>
              <Button 
                onClick={() => handleDemoLogin('admin')}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                <Shield className="w-4 h-4 mr-2" />
                Vào Admin Panel
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

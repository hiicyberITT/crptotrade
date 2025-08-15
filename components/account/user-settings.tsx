'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Globe, Moon, Sun, Monitor, Bell, Mail, Smartphone, Volume2, Shield, Eye, Clock, DollarSign } from 'lucide-react'
import { toast } from "@/hooks/use-toast"

interface UserSettings {
  language: string
  timezone: string
  currency: string
  theme: string
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
    trading: boolean
    security: boolean
    news: boolean
  }
  privacy: {
    showBalance: boolean
    showTradingHistory: boolean
    showOnlineStatus: boolean
  }
  trading: {
    soundEnabled: boolean
    confirmOrders: boolean
    autoLogout: number
  }
}

const languages = [
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' }
]

const timezones = [
  { code: 'Asia/Ho_Chi_Minh', name: 'Việt Nam (UTC+7)', offset: '+7' },
  { code: 'Asia/Bangkok', name: 'Bangkok (UTC+7)', offset: '+7' },
  { code: 'Asia/Singapore', name: 'Singapore (UTC+8)', offset: '+8' },
  { code: 'Asia/Tokyo', name: 'Tokyo (UTC+9)', offset: '+9' },
  { code: 'Asia/Seoul', name: 'Seoul (UTC+9)', offset: '+9' },
  { code: 'Asia/Shanghai', name: 'Shanghai (UTC+8)', offset: '+8' },
  { code: 'Asia/Jakarta', name: 'Jakarta (UTC+7)', offset: '+7' },
  { code: 'UTC', name: 'UTC (UTC+0)', offset: '+0' },
  { code: 'America/New_York', name: 'New York (UTC-5)', offset: '-5' },
  { code: 'Europe/London', name: 'London (UTC+0)', offset: '+0' }
]

const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'KRW', name: 'Korean Won', symbol: '₩' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' }
]

const themes = [
  { code: 'light', name: 'Sáng', icon: Sun },
  { code: 'dark', name: 'Tối', icon: Moon },
  { code: 'system', name: 'Theo hệ thống', icon: Monitor }
]

export function UserSettings() {
  const [settings, setSettings] = useState<UserSettings>({
    language: 'vi',
    timezone: 'Asia/Ho_Chi_Minh',
    currency: 'USD',
    theme: 'dark',
    notifications: {
      email: true,
      sms: false,
      push: true,
      trading: true,
      security: true,
      news: false
    },
    privacy: {
      showBalance: true,
      showTradingHistory: false,
      showOnlineStatus: true
    },
    trading: {
      soundEnabled: true,
      confirmOrders: true,
      autoLogout: 30
    }
  })

  const handleSettingChange = (category: keyof UserSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: typeof prev[category] === 'object' 
        ? { ...prev[category], [key]: value }
        : value
    }))
    
    toast({
      title: "Đã lưu cài đặt",
      description: "Cài đặt của bạn đã được cập nhật",
    })
  }

  const getThemeIcon = (themeCode: string) => {
    const theme = themes.find(t => t.code === themeCode)
    return theme ? theme.icon : Monitor
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Cài đặt</h2>
        <p className="text-gray-400">Tùy chỉnh giao diện và trải nghiệm của bạn</p>
      </div>

      {/* Language & Region */}
      <Card className="bg-[#0F172A] border-[#1E293B]">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Globe className="w-5 h-5" />
            <span>Ngôn ngữ & Khu vực</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-white">Ngôn ngữ</Label>
              <Select 
                value={settings.language} 
                onValueChange={(value) => handleSettingChange('language', '', value)}
              >
                <SelectTrigger className="bg-[#1E293B] border-[#334155] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1E293B] border-[#334155]">
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code} className="text-white hover:bg-[#334155]">
                      {lang.flag} {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-white">Múi giờ</Label>
              <Select 
                value={settings.timezone} 
                onValueChange={(value) => handleSettingChange('timezone', '', value)}
              >
                <SelectTrigger className="bg-[#1E293B] border-[#334155] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1E293B] border-[#334155]">
                  {timezones.map((tz) => (
                    <SelectItem key={tz.code} value={tz.code} className="text-white hover:bg-[#334155]">
                      {tz.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-white">Đơn vị tiền tệ</Label>
              <Select 
                value={settings.currency} 
                onValueChange={(value) => handleSettingChange('currency', '', value)}
              >
                <SelectTrigger className="bg-[#1E293B] border-[#334155] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1E293B] border-[#334155]">
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code} className="text-white hover:bg-[#334155]">
                      {currency.symbol} {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className="bg-[#0F172A] border-[#1E293B]">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            {React.createElement(getThemeIcon(settings.theme), { className: "w-5 h-5" })}
            <span>Giao diện</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label className="text-white">Chế độ hiển thị</Label>
            <div className="grid grid-cols-3 gap-3 mt-2">
              {themes.map((theme) => (
                <Button
                  key={theme.code}
                  variant={settings.theme === theme.code ? "default" : "outline"}
                  onClick={() => handleSettingChange('theme', '', theme.code)}
                  className={`flex items-center space-x-2 ${
                    settings.theme === theme.code 
                      ? 'bg-blue-600 text-white' 
                      : 'border-[#334155] text-gray-300 hover:text-white'
                  }`}
                >
                  <theme.icon className="w-4 h-4" />
                  <span>{theme.name}</span>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="bg-[#0F172A] border-[#1E293B]">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Bell className="w-5 h-5" />
            <span>Thông báo</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-white">Phương thức thông báo</h4>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-white">Email</span>
                </div>
                <Switch
                  checked={settings.notifications.email}
                  onCheckedChange={(checked) => handleSettingChange('notifications', 'email', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-4 h-4 text-gray-400" />
                  <span className="text-white">SMS</span>
                </div>
                <Switch
                  checked={settings.notifications.sms}
                  onCheckedChange={(checked) => handleSettingChange('notifications', 'sms', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-gray-400" />
                  <span className="text-white">Push notification</span>
                </div>
                <Switch
                  checked={settings.notifications.push}
                  onCheckedChange={(checked) => handleSettingChange('notifications', 'push', checked)}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-white">Loại thông báo</h4>
              
              <div className="flex items-center justify-between">
                <span className="text-white">Giao dịch</span>
                <Switch
                  checked={settings.notifications.trading}
                  onCheckedChange={(checked) => handleSettingChange('notifications', 'trading', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-white">Bảo mật</span>
                <Switch
                  checked={settings.notifications.security}
                  onCheckedChange={(checked) => handleSettingChange('notifications', 'security', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-white">Tin tức thị trường</span>
                <Switch
                  checked={settings.notifications.news}
                  onCheckedChange={(checked) => handleSettingChange('notifications', 'news', checked)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card className="bg-[#0F172A] border-[#1E293B]">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Eye className="w-5 h-5" />
            <span>Quyền riêng tư</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-white">Hiển thị số dư</span>
              <p className="text-sm text-gray-400">Cho phép hiển thị số dư tài khoản</p>
            </div>
            <Switch
              checked={settings.privacy.showBalance}
              onCheckedChange={(checked) => handleSettingChange('privacy', 'showBalance', checked)}
            />
          </div>
          
          <Separator className="bg-[#1E293B]" />
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-white">Hiển thị lịch sử giao dịch</span>
              <p className="text-sm text-gray-400">Cho phép người khác xem lịch sử giao dịch</p>
            </div>
            <Switch
              checked={settings.privacy.showTradingHistory}
              onCheckedChange={(checked) => handleSettingChange('privacy', 'showTradingHistory', checked)}
            />
          </div>
          
          <Separator className="bg-[#1E293B]" />
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-white">Hiển thị trạng thái online</span>
              <p className="text-sm text-gray-400">Cho phép người khác biết bạn đang online</p>
            </div>
            <Switch
              checked={settings.privacy.showOnlineStatus}
              onCheckedChange={(checked) => handleSettingChange('privacy', 'showOnlineStatus', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Trading Settings */}
      <Card className="bg-[#0F172A] border-[#1E293B]">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <DollarSign className="w-5 h-5" />
            <span>Cài đặt giao dịch</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Volume2 className="w-4 h-4 text-gray-400" />
              <div>
                <span className="text-white">Âm thanh giao dịch</span>
                <p className="text-sm text-gray-400">Phát âm thanh khi có giao dịch</p>
              </div>
            </div>
            <Switch
              checked={settings.trading.soundEnabled}
              onCheckedChange={(checked) => handleSettingChange('trading', 'soundEnabled', checked)}
            />
          </div>
          
          <Separator className="bg-[#1E293B]" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-gray-400" />
              <div>
                <span className="text-white">Xác nhận đơn hàng</span>
                <p className="text-sm text-gray-400">Yêu cầu xác nhận trước khi đặt lệnh</p>
              </div>
            </div>
            <Switch
              checked={settings.trading.confirmOrders}
              onCheckedChange={(checked) => handleSettingChange('trading', 'confirmOrders', checked)}
            />
          </div>
          
          <Separator className="bg-[#1E293B]" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <div>
                <span className="text-white">Tự động đăng xuất</span>
                <p className="text-sm text-gray-400">Đăng xuất sau thời gian không hoạt động</p>
              </div>
            </div>
            <Select 
              value={settings.trading.autoLogout.toString()} 
              onValueChange={(value) => handleSettingChange('trading', 'autoLogout', parseInt(value))}
            >
              <SelectTrigger className="w-32 bg-[#1E293B] border-[#334155] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1E293B] border-[#334155]">
                <SelectItem value="15" className="text-white hover:bg-[#334155]">15 phút</SelectItem>
                <SelectItem value="30" className="text-white hover:bg-[#334155]">30 phút</SelectItem>
                <SelectItem value="60" className="text-white hover:bg-[#334155]">1 giờ</SelectItem>
                <SelectItem value="120" className="text-white hover:bg-[#334155]">2 giờ</SelectItem>
                <SelectItem value="0" className="text-white hover:bg-[#334155]">Không bao giờ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="bg-blue-600 hover:bg-blue-700">
          Lưu tất cả cài đặt
        </Button>
      </div>
    </div>
  )
}

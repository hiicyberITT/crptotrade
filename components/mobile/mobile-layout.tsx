'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MobileTrading } from './mobile-trading'
import { MobileWallet } from './mobile-wallet'
import { MobileProfile } from './mobile-profile'
import { MobileMarketList } from './mobile-market-list'
import { Home, TrendingUp, Wallet, User, BarChart3, Bell, Menu, X, Settings, LogOut } from 'lucide-react'
import { getCurrentUser, logout } from '@/lib/auth'
import type { User as UserType } from '@/lib/auth'

type TabKey = 'home' | 'markets' | 'trading' | 'wallet' | 'profile'

export function MobileLayout({
  defaultTab = 'home',
  defaultSymbol = 'BTCUSDT',
}: {
  defaultTab?: TabKey
  defaultSymbol?: string
}) {
  const [activeTab, setActiveTab] = useState<TabKey>(defaultTab)
  const [selectedSymbol, setSelectedSymbol] = useState<string>(defaultSymbol)
  const [user, setUser] = useState<UserType | null>(null)
  const [showMenu, setShowMenu] = useState(false)
  const [notificationCount, setNotificationCount] = useState(3)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
  }, [])

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab)
    setShowMenu(false)
  }

  const handleLogout = () => {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      logout()
      window.location.reload()
    }
  }

  const renderHome = () => (
    <div className="p-4 space-y-6">
      <div className="bg-gradient-to-r from-cyan-600 to-purple-600 rounded-xl p-4 text-white">
        <h2 className="text-lg font-bold mb-1">
          Chào mừng, {user?.firstName || 'Trader'}!
        </h2>
        <p className="text-cyan-100 text-sm">Bắt đầu giao dịch ngay bây giờ</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#111827] rounded-lg p-4">
          <div className="text-gray-400 text-sm">Tài sản ước tính</div>
          <div className="text-white text-xl font-bold">$12,450.67</div>
          <div className="text-green-400 text-sm">+2.34%</div>
        </div>
        <div className="bg-[#111827] rounded-lg p-4">
          <div className="text-gray-400 text-sm">P&L hôm nay</div>
          <div className="text-white text-xl font-bold">+$234.56</div>
          <div className="text-green-400 text-sm">+1.92%</div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-white font-semibold">Thao tác nhanh</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => {
              setActiveTab('trading')
            }}
            className="bg-green-600 hover:bg-green-700 text-white h-12"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Giao dịch {selectedSymbol.replace('USDT', '')}
          </Button>
          <Button
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white h-12"
            onClick={() => setActiveTab('markets')}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Khám phá thị trường
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-white font-semibold">Top Markets</h3>
        <div className="space-y-2">
          {[
            { symbol: 'BTCUSDT', name: 'Bitcoin', price: '$41,700', change: '+0.28%', positive: true },
            { symbol: 'ETHUSDT', name: 'Ethereum', price: '$2,708', change: '-3.68%', positive: false },
            { symbol: 'BNBUSDT', name: 'BNB', price: '$324', change: '+1.20%', positive: true },
          ].map((coin) => (
            <button
              key={coin.symbol}
              onClick={() => {
                setSelectedSymbol(coin.symbol)
                setActiveTab('trading')
              }}
              className="w-full bg-[#111827] rounded-lg p-3 flex items-center justify-between text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {coin.symbol[0]}
                </div>
                <div>
                  <div className="text-white font-medium text-sm">{coin.symbol}</div>
                  <div className="text-gray-400 text-xs">{coin.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-medium text-sm">{coin.price}</div>
                <div className={`text-xs ${coin.positive ? 'text-green-400' : 'text-red-400'}`}>{coin.change}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'trading':
        return (
          <MobileTrading
            symbol={selectedSymbol}
            onChangeSymbol={(s: string) => setSelectedSymbol(s)}
          />
        )
      case 'wallet':
        return <MobileWallet />
      case 'profile':
        return <MobileProfile />
      case 'markets':
        return (
          <MobileMarketList
            selectedSymbol={selectedSymbol}
            onSelectSymbol={(s: string) => {
              setSelectedSymbol(s)
              setActiveTab('trading')
            }}
          />
        )
      default:
        return renderHome()
    }
  }

  return (
    <div className="min-h-screen bg-[#0B1426] text-white flex flex-col">
      <header className="bg-[#0F172A] border-b border-[#1E293B] px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">CT</span>
          </div>
          <span className="text-lg font-bold text-white">CryptoTrade</span>
          <Badge variant="secondary" className="ml-2 bg-[#1E293B] text-gray-300">
            {selectedSymbol}
          </Badge>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="relative p-2 text-gray-300 hover:text-white">
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 text-xs bg-red-500 text-white rounded-full flex items-center justify-center">
                {notificationCount}
              </Badge>
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMenu((s) => !s)}
            className="p-2 text-gray-300 hover:text-white"
            aria-expanded={showMenu}
            aria-controls="mobile-menu"
          >
            {showMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </header>

      {showMenu && (
        <div id="mobile-menu" className="absolute top-14 left-0 right-0 bg-[#0F172A] border-b border-[#1E293B] z-50">
          <div className="p-4 space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white"
              onClick={() => setActiveTab('profile')}
            >
              <Settings className="w-4 h-4 mr-3" />
              Cài đặt
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-red-400 hover:text-red-300"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-3" />
              Đăng xuất
            </Button>
          </div>
        </div>
      )}

      <main className="flex-1 overflow-y-auto pb-20">{renderContent()}</main>

      <nav className="fixed bottom-0 left-0 right-0 bg-[#0F172A] border-t border-[#1E293B] px-4 py-2">
        <div className="flex items-center justify-around" role="tablist" aria-label="Bottom navigation">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleTabChange('home')}
            className={`flex flex-col items-center space-y-1 p-2 ${activeTab === 'home' ? 'text-cyan-400' : 'text-gray-400'}`}
            aria-selected={activeTab === 'home'}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">Trang chủ</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleTabChange('markets')}
            className={`flex flex-col items-center space-y-1 p-2 ${activeTab === 'markets' ? 'text-cyan-400' : 'text-gray-400'}`}
            aria-selected={activeTab === 'markets'}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-xs">Thị trường</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleTabChange('trading')}
            className={`flex flex-col items-center space-y-1 p-2 ${activeTab === 'trading' ? 'text-cyan-400' : 'text-gray-400'}`}
            aria-selected={activeTab === 'trading'}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-xs">Giao dịch</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleTabChange('wallet')}
            className={`flex flex-col items-center space-y-1 p-2 ${activeTab === 'wallet' ? 'text-cyan-400' : 'text-gray-400'}`}
            aria-selected={activeTab === 'wallet'}
          >
            <Wallet className="w-5 h-5" />
            <span className="text-xs">Ví</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleTabChange('profile')}
            className={`flex flex-col items-center space-y-1 p-2 ${activeTab === 'profile' ? 'text-cyan-400' : 'text-gray-400'}`}
            aria-selected={activeTab === 'profile'}
          >
            <User className="w-5 h-5" />
            <span className="text-xs">Tài khoản</span>
          </Button>
        </div>
      </nav>
    </div>
  )
}

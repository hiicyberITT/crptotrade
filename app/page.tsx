'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"
import { MobileAuth } from "@/components/mobile/mobile-auth"
import { MobileLayout } from "@/components/mobile/mobile-layout"
import { BinanceChart } from "@/components/binance-chart"
import { RealTimeData } from "@/components/real-time-data"
import { LiveChatWidget } from "@/components/support/live-chat-widget"
import { Search, TrendingUp, TrendingDown, BarChart3, Wallet, Star, Activity, RefreshCw, Wifi, Bell, MessageCircle, User, HelpCircle } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { getCurrentUser, isAuthenticated, logout } from '@/lib/auth'
import { useMobileDetect } from '@/hooks/use-mobile-detect'
import type { User } from '@/lib/auth'
import Link from 'next/link'

interface MarketData {
  symbol: string
  name: string
  price: number
  change24h: number
  changePercent24h: number
  volume24h: number
  marketCap: number
  icon: string
}

export default function CryptoTradePage() {
  const { isMobile, isLoading: mobileDetectLoading } = useMobileDetect()
  const [user, setUser] = useState<User | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h')
  const [marketData, setMarketData] = useState<MarketData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [notificationCount, setNotificationCount] = useState(3)
  const [messageCount, setMessageCount] = useState(0)

  useEffect(() => {
    checkAuthStatus()
    fetchMarketData()
    const interval = setInterval(fetchMarketData, 30000)
    return () => clearInterval(interval)
  }, [])

  const checkAuthStatus = () => {
    const authenticated = isAuthenticated()
    const currentUser = getCurrentUser()
    
    setIsLoggedIn(authenticated)
    setUser(currentUser)
    
    if (!authenticated) {
      setShowAuth(true)
    }
  }

  const fetchMarketData = async () => {
    try {
      // Fallback market data
      const fallbackData: MarketData[] = [
        {
          symbol: 'BTCUSDT',
          name: 'Bitcoin',
          price: 40938.69,
          change24h: -316.64,
          changePercent24h: -0.75,
          volume24h: 25190000000,
          marketCap: 612540000000000,
          icon: '₿'
        },
        {
          symbol: 'ETHUSDT',
          name: 'Ethereum',
          price: 2708.58,
          change24h: -103.42,
          changePercent24h: -3.68,
          volume24h: 15678900000,
          marketCap: 325000000000,
          icon: 'Ξ'
        },
        {
          symbol: 'BNBUSDT',
          name: 'BNB',
          price: 324.59,
          change24h: 3.89,
          changePercent24h: 1.2,
          volume24h: 1234567000,
          marketCap: 48000000000,
          icon: '🔶'
        },
        {
          symbol: 'SOLUSDT',
          name: 'Solana',
          price: 100.72,
          change24h: 2.23,
          changePercent24h: 2.26,
          volume24h: 987654000,
          marketCap: 45000000000,
          icon: '◎'
        },
        {
          symbol: 'ADAUSDT',
          name: 'Cardano',
          price: 0.505976,
          change24h: -0.015,
          changePercent24h: -2.9,
          volume24h: 456789000,
          marketCap: 18000000000,
          icon: '₳'
        },
        {
          symbol: 'AVAXUSDT',
          name: 'Avalanche',
          price: 38.6816,
          change24h: -0.39,
          changePercent24h: -1.00,
          volume24h: 234567000,
          marketCap: 15000000000,
          icon: '🔺'
        }
      ]
      setMarketData(fallbackData)
    } catch (error) {
      console.error('Error fetching market data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAuthSuccess = () => {
    checkAuthStatus()
    setShowAuth(false)
  }

  const handleLogout = () => {
    logout()
    setIsLoggedIn(false)
    setUser(null)
    setShowAuth(true)
  }

  // Show loading while detecting mobile
  if (mobileDetectLoading) {
    return (
      <div className="min-h-screen bg-[#0B1426] flex items-center justify-center">
        <div className="text-white">Đang tải...</div>
      </div>
    )
  }

  // Mobile Layout
  if (isMobile) {
    if (showAuth) {
      return <MobileAuth onSuccess={handleAuthSuccess} />
    }
    return <MobileLayout />
  }

  // Desktop Layout
  const filteredMarkets = marketData.filter(market =>
    market.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    market.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatPrice = (price: number) => {
    if (price < 1) {
      return `$${price.toFixed(6)}`
    } else if (price < 100) {
      return `$${price.toFixed(2)}`
    } else {
      return `$${price.toLocaleString()}`
    }
  }

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) {
      return `$${(volume / 1e9).toFixed(2)}B`
    } else if (volume >= 1e6) {
      return `$${(volume / 1e6).toFixed(2)}M`
    } else if (volume >= 1e3) {
      return `$${(volume / 1e3).toFixed(2)}K`
    }
    return `$${volume.toFixed(2)}`
  }

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`
    }
    return `$${marketCap.toFixed(2)}`
  }

  if (showAuth) {
    return (
      <div className="min-h-screen bg-[#0B1426] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {authMode === 'login' ? (
            <LoginForm 
              onSuccess={handleAuthSuccess}
              onSwitchToRegister={() => setAuthMode('register')}
            />
          ) : (
            <RegisterForm 
              onSuccess={handleAuthSuccess}
              onSwitchToLogin={() => setAuthMode('login')}
            />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B1426] text-white">
      {/* Header */}
      <header className="border-b border-[#1E293B] bg-[#0F172A]">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CT</span>
              </div>
              <span className="text-xl font-bold text-white">CryptoTrade</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                Trade
              </Button>
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                Markets
              </Button>
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                Portfolio
              </Button>
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                Earn
              </Button>
            </nav>
          </div>

          {/* Search and User Actions */}
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search markets..."
                className="pl-10 w-64 bg-[#1E293B] border-[#334155] text-white placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Header Icons */}
            <div className="flex items-center space-x-2">
              {/* Support */}
              <Link href="/support">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-10 h-10 p-0 text-gray-300 hover:text-white hover:bg-[#1E293B]"
                  title="Hỗ trợ"
                >
                  <HelpCircle className="w-5 h-5" />
                </Button>
              </Link>

              {/* Notifications */}
              <Button
                variant="ghost"
                size="sm"
                className="relative w-10 h-10 p-0 text-gray-300 hover:text-white hover:bg-[#1E293B]"
                title="Thông báo"
              >
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 text-xs bg-red-500 text-white rounded-full flex items-center justify-center">
                    {notificationCount}
                  </Badge>
                )}
              </Button>

              {/* Messages */}
              <Button
                variant="ghost"
                size="sm"
                className="relative w-10 h-10 p-0 text-gray-300 hover:text-white hover:bg-[#1E293B]"
                title="Tin nhắn"
              >
                <MessageCircle className="w-5 h-5" />
                {messageCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 text-xs bg-blue-500 text-white rounded-full flex items-center justify-center">
                    {messageCount}
                  </Badge>
                )}
              </Button>

              {/* User Profile */}
              <Link href="/account">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-10 h-10 p-0 text-gray-300 hover:text-white hover:bg-[#1E293B]"
                  title="Tài khoản"
                >
                  <User className="w-5 h-5" />
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-[#334155]">
              <span className="text-sm text-gray-300">
                {user?.firstName} {user?.lastName}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-[#334155] text-gray-300 hover:text-white"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main Trading Area */}
        <div className="flex-1 p-6">
          {/* Price Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-bold">BTCUSDT</h1>
                  <Badge className="bg-blue-600 text-white">
                    <Wifi className="w-3 h-3 mr-1" />
                    Live
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Timeframe Selector */}
              <div className="flex items-center space-x-1">
                {['1m', '5m', '15m', '1h', '4h', '1d', '1w'].map((timeframe) => (
                  <Button
                    key={timeframe}
                    variant={selectedTimeframe === timeframe ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedTimeframe(timeframe)}
                    className={`text-xs ${
                      selectedTimeframe === timeframe 
                        ? 'bg-cyan-600 text-white' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {timeframe}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-6 mt-2">
              <div className="text-3xl font-bold text-white">
                $41,700.12
              </div>
              <div className="flex items-center space-x-1 text-green-400">
                <TrendingUp className="w-4 h-4" />
                <span className="font-medium">+$116.64 (0.28%)</span>
              </div>
              <div className="text-sm text-gray-400">
                H: $44,383.17 L: $40,869.48
              </div>
              <div className="text-sm text-gray-400">
                Vol: 1.2K
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Last updated: 19:10:27
            </div>
          </div>

          {/* Chart */}
          <div className="mb-6">
            <BinanceChart />
          </div>
        </div>

        {/* Right Sidebar - Markets */}
        <div className="w-80 border-l border-[#1E293B] bg-[#0F172A]">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Markets</h2>
              <Badge className="bg-green-600 text-white text-xs">
                Live
              </Badge>
            </div>

            {/* Market Tabs */}
            <Tabs defaultValue="spot" className="w-full mb-4">
              <TabsList className="grid w-full grid-cols-3 bg-[#1E293B]">
                <TabsTrigger value="spot" className="text-xs text-gray-300 data-[state=active]:text-white">
                  Spot
                </TabsTrigger>
                <TabsTrigger value="futures" className="text-xs text-gray-300 data-[state=active]:text-white">
                  Futures
                </TabsTrigger>
                <TabsTrigger value="options" className="text-xs text-gray-300 data-[state=active]:text-white">
                  Options
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search..."
                className="pl-10 bg-[#1E293B] border-[#334155] text-white placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Market List */}
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {filteredMarkets.map((market) => (
                <div
                  key={market.symbol}
                  className="flex items-center justify-between p-3 hover:bg-[#1E293B] rounded cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-lg">{market.icon}</div>
                    <div>
                      <div className="font-medium text-sm text-white">
                        {market.symbol}
                      </div>
                      <div className="text-xs text-gray-400">
                        {market.name}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-medium text-sm text-white">
                      {formatPrice(market.price)}
                    </div>
                    <div className={`text-xs ${
                      market.changePercent24h >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {market.changePercent24h >= 0 ? '+' : ''}
                      {market.changePercent24h.toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Market Stats */}
            <div className="mt-6 pt-4 border-t border-[#1E293B]">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-gray-400 text-xs">24h Volume</div>
                  <div className="font-medium text-sm text-white">
                    $25.19K
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs">Market Cap</div>
                  <div className="font-medium text-sm text-white">
                    $61254.84T
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Cards */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-[#0F172A] border-[#1E293B] hover:bg-[#1E293B] transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-green-600/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <div className="font-medium text-white">Buy Crypto</div>
                  <div className="text-sm text-gray-400">Start trading now</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0F172A] border-[#1E293B] hover:bg-[#1E293B] transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-red-600/20 flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <div className="font-medium text-white">Sell Crypto</div>
                  <div className="text-sm text-gray-400">Convert to fiat</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0F172A] border-[#1E293B] hover:bg-[#1E293B] transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-600/20 flex items-center justify-center">
                  <Star className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <div className="font-medium text-white">Earn Rewards</div>
                  <div className="text-sm text-gray-400">Stake & earn</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0F172A] border-[#1E293B] hover:bg-[#1E293B] transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <div className="font-medium text-white">Analytics</div>
                  <div className="text-sm text-gray-400">Track performance</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Live Chat Widget */}
      <LiveChatWidget />
    </div>
  )
}

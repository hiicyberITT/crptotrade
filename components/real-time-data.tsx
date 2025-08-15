'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TrendingUp, TrendingDown, Wifi, WifiOff, Play, Pause, AlertCircle } from 'lucide-react'

interface MarketData {
  symbol: string
  name: string
  price: number
  change24h: number
  changePercent24h: number
  high24h: number
  low24h: number
  volume24h: number
  lastUpdated: number
}

export function RealTimeData() {
  const [marketData, setMarketData] = useState<MarketData[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<number>(0)

  const fetchMarketData = async () => {
    try {
      const response = await fetch('/api/binance/market', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success && data.data) {
        setMarketData(data.data.slice(0, 8)) // Show top 8 coins
        setIsConnected(true)
        setError(null)
        setLastUpdate(Date.now())
      } else {
        throw new Error(data.error || 'Failed to fetch market data')
      }
    } catch (err) {
      console.error('Error fetching market data:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
      setIsConnected(false)
      
      // Use fallback data
      const fallbackData: MarketData[] = [
        {
          symbol: 'BTCUSDT',
          name: 'BTC',
          price: 67234.50,
          change24h: 1567.23,
          changePercent24h: 2.39,
          high24h: 68500.00,
          low24h: 65800.00,
          volume24h: 28456.78,
          lastUpdated: Date.now()
        },
        {
          symbol: 'ETHUSDT',
          name: 'ETH',
          price: 3456.78,
          change24h: 89.45,
          changePercent24h: 2.65,
          high24h: 3520.00,
          low24h: 3380.00,
          volume24h: 156789.45,
          lastUpdated: Date.now()
        }
      ]
      setMarketData(fallbackData)
    }
  }

  useEffect(() => {
    if (!isPaused) {
      fetchMarketData()
      const interval = setInterval(fetchMarketData, 30000) // Update every 30 seconds
      return () => clearInterval(interval)
    }
  }, [isPaused])

  const formatNumber = (num: number) => {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B'
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M'
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K'
    return num.toFixed(2)
  }

  const getTimeSinceUpdate = () => {
    if (!lastUpdate) return ''
    const seconds = Math.floor((Date.now() - lastUpdate) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    return `${minutes}m ago`
  }

  return (
    <Card className="shadow-lg bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-foreground">
            {isConnected ? (
              <Wifi className="w-5 h-5 text-green-500" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-500" />
            )}
            Dữ Liệu Thời Gian Thực
            <Badge variant={isConnected ? "default" : "destructive"} className="ml-2">
              {isConnected ? 'ONLINE' : 'OFFLINE'}
            </Badge>
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {getTimeSinceUpdate()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPaused(!isPaused)}
              className="h-7 px-2"
            >
              {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
            </Button>
          </div>
        </div>
        
        {error && (
          <Alert className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error} - Đang sử dụng dữ liệu dự phòng
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {marketData.map((coin) => (
            <div
              key={coin.symbol}
              className="p-4 rounded-lg border border-border bg-gradient-to-br from-card to-muted/20 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center text-white font-bold text-xs">
                    {coin.name}
                  </div>
                  <span className="font-semibold text-foreground">{coin.name}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {isConnected ? 'Live' : 'Cached'}
                </Badge>
              </div>
              
              <div className="space-y-1">
                <div className="text-lg font-bold text-foreground">
                  ${coin.price.toLocaleString()}
                </div>
                
                <div className={`flex items-center gap-1 text-sm ${
                  coin.changePercent24h >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {coin.changePercent24h >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>
                    {coin.changePercent24h >= 0 ? '+' : ''}{coin.changePercent24h.toFixed(2)}%
                  </span>
                </div>
                
                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>24h High:</span>
                    <span className="text-green-500">${coin.high24h.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>24h Low:</span>
                    <span className="text-red-500">${coin.low24h.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Volume:</span>
                    <span>{formatNumber(coin.volume24h)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {marketData.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <WifiOff className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Không thể tải dữ liệu thị trường</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchMarketData}
              className="mt-2"
            >
              Thử lại
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

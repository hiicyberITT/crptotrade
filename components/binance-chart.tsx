'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Activity, Wifi, WifiOff, RefreshCw } from 'lucide-react'

interface KlineData {
  openTime: number
  open: string
  high: string
  low: string
  close: string
  volume: string
  closeTime: number
}

interface ChartData {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

const timeframes = [
  { label: '1m', value: '1m' },
  { label: '5m', value: '5m' },
  { label: '15m', value: '15m' },
  { label: '1h', value: '1h' },
  { label: '4h', value: '4h' },
  { label: '1d', value: '1d' },
  { label: '1w', value: '1w' }
]

export function BinanceChart() {
  const [symbol, setSymbol] = useState('BTCUSDT')
  const [timeframe, setTimeframe] = useState('1h')
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [currentPrice, setCurrentPrice] = useState<number>(0)
  const [priceChange, setPriceChange] = useState<number>(0)
  const [priceChangePercent, setPriceChangePercent] = useState<number>(0)
  const [high24h, setHigh24h] = useState<number>(0)
  const [low24h, setLow24h] = useState<number>(0)
  const [volume24h, setVolume24h] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isOnline, setIsOnline] = useState(true)
  const [error, setError] = useState<string>('')
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const volumeCanvasRef = useRef<HTMLCanvasElement>(null)

  const fetchData = async () => {
    try {
      setError('')
      setIsLoading(true)
      
      // Fetch klines data
      const klinesResponse = await fetch(`/api/binance/klines/${symbol}?interval=${timeframe}&limit=200`)
      
      if (!klinesResponse.ok) {
        throw new Error(`Klines API error: ${klinesResponse.status}`)
      }
      
      const klinesResult = await klinesResponse.json()
      
      if (klinesResult.success && klinesResult.data && Array.isArray(klinesResult.data)) {
        const formattedData: ChartData[] = klinesResult.data.map((kline: KlineData) => ({
          time: kline.openTime,
          open: parseFloat(kline.open),
          high: parseFloat(kline.high),
          low: parseFloat(kline.low),
          close: parseFloat(kline.close),
          volume: parseFloat(kline.volume)
        }))
        
        setChartData(formattedData)
        
        if (formattedData.length > 0) {
          const latest = formattedData[formattedData.length - 1]
          const previous = formattedData[formattedData.length - 2]
          
          setCurrentPrice(latest.close)
          if (previous) {
            const change = latest.close - previous.close
            const changePercent = (change / previous.close) * 100
            setPriceChange(change)
            setPriceChangePercent(changePercent)
          }
        }
      }
      
      // Fetch price data
      const priceResponse = await fetch(`/api/binance/price/${symbol}`)
      
      if (priceResponse.ok) {
        const priceResult = await priceResponse.json()
        
        if (priceResult.success) {
          setCurrentPrice(priceResult.price)
          setPriceChange(priceResult.priceChange)
          setPriceChangePercent(priceResult.priceChangePercent)
          setHigh24h(priceResult.high24h)
          setLow24h(priceResult.low24h)
          setVolume24h(priceResult.volume24h)
        }
      }
      
      setIsOnline(true)
      setLastUpdate(new Date())
      
    } catch (error) {
      console.error('Error fetching chart data:', error)
      setError(error instanceof Error ? error.message : 'Unknown error occurred')
      setIsOnline(false)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [symbol, timeframe])

  useEffect(() => {
    if (chartData.length > 0) {
      drawChart()
      drawVolumeChart()
    }
  }, [chartData])

  const drawChart = () => {
    const canvas = canvasRef.current
    if (!canvas || chartData.length === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size to match display size
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    const width = rect.width
    const height = rect.height
    
    ctx.clearRect(0, 0, width, height)

    // Set dark theme colors
    const bgColor = '#0f0f23'
    const gridColor = '#1e1e2e'
    const textColor = '#8b8b8b'
    const greenColor = '#00d4aa'
    const redColor = '#ff6b6b'

    // Fill background
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, width, height)

    // Calculate price range
    const prices = chartData.flatMap(d => [d.high, d.low])
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    const priceRange = maxPrice - minPrice
    const padding = priceRange * 0.1

    const chartMinPrice = minPrice - padding
    const chartMaxPrice = maxPrice + padding
    const chartPriceRange = chartMaxPrice - chartMinPrice

    // Chart area
    const chartPadding = { top: 20, right: 80, bottom: 40, left: 60 }
    const chartWidth = width - chartPadding.left - chartPadding.right
    const chartHeight = height - chartPadding.top - chartPadding.bottom

    // Draw grid lines
    ctx.strokeStyle = gridColor
    ctx.lineWidth = 1
    
    // Horizontal grid lines
    for (let i = 0; i <= 10; i++) {
      const y = chartPadding.top + (chartHeight / 10) * i
      ctx.beginPath()
      ctx.moveTo(chartPadding.left, y)
      ctx.lineTo(chartPadding.left + chartWidth, y)
      ctx.stroke()
    }

    // Vertical grid lines
    const timeStep = Math.max(1, Math.floor(chartData.length / 10))
    for (let i = 0; i < chartData.length; i += timeStep) {
      const x = chartPadding.left + (chartWidth / (chartData.length - 1)) * i
      ctx.beginPath()
      ctx.moveTo(x, chartPadding.top)
      ctx.lineTo(x, chartPadding.top + chartHeight)
      ctx.stroke()
    }

    // Draw price labels
    ctx.fillStyle = textColor
    ctx.font = '12px monospace'
    ctx.textAlign = 'left'
    
    for (let i = 0; i <= 10; i++) {
      const price = chartMaxPrice - (chartPriceRange / 10) * i
      const y = chartPadding.top + (chartHeight / 10) * i
      ctx.fillText(price.toFixed(2), chartPadding.left + chartWidth + 5, y + 4)
    }

    // Draw candlesticks
    const candleWidth = Math.max(2, (chartWidth / chartData.length) * 0.8)
    
    chartData.forEach((data, index) => {
      const x = chartPadding.left + (chartWidth / (chartData.length - 1)) * index
      const openY = chartPadding.top + chartHeight - ((data.open - chartMinPrice) / chartPriceRange) * chartHeight
      const closeY = chartPadding.top + chartHeight - ((data.close - chartMinPrice) / chartPriceRange) * chartHeight
      const highY = chartPadding.top + chartHeight - ((data.high - chartMinPrice) / chartPriceRange) * chartHeight
      const lowY = chartPadding.top + chartHeight - ((data.low - chartMinPrice) / chartPriceRange) * chartHeight

      const isGreen = data.close >= data.open
      ctx.strokeStyle = isGreen ? greenColor : redColor
      ctx.fillStyle = isGreen ? greenColor : redColor

      // Draw high-low line
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(x, highY)
      ctx.lineTo(x, lowY)
      ctx.stroke()

      // Draw candle body
      const bodyTop = Math.min(openY, closeY)
      const bodyHeight = Math.abs(closeY - openY)
      
      if (bodyHeight < 1) {
        // Doji - draw as line
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(x - candleWidth / 2, openY)
        ctx.lineTo(x + candleWidth / 2, openY)
        ctx.stroke()
      } else {
        // Regular candle
        if (isGreen) {
          ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight)
        } else {
          ctx.strokeRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight)
        }
      }
    })

    // Draw moving averages
    if (chartData.length >= 7) {
      drawMovingAverage(ctx, chartData, 7, '#ff9500', chartMinPrice, chartPriceRange, chartPadding, chartWidth, chartHeight)
    }
    if (chartData.length >= 25) {
      drawMovingAverage(ctx, chartData, 25, '#00d4aa', chartMinPrice, chartPriceRange, chartPadding, chartWidth, chartHeight)
    }
    if (chartData.length >= 99) {
      drawMovingAverage(ctx, chartData, 99, '#ff6b6b', chartMinPrice, chartPriceRange, chartPadding, chartWidth, chartHeight)
    }

    // Draw current price line
    if (currentPrice > 0) {
      const priceY = chartPadding.top + chartHeight - ((currentPrice - chartMinPrice) / chartPriceRange) * chartHeight
      ctx.strokeStyle = priceChange >= 0 ? greenColor : redColor
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(chartPadding.left, priceY)
      ctx.lineTo(chartPadding.left + chartWidth, priceY)
      ctx.stroke()
      ctx.setLineDash([])
      
      // Price label
      ctx.fillStyle = priceChange >= 0 ? greenColor : redColor
      ctx.fillRect(chartPadding.left + chartWidth + 2, priceY - 10, 70, 20)
      ctx.fillStyle = '#ffffff'
      ctx.font = '12px monospace'
      ctx.textAlign = 'center'
      ctx.fillText(currentPrice.toFixed(2), chartPadding.left + chartWidth + 37, priceY + 4)
    }
  }

  const drawMovingAverage = (
    ctx: CanvasRenderingContext2D,
    data: ChartData[],
    period: number,
    color: string,
    minPrice: number,
    priceRange: number,
    padding: any,
    width: number,
    height: number
  ) => {
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.beginPath()

    for (let i = period - 1; i < data.length; i++) {
      const sum = data.slice(i - period + 1, i + 1).reduce((acc, d) => acc + d.close, 0)
      const avg = sum / period
      const x = padding.left + (width / (data.length - 1)) * i
      const y = padding.top + height - ((avg - minPrice) / priceRange) * height

      if (i === period - 1) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }

    ctx.stroke()
  }

  const drawVolumeChart = () => {
    const canvas = volumeCanvasRef.current
    if (!canvas || chartData.length === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    const width = rect.width
    const height = rect.height
    
    ctx.clearRect(0, 0, width, height)

    // Calculate volume range
    const volumes = chartData.map(d => d.volume)
    const maxVolume = Math.max(...volumes)

    // Chart area
    const chartPadding = { top: 10, right: 80, bottom: 10, left: 60 }
    const chartWidth = width - chartPadding.left - chartPadding.right
    const chartHeight = height - chartPadding.top - chartPadding.bottom

    // Draw volume bars
    const barWidth = Math.max(2, (chartWidth / chartData.length) * 0.8)
    
    chartData.forEach((data, index) => {
      const x = chartPadding.left + (chartWidth / (chartData.length - 1)) * index
      const barHeight = (data.volume / maxVolume) * chartHeight
      const isGreen = data.close >= data.open

      ctx.fillStyle = isGreen ? '#00d4aa40' : '#ff6b6b40'
      ctx.fillRect(x - barWidth / 2, chartPadding.top + chartHeight - barHeight, barWidth, barHeight)
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price)
  }

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`
    }
    return volume.toFixed(2)
  }

  if (isLoading && chartData.length === 0) {
    return (
      <Card className="w-full bg-[#0f0f23] border-[#1e1e2e]">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00d4aa] mx-auto mb-4"></div>
              <p className="text-[#8b8b8b]">Loading chart data...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full bg-[#0f0f23] border-[#1e1e2e]">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <CardTitle className="text-white text-xl">{symbol}</CardTitle>
            <div className="flex items-center gap-2">
              {isOnline ? (
                <Wifi className="w-4 h-4 text-[#00d4aa]" />
              ) : (
                <WifiOff className="w-4 h-4 text-[#ff6b6b]" />
              )}
              <Badge variant={isOnline ? "default" : "destructive"} className="text-xs">
                {isOnline ? 'Live' : 'Offline'}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchData}
                disabled={isLoading}
                className="text-[#8b8b8b] hover:text-white p-1"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
          
          <div className="flex gap-1">
            {timeframes.map((tf) => (
              <Button
                key={tf.value}
                variant={timeframe === tf.value ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeframe(tf.value)}
                className={`text-xs ${
                  timeframe === tf.value 
                    ? 'bg-[#00d4aa] text-black hover:bg-[#00d4aa]/90' 
                    : 'text-[#8b8b8b] hover:text-white hover:bg-[#1e1e2e]'
                }`}
              >
                {tf.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Price Info */}
        <div className="flex items-center gap-6 mt-4">
          <div className="text-2xl font-bold text-white">
            {formatPrice(currentPrice)}
          </div>
          <div className={`flex items-center gap-1 ${priceChange >= 0 ? 'text-[#00d4aa]' : 'text-[#ff6b6b]'}`}>
            {priceChange >= 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="font-medium">
              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} ({priceChangePercent.toFixed(2)}%)
            </span>
          </div>
          <div className="text-[#8b8b8b] text-sm">
            H: {formatPrice(high24h)} L: {formatPrice(low24h)}
          </div>
          <div className="text-[#8b8b8b] text-sm">
            Vol: {formatVolume(volume24h)}
          </div>
        </div>

        {error && (
          <div className="mt-2 p-2 bg-[#ff6b6b]/10 border border-[#ff6b6b]/20 rounded text-[#ff6b6b] text-sm">
            {error}
          </div>
        )}

        <div className="text-xs text-[#8b8b8b] mt-2">
          Last updated: {lastUpdate.toLocaleTimeString()}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="relative">
          {/* Main Chart */}
          <canvas
            ref={canvasRef}
            className="w-full h-96 bg-[#0f0f23]"
          />
          
          {/* Volume Chart */}
          <canvas
            ref={volumeCanvasRef}
            className="w-full h-24 bg-[#0f0f23] border-t border-[#1e1e2e]"
          />
        </div>

        {/* Chart Legend */}
        <div className="p-4 border-t border-[#1e1e2e]">
          <div className="flex items-center gap-6 text-xs text-[#8b8b8b]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-[#ff9500]"></div>
              <span>MA7</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-[#00d4aa]"></div>
              <span>MA25</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-[#ff6b6b]"></div>
              <span>MA99</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-3 h-3" />
              <span>Volume</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

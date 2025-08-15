'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Volume2, Settings, Maximize2 } from 'lucide-react'

interface CandlestickData {
  openTime: number
  open: number
  high: number
  low: number
  close: number
  volume: number
  closeTime: number
}

interface MovingAverage {
  period: number
  color: string
  values: number[]
}

export function BinanceChart() {
  const [symbol, setSymbol] = useState('BTCUSDT')
  const [timeframe, setTimeframe] = useState('1h')
  const [chartData, setChartData] = useState<CandlestickData[]>([])
  const [currentPrice, setCurrentPrice] = useState(0)
  const [priceChange, setPriceChange] = useState(0)
  const [priceChangePercent, setPriceChangePercent] = useState(0)
  const [high24h, setHigh24h] = useState(0)
  const [low24h, setLow24h] = useState(0)
  const [volume24h, setVolume24h] = useState(0)
  const [loading, setLoading] = useState(true)
  const [movingAverages, setMovingAverages] = useState<MovingAverage[]>([
    { period: 7, color: '#f59e0b', values: [] },
    { period: 25, color: '#8b5cf6', values: [] },
    { period: 99, color: '#06b6d4', values: [] }
  ])

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const volumeCanvasRef = useRef<HTMLCanvasElement>(null)

  const timeframes = [
    { label: '1m', value: '1m' },
    { label: '5m', value: '5m' },
    { label: '15m', value: '15m' },
    { label: '1h', value: '1h' },
    { label: '4h', value: '4h' },
    { label: '1d', value: '1d' },
    { label: '1w', value: '1w' }
  ]

  // Fetch chart data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch klines data
        const klinesResponse = await fetch(`/api/binance/klines/${symbol}?interval=${timeframe}&limit=200`)
        const klinesData = await klinesResponse.json()
        
        if (klinesData.klines) {
          setChartData(klinesData.klines)
          calculateMovingAverages(klinesData.klines)
        }
        
        // Fetch current price data
        const priceResponse = await fetch(`/api/binance/price/${symbol}`)
        const priceData = await priceResponse.json()
        
        if (priceData.price) {
          setCurrentPrice(priceData.price)
          setPriceChange(priceData.priceChange)
          setPriceChangePercent(priceData.priceChangePercent)
          setHigh24h(priceData.high24h)
          setLow24h(priceData.low24h)
          setVolume24h(priceData.volume24h)
        }
        
      } catch (error) {
        console.error('Error fetching chart data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 30000) // Update every 30 seconds
    
    return () => clearInterval(interval)
  }, [symbol, timeframe])

  // Calculate moving averages
  const calculateMovingAverages = (data: CandlestickData[]) => {
    const closes = data.map(d => d.close)
    
    const newMovingAverages = movingAverages.map(ma => {
      const values: number[] = []
      
      for (let i = ma.period - 1; i < closes.length; i++) {
        const sum = closes.slice(i - ma.period + 1, i + 1).reduce((a, b) => a + b, 0)
        values.push(sum / ma.period)
      }
      
      return { ...ma, values }
    })
    
    setMovingAverages(newMovingAverages)
  }

  // Draw candlestick chart
  useEffect(() => {
    if (!chartData.length || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio
    canvas.height = canvas.offsetHeight * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    const width = canvas.offsetWidth
    const height = canvas.offsetHeight
    const padding = { top: 20, right: 80, bottom: 40, left: 60 }
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom

    // Clear canvas
    ctx.fillStyle = '#0f0f23'
    ctx.fillRect(0, 0, width, height)

    // Calculate price range
    const prices = chartData.flatMap(d => [d.high, d.low])
    const maxPrice = Math.max(...prices)
    const minPrice = Math.min(...prices)
    const priceRange = maxPrice - minPrice

    // Draw grid
    ctx.strokeStyle = '#1e1e2e'
    ctx.lineWidth = 1
    
    // Horizontal grid lines
    for (let i = 0; i <= 10; i++) {
      const y = padding.top + (i * chartHeight) / 10
      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(padding.left + chartWidth, y)
      ctx.stroke()
      
      // Price labels
      const price = maxPrice - (i * priceRange) / 10
      ctx.fillStyle = '#6b7280'
      ctx.font = '11px monospace'
      ctx.textAlign = 'left'
      ctx.fillText(price.toFixed(2), padding.left + chartWidth + 5, y + 4)
    }

    // Vertical grid lines
    const timeStep = Math.max(1, Math.floor(chartData.length / 10))
    for (let i = 0; i < chartData.length; i += timeStep) {
      const x = padding.left + (i * chartWidth) / (chartData.length - 1)
      ctx.beginPath()
      ctx.moveTo(x, padding.top)
      ctx.lineTo(x, padding.top + chartHeight)
      ctx.stroke()
    }

    // Draw moving averages
    movingAverages.forEach(ma => {
      if (ma.values.length === 0) return
      
      ctx.strokeStyle = ma.color
      ctx.lineWidth = 2
      ctx.beginPath()
      
      const startIndex = ma.period - 1
      for (let i = 0; i < ma.values.length; i++) {
        const x = padding.left + ((startIndex + i) * chartWidth) / (chartData.length - 1)
        const y = padding.top + ((maxPrice - ma.values[i]) * chartHeight) / priceRange
        
        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.stroke()
    })

    // Draw candlesticks
    const candleWidth = Math.max(1, chartWidth / chartData.length * 0.8)
    
    chartData.forEach((candle, index) => {
      const x = padding.left + (index * chartWidth) / (chartData.length - 1)
      const openY = padding.top + ((maxPrice - candle.open) * chartHeight) / priceRange
      const closeY = padding.top + ((maxPrice - candle.close) * chartHeight) / priceRange
      const highY = padding.top + ((maxPrice - candle.high) * chartHeight) / priceRange
      const lowY = padding.top + ((maxPrice - candle.low) * chartHeight) / priceRange
      
      const isGreen = candle.close > candle.open
      const color = isGreen ? '#00d4aa' : '#ff6b6b'
      
      // Draw wick
      ctx.strokeStyle = color
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(x, highY)
      ctx.lineTo(x, lowY)
      ctx.stroke()
      
      // Draw body
      ctx.fillStyle = color
      const bodyHeight = Math.abs(closeY - openY)
      const bodyY = Math.min(openY, closeY)
      
      if (isGreen) {
        ctx.fillRect(x - candleWidth/2, bodyY, candleWidth, bodyHeight)
      } else {
        ctx.strokeStyle = color
        ctx.lineWidth = 1
        ctx.strokeRect(x - candleWidth/2, bodyY, candleWidth, bodyHeight)
      }
    })

    // Draw current price line
    if (currentPrice > 0) {
      const currentPriceY = padding.top + ((maxPrice - currentPrice) * chartHeight) / priceRange
      ctx.strokeStyle = priceChange >= 0 ? '#00d4aa' : '#ff6b6b'
      ctx.lineWidth = 1
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(padding.left, currentPriceY)
      ctx.lineTo(padding.left + chartWidth, currentPriceY)
      ctx.stroke()
      ctx.setLineDash([])
      
      // Current price label
      ctx.fillStyle = priceChange >= 0 ? '#00d4aa' : '#ff6b6b'
      ctx.fillRect(padding.left + chartWidth + 2, currentPriceY - 10, 70, 20)
      ctx.fillStyle = '#ffffff'
      ctx.font = '12px monospace'
      ctx.textAlign = 'center'
      ctx.fillText(currentPrice.toFixed(2), padding.left + chartWidth + 37, currentPriceY + 4)
    }

  }, [chartData, movingAverages, currentPrice, priceChange])

  // Draw volume chart
  useEffect(() => {
    if (!chartData.length || !volumeCanvasRef.current) return

    const canvas = volumeCanvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = canvas.offsetWidth * window.devicePixelRatio
    canvas.height = canvas.offsetHeight * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    const width = canvas.offsetWidth
    const height = canvas.offsetHeight
    const padding = { top: 10, right: 80, bottom: 20, left: 60 }
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom

    ctx.fillStyle = '#0f0f23'
    ctx.fillRect(0, 0, width, height)

    const maxVolume = Math.max(...chartData.map(d => d.volume))
    const barWidth = chartWidth / chartData.length * 0.8

    chartData.forEach((candle, index) => {
      const x = padding.left + (index * chartWidth) / (chartData.length - 1)
      const barHeight = (candle.volume / maxVolume) * chartHeight
      const y = padding.top + chartHeight - barHeight
      
      const isGreen = candle.close > candle.open
      ctx.fillStyle = isGreen ? '#00d4aa40' : '#ff6b6b40'
      ctx.fillRect(x - barWidth/2, y, barWidth, barHeight)
    })

  }, [chartData])

  const formatNumber = (num: number) => {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B'
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M'
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K'
    return num.toFixed(2)
  }

  return (
    <Card className="col-span-2 bg-[#0f0f23] border-[#1e1e2e] text-white">
      <CardHeader className="pb-2">
        {/* Price Info Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm">
                ₿
              </div>
              <span className="text-lg font-semibold">{symbol.replace('USDT', '')}/USDT</span>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <div>
                <span className="text-gray-400">Mở: </span>
                <span className="text-white">{(currentPrice - priceChange).toFixed(2)}</span>
              </div>
              <div>
                <span className="text-gray-400">Cao: </span>
                <span className="text-green-400">{high24h.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-gray-400">Thấp: </span>
                <span className="text-red-400">{low24h.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-gray-400">Đóng: </span>
                <span className="text-white">{currentPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-[#1e1e2e] text-gray-400">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="border-[#1e1e2e] text-gray-400">
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Current Price and Change */}
        <div className="flex items-center gap-4">
          <div className="text-2xl font-bold text-white">
            {currentPrice.toLocaleString()}
          </div>
          <div className={`flex items-center gap-1 ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {priceChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span className="font-medium">
              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} ({priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%)
            </span>
          </div>
          <Badge variant="outline" className="border-yellow-500 text-yellow-400">
            BIẾN ĐỘNG: {priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%
          </Badge>
        </div>

        {/* Moving Averages */}
        <div className="flex items-center gap-6 text-sm">
          {movingAverages.map((ma, index) => (
            <div key={ma.period} className="flex items-center gap-1">
              <span className="text-gray-400">MA({ma.period}):</span>
              <span style={{ color: ma.color }} className="font-medium">
                {ma.values.length > 0 ? ma.values[ma.values.length - 1].toFixed(2) : '--'}
              </span>
            </div>
          ))}
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {timeframes.map((tf) => (
              <Button
                key={tf.value}
                variant={timeframe === tf.value ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeframe(tf.value)}
                className={`h-7 px-3 text-xs ${
                  timeframe === tf.value 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'border-[#1e1e2e] text-gray-400 hover:text-white'
                }`}
              >
                {tf.label}
              </Button>
            ))}
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Volume2 className="w-4 h-4" />
            <span>Vol(BTC): {formatNumber(volume24h)}</span>
            <span>Vol(USDT): {formatNumber(volume24h * currentPrice)}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Main Chart */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="w-full h-96 cursor-crosshair"
            style={{ background: '#0f0f23' }}
          />
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#0f0f23]/80">
              <div className="text-gray-400">Đang tải dữ liệu...</div>
            </div>
          )}
        </div>
        
        {/* Volume Chart */}
        <div className="border-t border-[#1e1e2e] mt-2">
          <canvas
            ref={volumeCanvasRef}
            className="w-full h-24"
            style={{ background: '#0f0f23' }}
          />
        </div>
      </CardContent>
    </Card>
  )
}

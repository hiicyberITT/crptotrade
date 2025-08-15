'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react'

interface CandlestickData {
  openTime: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export function TradingChart() {
  const [chartData, setChartData] = useState<CandlestickData[]>([])
  const [timeframe, setTimeframe] = useState('1h')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Generate mock data for now
  useEffect(() => {
    const generateMockData = () => {
      const data: CandlestickData[] = []
      let basePrice = 67000
      const now = Date.now()
      
      for (let i = 0; i < 100; i++) {
        const time = now - (100 - i) * 3600000 // 1 hour intervals
        const change = (Math.random() - 0.5) * 0.02 // 2% max change
        const open = basePrice
        const close = open * (1 + change)
        const high = Math.max(open, close) * (1 + Math.random() * 0.01)
        const low = Math.min(open, close) * (1 - Math.random() * 0.01)
        const volume = Math.random() * 100 + 10
        
        data.push({
          openTime: time,
          open: parseFloat(open.toFixed(2)),
          high: parseFloat(high.toFixed(2)),
          low: parseFloat(low.toFixed(2)),
          close: parseFloat(close.toFixed(2)),
          volume: parseFloat(volume.toFixed(4))
        })
        
        basePrice = close
      }
      
      setChartData(data)
    }

    generateMockData()
  }, [timeframe])

  // Draw chart
  useEffect(() => {
    if (!chartData.length || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const width = canvas.width
    const height = canvas.height
    const padding = 40

    // Clear canvas
    ctx.fillStyle = '#1a1a1a'
    ctx.fillRect(0, 0, width, height)

    // Calculate price range
    const prices = chartData.flatMap(d => [d.high, d.low])
    const maxPrice = Math.max(...prices)
    const minPrice = Math.min(...prices)
    const priceRange = maxPrice - minPrice

    // Draw candlesticks
    const candleWidth = (width - 2 * padding) / chartData.length * 0.8

    chartData.forEach((candle, index) => {
      const x = padding + (index * (width - 2 * padding)) / chartData.length
      const openY = padding + ((maxPrice - candle.open) * (height - 2 * padding)) / priceRange
      const closeY = padding + ((maxPrice - candle.close) * (height - 2 * padding)) / priceRange
      const highY = padding + ((maxPrice - candle.high) * (height - 2 * padding)) / priceRange
      const lowY = padding + ((maxPrice - candle.low) * (height - 2 * padding)) / priceRange

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
      ctx.fillRect(x - candleWidth/2, bodyY, candleWidth, bodyHeight)
    })

  }, [chartData])

  const timeframes = ['1m', '5m', '15m', '1h', '4h', '1d']

  return (
    <Card className="shadow-lg bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <BarChart3 className="w-5 h-5" />
            Biểu Đồ Giá BTC/USD
          </CardTitle>
          <div className="flex gap-1">
            {timeframes.map((tf) => (
              <Button
                key={tf}
                variant={timeframe === tf ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeframe(tf)}
                className="h-7 px-3 text-xs"
              >
                {tf}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <canvas
          ref={canvasRef}
          className="w-full h-80 border border-border rounded"
        />
      </CardContent>
    </Card>
  )
}

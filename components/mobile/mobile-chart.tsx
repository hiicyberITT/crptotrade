'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, BarChart3, Maximize2 } from 'lucide-react'

interface MobileChartProps {
  symbol?: string
  height?: number
}

export function MobileChart({ symbol = 'BTCUSDT', height = 200 }: MobileChartProps) {
  const [price, setPrice] = useState(67234.50)
  const [change, setChange] = useState(2.34)
  const [selectedTimeframe, setSelectedTimeframe] = useState('1H')
  const [chartData, setChartData] = useState<number[]>([])

  useEffect(() => {
    // Generate mock chart data
    const generateData = () => {
      const data = []
      let currentPrice = price
      for (let i = 0; i < 50; i++) {
        currentPrice += (Math.random() - 0.5) * 1000
        data.push(Math.max(currentPrice, 30000))
      }
      return data
    }

    setChartData(generateData())

    // Simulate real-time updates
    const interval = setInterval(() => {
      const newChange = (Math.random() - 0.5) * 1000
      setPrice(prev => Math.max(prev + newChange, 30000))
      setChange(prev => prev + (Math.random() - 0.5) * 2)
      
      setChartData(prev => {
        const newData = [...prev.slice(1)]
        const lastPrice = prev[prev.length - 1]
        newData.push(Math.max(lastPrice + (Math.random() - 0.5) * 1000, 30000))
        return newData
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [price])

  const timeframes = ['1M', '5M', '15M', '1H', '4H', '1D', '1W']

  const maxPrice = Math.max(...chartData)
  const minPrice = Math.min(...chartData)
  const priceRange = maxPrice - minPrice

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        {/* Price Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold">{symbol}</h3>
              <Badge variant={change >= 0 ? "default" : "destructive"} className="text-xs">
                {change >= 0 ? '+' : ''}{change.toFixed(2)}%
              </Badge>
            </div>
            <div className="text-2xl font-bold">
              ${price.toLocaleString()}
            </div>
            <div className={`flex items-center gap-1 text-sm ${
              change >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{change >= 0 ? '+' : ''}${Math.abs(change * price / 100).toFixed(2)}</span>
            </div>
          </div>
          
          <Button variant="ghost" size="sm">
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center gap-1 mb-4 overflow-x-auto">
          {timeframes.map((timeframe) => (
            <Button
              key={timeframe}
              variant={selectedTimeframe === timeframe ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedTimeframe(timeframe)}
              className={`text-xs whitespace-nowrap ${
                selectedTimeframe === timeframe 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground'
              }`}
            >
              {timeframe}
            </Button>
          ))}
        </div>

        {/* Chart */}
        <div className="relative" style={{ height: `${height}px` }}>
          <svg
            width="100%"
            height="100%"
            className="overflow-visible"
          >
            {/* Grid lines */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Price line */}
            <polyline
              fill="none"
              stroke={change >= 0 ? "#10b981" : "#ef4444"}
              strokeWidth="2"
              points={chartData.map((price, index) => {
                const x = (index / (chartData.length - 1)) * 100
                const y = ((maxPrice - price) / priceRange) * 100
                return `${x}%,${y}%`
              }).join(' ')}
            />
            
            {/* Area fill */}
            <polygon
              fill={`url(#gradient-${change >= 0 ? 'green' : 'red'})`}
              points={`0%,100% ${chartData.map((price, index) => {
                const x = (index / (chartData.length - 1)) * 100
                const y = ((maxPrice - price) / priceRange) * 100
                return `${x}%,${y}%`
              }).join(' ')} 100%,100%`}
            />
            
            {/* Gradients */}
            <defs>
              <linearGradient id="gradient-green" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
              </linearGradient>
              <linearGradient id="gradient-red" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0"/>
              </linearGradient>
            </defs>
          </svg>
          
          {/* Price labels */}
          <div className="absolute top-0 right-0 text-xs text-muted-foreground">
            ${maxPrice.toLocaleString()}
          </div>
          <div className="absolute bottom-0 right-0 text-xs text-muted-foreground">
            ${minPrice.toLocaleString()}
          </div>
        </div>

        {/* Chart Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">24h High</p>
            <p className="font-mono font-medium">${maxPrice.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">24h Low</p>
            <p className="font-mono font-medium">${minPrice.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Volume</p>
            <p className="font-mono font-medium">1.2K BTC</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

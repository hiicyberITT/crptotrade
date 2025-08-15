'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BarChart3 } from 'lucide-react'

export function OrderBookAdvanced() {
  const orderBook = {
    bids: [
      { price: 67230.00, amount: 0.5432, total: 36512.78, percentage: 85 },
      { price: 67225.50, amount: 0.2156, total: 14492.33, percentage: 65 },
      { price: 67220.00, amount: 0.8901, total: 59834.42, percentage: 95 },
      { price: 67215.25, amount: 0.3445, total: 23156.89, percentage: 45 },
      { price: 67210.00, amount: 0.6789, total: 45623.12, percentage: 75 }
    ],
    asks: [
      { price: 67235.00, amount: 0.4321, total: 29056.34, percentage: 60 },
      { price: 67240.25, amount: 0.7654, total: 51467.89, percentage: 80 },
      { price: 67245.50, amount: 0.2987, total: 20089.45, percentage: 40 },
      { price: 67250.00, amount: 0.5678, total: 38178.25, percentage: 70 },
      { price: 67255.25, amount: 0.1234, total: 8299.12, percentage: 25 }
    ]
  }

  const currentPrice = 67234.50

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <BarChart3 className="w-5 h-5" />
          Sổ Lệnh Chi Tiết
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Header */}
          <div className="grid grid-cols-4 gap-2 text-xs font-medium text-muted-foreground pb-2 border-b border-border">
            <div>Giá (USD)</div>
            <div className="text-right">Số lượng</div>
            <div className="text-right">Tổng</div>
            <div className="text-right">Tỷ lệ</div>
          </div>

          {/* Asks (Sell Orders) */}
          <div className="space-y-1">
            {orderBook.asks.reverse().map((ask, index) => (
              <div key={index} className="relative">
                <div className="absolute inset-0 bg-red-500/10 dark:bg-red-500/20 rounded" 
                     style={{ width: `${ask.percentage}%` }} />
                <div className="relative grid grid-cols-4 gap-2 text-xs py-1 px-2">
                  <div className="text-red-500 font-medium">${ask.price.toLocaleString()}</div>
                  <div className="text-right text-foreground">{ask.amount.toFixed(4)}</div>
                  <div className="text-right text-muted-foreground">${ask.total.toLocaleString()}</div>
                  <div className="text-right">
                    <Progress value={ask.percentage} className="h-1 w-8 ml-auto" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Current Price */}
          <div className="py-3 text-center border-y border-border bg-muted/30 rounded">
            <div className="text-xl font-bold text-green-500">${currentPrice.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Giá hiện tại</div>
          </div>

          {/* Bids (Buy Orders) */}
          <div className="space-y-1">
            {orderBook.bids.map((bid, index) => (
              <div key={index} className="relative">
                <div className="absolute inset-0 bg-green-500/10 dark:bg-green-500/20 rounded" 
                     style={{ width: `${bid.percentage}%` }} />
                <div className="relative grid grid-cols-4 gap-2 text-xs py-1 px-2">
                  <div className="text-green-500 font-medium">${bid.price.toLocaleString()}</div>
                  <div className="text-right text-foreground">{bid.amount.toFixed(4)}</div>
                  <div className="text-right text-muted-foreground">${bid.total.toLocaleString()}</div>
                  <div className="text-right">
                    <Progress value={bid.percentage} className="h-1 w-8 ml-auto" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

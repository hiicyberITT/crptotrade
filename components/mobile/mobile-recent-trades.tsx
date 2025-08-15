'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/format'

type Trade = { price: number; qty: number; side: 'buy' | 'sell'; time: number }

export function MobileRecentTrades({
  symbol = 'BTCUSDT',
  limit = 30,
}: {
  symbol?: string
  limit?: number
}) {
  const [trades, setTrades] = useState<Trade[]>([])

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await fetch(`/api/binance/market`)
        if (!res.ok) throw new Error('bad status')
        const json = await res.json()
        const list: Trade[] =
          json?.trades?.slice(0, limit).map((t: any) => ({
            price: Number(t.price),
            qty: Number(t.qty ?? t.quantity ?? 0),
            side: t.isBuyerMaker ? 'sell' : 'buy',
            time: t.time ?? Date.now(),
          })) ?? []
        if (mounted && list.length) setTrades(list)
      } catch {
        // fallback mock
        const base = 41700
        const list: Trade[] = Array.from({ length: limit }).map((_, i) => {
          const price = base + Math.sin(i / 3) * 20 + (Math.random() - 0.5) * 10
          const qty = Math.max(0.0005, Math.random() * 0.05)
          const side: 'buy' | 'sell' = Math.random() > 0.5 ? 'buy' : 'sell'
          const time = Date.now() - i * 15000
          return { price, qty, side, time }
        })
        if (mounted) setTrades(list)
      }
    }
    load()
    const t = setInterval(load, 5000)
    return () => {
      mounted = false
      clearInterval(t)
    }
  }, [symbol, limit])

  return (
    <Card className="bg-[#0F172A] border-[#1E293B]">
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-lg">Giao dịch gần đây</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 max-h-[220px] overflow-auto pr-2">
        {trades.map((t, idx) => (
          <div key={idx} className="flex items-center justify-between text-sm py-1">
            <span className={t.side === 'buy' ? 'text-green-400' : 'text-red-400'}>
              {formatCurrency(t.price)}
            </span>
            <span className="text-gray-300">{t.qty.toFixed(6)}</span>
            <span className="text-gray-500 text-xs">
              {new Date(t.time).toLocaleTimeString()}
            </span>
          </div>
        ))}
        {trades.length === 0 && <div className="text-gray-500 text-sm">Không có dữ liệu</div>}
      </CardContent>
    </Card>
  )
}

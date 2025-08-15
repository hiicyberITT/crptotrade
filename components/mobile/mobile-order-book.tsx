'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/format'

type Row = { price: number; qty: number; total: number }
type OrderBook = { bids: Row[]; asks: Row[] }

export function MobileOrderBook({
  symbol = 'BTCUSDT',
  onPriceClick = () => {},
  limit = 10,
}: {
  symbol?: string
  onPriceClick?: (price: number) => void
  limit?: number
}) {
  const [data, setData] = useState<OrderBook>({ bids: [], asks: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        const res = await fetch(`/api/binance/orderbook/${symbol}?limit=${limit * 2}`)
        if (!res.ok) throw new Error('bad status')
        const json = await res.json()
        const bids: Row[] = (json?.bids || json?.data?.bids || []).slice(0, limit).map((b: any) => ({
          price: Number(b[0] ?? b.price),
          qty: Number(b[1] ?? b.qty),
          total: Number(b[0] ?? b.price) * Number(b[1] ?? b.qty),
        }))
        const asks: Row[] = (json?.asks || json?.data?.asks || []).slice(0, limit).map((a: any) => ({
          price: Number(a[0] ?? a.price),
          qty: Number(a[1] ?? a.qty),
          total: Number(a[0] ?? a.price) * Number(a[1] ?? a.qty),
        }))
        if (mounted) setData({ bids, asks })
      } catch {
        // fallback mock
        const mid = 41700
        const asks: Row[] = Array.from({ length: limit }).map((_, i) => {
          const price = mid + i * 5 + 5
          const qty = Math.max(0.001, (Math.random() * 0.2) / (i + 1))
          return { price, qty, total: price * qty }
        })
        const bids: Row[] = Array.from({ length: limit }).map((_, i) => {
          const price = mid - i * 5 - 5
          const qty = Math.max(0.001, (Math.random() * 0.2) / (i + 1))
          return { price, qty, total: price * qty }
        })
        if (mounted) setData({ bids, asks })
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    const t = setInterval(load, 4000)
    return () => {
      mounted = false
      clearInterval(t)
    }
  }, [symbol, limit])

  const maxTotal = useMemo(() => {
    const all = [...data.asks, ...data.bids]
    return all.reduce((m, r) => Math.max(m, r.total), 1)
  }, [data])

  return (
    <Card className="bg-[#0F172A] border-[#1E293B]">
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-lg">Sổ lệnh</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <div className="text-xs text-gray-500 flex justify-between px-1">
            <span>Giá(USDT)</span>
            <span>Khối lượng</span>
          </div>
          {data.asks.map((r, idx) => (
            <button
              key={`ask-${idx}`}
              onClick={() => onPriceClick(r.price)}
              className="relative w-full flex items-center justify-between px-1 py-1.5 rounded text-red-300 hover:bg-red-900/20"
            >
              <div
                className="absolute inset-y-0 right-0 bg-red-900/30 rounded"
                style={{ width: `${Math.min(100, (r.total / maxTotal) * 100)}%` }}
                aria-hidden="true"
              />
              <span className="relative z-10">{formatCurrency(r.price)}</span>
              <span className="relative z-10 text-gray-300">{r.qty.toFixed(4)}</span>
            </button>
          ))}
        </div>
        <div className="space-y-1">
          <div className="text-xs text-gray-500 flex justify-between px-1">
            <span>Giá(USDT)</span>
            <span>Khối lượng</span>
          </div>
          {data.bids.map((r, idx) => (
            <button
              key={`bid-${idx}`}
              onClick={() => onPriceClick(r.price)}
              className="relative w-full flex items-center justify-between px-1 py-1.5 rounded text-green-300 hover:bg-green-900/20"
            >
              <div
                className="absolute inset-y-0 right-0 bg-green-900/30 rounded"
                style={{ width: `${Math.min(100, (r.total / maxTotal) * 100)}%` }}
                aria-hidden="true"
              />
              <span className="relative z-10">{formatCurrency(r.price)}</span>
              <span className="relative z-10 text-gray-300">{r.qty.toFixed(4)}</span>
            </button>
          ))}
        </div>
      </CardContent>
      {loading && <div className="px-4 pb-4 text-xs text-gray-500">Đang tải sổ lệnh...</div>}
    </Card>
  )
}

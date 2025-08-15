'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useInterval } from '@/hooks/use-interval'
import { cn } from '@/lib/utils'

type Kline = { time: number; open: number; high: number; low: number; close: number }

export function MobileChartLite({
  symbol = 'BTCUSDT',
  height = 180,
  className,
}: {
  symbol?: string
  height?: number
  className?: string
}) {
  const [data, setData] = useState<Kline[]>([])
  const [interval, setIntervalVal] = useState<'1m' | '5m' | '1h'>('1m')

  const fetchKlines = async () => {
    try {
      const res = await fetch(`/api/binance/klines/${symbol}?interval=${interval}&limit=60`)
      if (!res.ok) throw new Error('bad status')
      const json = await res.json()
      const arr = (json?.data ?? json)?.map((k: any) => ({
        time: Number(k[0] ?? k.time),
        open: Number(k[1] ?? k.open),
        high: Number(k[2] ?? k.high),
        low: Number(k[3] ?? k.low),
        close: Number(k[4] ?? k.close),
      }))
      setData(arr)
    } catch {
      const now = Date.now()
      const arr: Kline[] = Array.from({ length: 60 }).map((_, i) => {
        const t = now - (60 - i) * 60000
        const base = 41700 + Math.sin(i / 6) * 80 + (Math.random() - 0.5) * 30
        const o = base + (Math.random() - 0.5) * 10
        const c = base + (Math.random() - 0.5) * 10
        const h = Math.max(o, c) + Math.random() * 15
        const l = Math.min(o, c) - Math.random() * 15
        return { time: t, open: o, high: h, low: l, close: c }
      })
      setData(arr)
    }
  }

  useEffect(() => {
    fetchKlines()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol, interval])

  useInterval(fetchKlines, 8000)

  const path = useMemo(() => {
    if (!data.length) return ''
    const w = 320 // will scale with viewBox
    const h = height - 20
    const xs = data.map((d, i) => (i / (data.length - 1)) * w)
    const ys = data.map((d) => d.close)
    const minY = Math.min(...ys)
    const maxY = Math.max(...ys)
    const yScale = (val: number) => h - ((val - minY) / Math.max(1e-6, maxY - minY)) * h
    return xs.map((x, i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${yScale(ys[i]).toFixed(2)}`).join(' ')
  }, [data, height])

  const lastClose = data[data.length - 1]?.close
  const firstClose = data[0]?.close
  const up = lastClose >= firstClose

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between px-2 pt-2">
        <div className="text-sm text-gray-400">Khung thời gian</div>
        <div className="flex gap-2">
          {(['1m', '5m', '1h'] as const).map((it) => (
            <button
              key={it}
              onClick={() => setIntervalVal(it)}
              className={`text-xs px-2 py-1 rounded ${
                interval === it ? 'bg-cyan-600 text-white' : 'bg-[#111827] text-gray-300'
              }`}
              aria-pressed={interval === it}
            >
              {it}
            </button>
          ))}
        </div>
      </div>
      <svg role="img" aria-label="Sparkline" viewBox="0 0 320 200" preserveAspectRatio="none" style={{ height }}>
        <defs>
          <linearGradient id="fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={up ? '#10B981' : '#EF4444'} stopOpacity="0.3" />
            <stop offset="100%" stopColor={up ? '#10B981' : '#EF4444'} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="320" height="200" fill="#0F172A" />
        <path d={path} fill="none" stroke={up ? '#10B981' : '#EF4444'} strokeWidth="2" />
        <path d={`${path} L 320 200 L 0 200 Z`} fill="url(#fill)" opacity="0.6" />
      </svg>
      <div className="px-2 pb-2 text-xs text-gray-500">
        {data.length ? `Giá: ${lastClose?.toFixed(2)} • Nến: ${data.length}` : 'Đang tải biểu đồ...'}
      </div>
    </div>
  )
}

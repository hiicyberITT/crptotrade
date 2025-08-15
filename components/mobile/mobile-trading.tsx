'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { MobileOrderBook } from './mobile-order-book'
import { MobileRecentTrades } from './mobile-recent-trades'
import { MobileChartLite } from './mobile-chart-lite'
import { MobileOpenOrders, type OrderRow } from './mobile-open-orders'
import { DollarSign, TrendingUp, TrendingDown, CheckCircle2 } from 'lucide-react'
import { formatCurrency } from '@/lib/format'

type OrderType = 'market' | 'limit' | 'stop'
type TradeSide = 'buy' | 'sell'

export function MobileTrading({
  symbol = 'BTCUSDT',
  onChangeSymbol = () => {},
}: {
  symbol?: string
  onChangeSymbol?: (s: string) => void
}) {
  const [pair, setPair] = useState(symbol)
  const [orderType, setOrderType] = useState<OrderType>('market')
  const [side, setSide] = useState<TradeSide>('buy')
  const [amount, setAmount] = useState<string>('')
  const [price, setPrice] = useState<string>('')
  const [balance, setBalance] = useState<number>(1250.67)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [openOrders, setOpenOrders] = useState<OrderRow[]>([])
  const [history, setHistory] = useState<OrderRow[]>([])
  const [lastPrice, setLastPrice] = useState<number>(0)

  useEffect(() => {
    setPair(symbol)
  }, [symbol])

  useEffect(() => {
    onChangeSymbol(pair)
  }, [pair, onChangeSymbol])

  useEffect(() => {
    let timer: number | undefined
    async function fetchPrice() {
      try {
        const res = await fetch(`/api/binance/price/${pair}`)
        if (!res.ok) throw new Error('Bad status')
        const data = await res.json()
        const p = Number(data?.price ?? data?.data?.price ?? 0)
        setLastPrice(Number.isFinite(p) && p > 0 ? p : lastPrice || 41700.12)
      } catch {
        // fallback
        setLastPrice((p) => p || 41700.12)
      }
    }
    fetchPrice()
    timer = window.setInterval(fetchPrice, 5000)
    return () => {
      if (timer) window.clearInterval(timer)
    }
  }, [pair])

  const notional = useMemo(() => {
    const qty = parseFloat(amount || '0')
    const px = orderType === 'market' ? lastPrice : parseFloat(price || '0')
    return qty * (Number.isFinite(px) ? px : 0)
  }, [amount, price, lastPrice, orderType])

  const handleQuickPercent = (pct: number) => {
    const base = balance
    const target = (base * pct) / 100
    const px = orderType === 'market' ? lastPrice : parseFloat(price || '0') || lastPrice
    const qty = px > 0 ? target / px : 0
    setAmount(qty > 0 ? qty.toFixed(6) : '')
  }

  const handleSubmit = async () => {
    if (!amount || (orderType !== 'market' && !price)) {
      alert('Vui lòng nhập đầy đủ thông tin')
      return
    }
    setSubmitting(true)
    try {
      await new Promise((r) => setTimeout(r, 900))
      const now = Date.now()
      const newOrder: OrderRow = {
        id: `${now}`,
        symbol: pair,
        side,
        type: orderType,
        price: orderType === 'market' ? lastPrice : parseFloat(price),
        quantity: parseFloat(amount),
        status: 'open',
        createdAt: new Date().toISOString(),
      }
      setOpenOrders((o) => [newOrder, ...o])
      setSuccess('Đặt lệnh thành công!')
      setAmount('')
      setPrice('')
      setTimeout(() => setSuccess(null), 2500)
    } catch (e) {
      alert('Đặt lệnh thất bại, thử lại sau.')
    } finally {
      setSubmitting(false)
    }
  }

  const cancelOrder = (id: string) => {
    setOpenOrders((rows) => {
      const order = rows.find((r) => r.id === id)
      if (order) {
        setHistory((h) => [{ ...order, status: 'canceled' }, ...h])
      }
      return rows.filter((r) => r.id !== id)
    })
  }

  const fillOrder = (bookPrice: number) => {
    if (orderType === 'market') return
    setPrice(String(bookPrice))
  }

  const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'ADAUSDT']

  return (
    <div className="p-4 space-y-4">
      {success && (
        <div className="bg-green-600/20 border border-green-600 rounded-lg p-3 flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          <span className="text-green-400 text-sm">{success}</span>
        </div>
      )}

      {/* Top bar with pair selector and last price */}
      <Card className="bg-[#0F172A] border-[#1E293B]">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <Label htmlFor="pair" className="text-gray-400 text-xs">
                Cặp giao dịch
              </Label>
              <Select value={pair} onValueChange={setPair}>
                <SelectTrigger id="pair" className="w-[140px] bg-[#111827] border-[#1F2937] text-white">
                  <SelectValue placeholder="Chọn cặp" />
                </SelectTrigger>
                <SelectContent className="bg-[#0F172A] border-[#1E293B]">
                  {symbols.map((s) => (
                    <SelectItem key={s} value={s} className="text-white">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Badge className="bg-[#111827] text-white">
              {side === 'buy' ? 'Mua' : 'Bán'}
            </Badge>
          </div>
          <div className="text-right">
            <div className="text-white text-xl font-bold">{formatCurrency(lastPrice)}</div>
            <div className="text-gray-400 text-xs">{pair}</div>
          </div>
        </CardContent>
      </Card>

      {/* Chart / Order Book / Trades */}
      <Tabs defaultValue="chart" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-[#111827]">
          <TabsTrigger value="chart" className="text-gray-300 data-[state=active]:text-white">
            Biểu đồ
          </TabsTrigger>
          <TabsTrigger value="orderbook" className="text-gray-300 data-[state=active]:text-white">
            Sổ lệnh
          </TabsTrigger>
          <TabsTrigger value="trades" className="text-gray-300 data-[state=active]:text-white">
            Giao dịch
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chart" className="mt-3">
          <Card className="bg-[#0F172A] border-[#1E293B]">
            <CardContent className="p-2">
              <MobileChartLite symbol={pair} height={180} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orderbook" className="mt-3">
          <MobileOrderBook symbol={pair} onPriceClick={fillOrder} />
        </TabsContent>

        <TabsContent value="trades" className="mt-3">
          <MobileRecentTrades symbol={pair} />
        </TabsContent>
      </Tabs>

      {/* Trading Form */}
      <Card className="bg-[#0F172A] border-[#1E293B]">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-lg">Đặt lệnh</CardTitle>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => setSide('buy')}
                className={`h-9 px-3 ${
                  side === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-[#111827] text-gray-300 hover:bg-[#1F2937]'
                }`}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Mua
              </Button>
              <Button
                onClick={() => setSide('sell')}
                className={`h-9 px-3 ${
                  side === 'sell' ? 'bg-red-600 hover:bg-red-700' : 'bg-[#111827] text-gray-300 hover:bg-[#1F2937]'
                }`}
              >
                <TrendingDown className="w-4 h-4 mr-2" />
                Bán
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {(['market', 'limit', 'stop'] as OrderType[]).map((t) => (
              <Button
                key={t}
                size="sm"
                onClick={() => setOrderType(t)}
                className={`text-xs ${
                  orderType === t ? 'bg-cyan-600 text-white' : 'bg-[#111827] text-gray-300 hover:bg-[#1F2937]'
                }`}
                aria-pressed={orderType === t}
              >
                {t[0].toUpperCase() + t.slice(1)}
              </Button>
            ))}
          </div>

          {orderType !== 'market' && (
            <div className="space-y-2">
              <Label className="text-gray-400 text-sm">Giá</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  inputMode="decimal"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="pl-10 bg-[#111827] border-[#1E293B] text-white"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-gray-400 text-sm">Số lượng ({pair.replace('USDT', '')})</Label>
              <div className="text-gray-400 text-xs">Khả dụng: ${balance.toLocaleString()}</div>
            </div>
            <div className="relative">
              <Input
                inputMode="decimal"
                placeholder="0.000000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-[#111827] border-[#1E293B] text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[25, 50, 75, 100].map((p) => (
              <Button
                key={p}
                size="sm"
                variant="outline"
                onClick={() => handleQuickPercent(p)}
                className="text-xs border-[#1E293B] text-gray-300 hover:bg-[#1F2937]"
              >
                {p}%
              </Button>
            ))}
          </div>

          <div className="bg-[#111827] rounded-lg p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Tổng</span>
              <span className="text-white">{formatCurrency(notional)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Phí ước tính</span>
              <span className="text-white">$0.50</span>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={submitting || !amount || (orderType !== 'market' && !price)}
            className={`w-full h-12 font-medium ${
              side === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
            } ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {submitting ? 'Đang xử lý...' : `${side === 'buy' ? 'Mua' : 'Bán'} ${pair.replace('USDT', '')}`}
          </Button>
        </CardContent>
      </Card>

      {/* Open Orders and History */}
      <Tabs defaultValue="open-orders" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-[#111827]">
          <TabsTrigger value="open-orders" className="text-gray-300 data-[state=active]:text-white">
            Lệnh mở
          </TabsTrigger>
          <TabsTrigger value="history" className="text-gray-300 data-[state=active]:text-white">
            Lịch sử
          </TabsTrigger>
        </TabsList>

        <TabsContent value="open-orders" className="mt-3">
          <MobileOpenOrders rows={openOrders} onCancel={cancelOrder} emptyHint="Chưa có lệnh mở" />
        </TabsContent>

        <TabsContent value="history" className="mt-3">
          <MobileOpenOrders rows={history} onCancel={undefined} emptyHint="Chưa có lịch sử" />
        </TabsContent>
      </Tabs>
    </div>
  )
}

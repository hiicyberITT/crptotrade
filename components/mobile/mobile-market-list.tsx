'use client'

import { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Search, Star, TrendingUp, TrendingDown } from 'lucide-react'
import { formatCompactCurrency, formatCurrency } from '@/lib/format'

interface CoinData {
  symbol: string
  name: string
  price: number
  change24h: number
  changePercent24h: number
  volume24h: number
  marketCap: number
  icon: string
}

export function MobileMarketList({
  selectedSymbol = 'BTCUSDT',
  onSelectSymbol = () => {},
}: {
  selectedSymbol?: string
  onSelectSymbol?: (s: string) => void
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'favorites' | 'gainers' | 'losers'>('all')
  const [favorites, setFavorites] = useState<string[]>(['BTCUSDT', 'ETHUSDT'])

  const marketData: CoinData[] = [
    { symbol: 'BTCUSDT', name: 'Bitcoin', price: 40938.69, change24h: -316.64, changePercent24h: -0.75, volume24h: 25190000000, marketCap: 812540000000, icon: '₿' },
    { symbol: 'ETHUSDT', name: 'Ethereum', price: 2708.58, change24h: -103.42, changePercent24h: -3.68, volume24h: 15678900000, marketCap: 325000000000, icon: 'Ξ' },
    { symbol: 'BNBUSDT', name: 'BNB', price: 324.59, change24h: 3.89, changePercent24h: 1.2, volume24h: 1234567000, marketCap: 48000000000, icon: '🔶' },
    { symbol: 'SOLUSDT', name: 'Solana', price: 100.72, change24h: 2.23, changePercent24h: 2.26, volume24h: 987654000, marketCap: 45000000000, icon: '◎' },
    { symbol: 'ADAUSDT', name: 'Cardano', price: 0.505976, change24h: -0.015, changePercent24h: -2.9, volume24h: 456789000, marketCap: 18000000000, icon: '₳' },
  ]

  const filteredMarkets = useMemo(() => {
    const term = searchTerm.toLowerCase()
    let data = marketData.filter(
      (m) => m.symbol.toLowerCase().includes(term) || m.name.toLowerCase().includes(term)
    )
    if (selectedCategory === 'favorites') data = data.filter((m) => favorites.includes(m.symbol))
    if (selectedCategory === 'gainers') data = data.filter((m) => m.changePercent24h > 0)
    if (selectedCategory === 'losers') data = data.filter((m) => m.changePercent24h < 0)
    return data
  }, [searchTerm, favorites, selectedCategory])

  const toggleFavorite = (symbol: string) => {
    setFavorites((prev) => (prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]))
  }

  return (
    <div className="p-4 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Tìm kiếm coin..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-[#0F172A] border-[#1E293B] text-white placeholder-gray-400"
        />
      </div>

      <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-[#111827]">
          <TabsTrigger value="all" className="text-xs text-gray-300 data-[state=active]:text-white">
            Tất cả
          </TabsTrigger>
          <TabsTrigger value="favorites" className="text-xs text-gray-300 data-[state=active]:text-white">
            Yêu thích
          </TabsTrigger>
          <TabsTrigger value="gainers" className="text-xs text-gray-300 data-[state=active]:text-white">
            Tăng
          </TabsTrigger>
          <TabsTrigger value="losers" className="text-xs text-gray-300 data-[state=active]:text-white">
            Giảm
          </TabsTrigger>
        </TabsList>
        <TabsContent value={selectedCategory} />
      </Tabs>

      <div className="space-y-2">
        {filteredMarkets.map((coin) => (
          <Card
            key={coin.symbol}
            className={`bg-[#0F172A] border-[#1E293B] cursor-pointer hover:bg-[#111827] transition-colors ${
              coin.symbol === selectedSymbol ? 'ring-1 ring-cyan-600' : ''
            }`}
            onClick={() => onSelectSymbol(coin.symbol)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                    {coin.icon}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium">{coin.symbol}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(coin.symbol)
                        }}
                        className={`p-1 ${favorites.includes(coin.symbol) ? 'text-yellow-400' : 'text-gray-400'}`}
                        aria-pressed={favorites.includes(coin.symbol)}
                      >
                        <Star className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="text-gray-400 text-sm">{coin.name}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-white font-medium">{formatCurrency(coin.price)}</div>
                  <div
                    className={`text-sm ${
                      coin.changePercent24h >= 0 ? 'text-green-400' : 'text-red-400'
                    } flex items-center justify-end gap-1`}
                  >
                    {coin.changePercent24h >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {coin.changePercent24h >= 0 ? '+' : ''}
                    {coin.changePercent24h.toFixed(2)}%
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Vol 24h: {formatCompactCurrency(coin.volume24h)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-[#0F172A] border-[#1E293B]">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-gray-400 text-sm">Tổng thị trường</div>
              <div className="text-white font-medium">$1.2T</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">24h Volume</div>
              <div className="text-white font-medium">$45.6B</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, Plus, Minus, ArrowUpRight, ArrowDownLeft, Copy, QrCode, Wallet, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'

export function MobileWallet() {
  const [showBalance, setShowBalance] = useState(true)
  const [selectedCoin, setSelectedCoin] = useState('BTC')
  const [depositAmount, setDepositAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawAddress, setWithdrawAddress] = useState('')

  const walletData = {
    totalBalance: 12450.67,
    totalBalanceChange: 2.34,
    coins: [
      {
        symbol: 'BTC',
        name: 'Bitcoin',
        balance: 0.25,
        usdValue: 10425.03,
        change: 0.28,
        icon: '₿'
      },
      {
        symbol: 'ETH',
        name: 'Ethereum',
        balance: 0.75,
        usdValue: 2031.44,
        change: -3.68,
        icon: 'Ξ'
      },
      {
        symbol: 'USDT',
        name: 'Tether',
        balance: 500.00,
        usdValue: 500.00,
        change: 0.00,
        icon: '₮'
      }
    ]
  }

  const toggleBalanceVisibility = () => {
    setShowBalance(!showBalance)
  }

  const handleCoinSelect = (symbol: string) => {
    setSelectedCoin(symbol)
  }

  const handleCopyAddress = () => {
    const address = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
    navigator.clipboard.writeText(address)
    alert('Địa chỉ đã được sao chép!')
  }

  const handleWithdraw = () => {
    if (!withdrawAmount || !withdrawAddress) {
      alert('Vui lòng nhập đầy đủ thông tin')
      return
    }
    
    if (confirm(`Xác nhận rút ${withdrawAmount} ${selectedCoin}?`)) {
      alert('Yêu cầu rút tiền đã được gửi!')
      setWithdrawAmount('')
      setWithdrawAddress('')
    }
  }

  return (
    <div className="p-4 space-y-4">
      {/* Total Balance */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-blue-100 text-sm">Tổng tài sản</div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleBalanceVisibility}
              className="p-1 text-blue-100 hover:text-white"
            >
              {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
          <div className="text-white text-3xl font-bold mb-1">
            {showBalance ? `$${walletData.totalBalance.toLocaleString()}` : '****'}
          </div>
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-4 h-4 text-green-300" />
            <span className="text-green-300 text-sm">
              +{walletData.totalBalanceChange}% (24h)
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button className="bg-green-600 hover:bg-green-700 text-white h-12">
          <Plus className="w-4 h-4 mr-2" />
          Nạp tiền
        </Button>
        <Button variant="outline" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white h-12">
          <Minus className="w-4 h-4 mr-2" />
          Rút tiền
        </Button>
      </div>

      {/* Coin List */}
      <Card className="bg-[#1E293B] border-[#334155]">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-lg">Tài sản</CardTitle>
            <Button variant="ghost" size="sm" className="p-2 text-gray-400">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {walletData.coins.map((coin) => (
            <div
              key={coin.symbol}
              className="flex items-center justify-between p-3 bg-[#334155] rounded-lg cursor-pointer hover:bg-[#475569] transition-colors"
              onClick={() => handleCoinSelect(coin.symbol)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                  {coin.icon}
                </div>
                <div>
                  <div className="text-white font-medium">{coin.symbol}</div>
                  <div className="text-gray-400 text-sm">{coin.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-medium">
                  {showBalance ? coin.balance.toFixed(4) : '****'} {coin.symbol}
                </div>
                <div className="text-gray-400 text-sm">
                  {showBalance ? `$${coin.usdValue.toLocaleString()}` : '****'}
                </div>
                <div className={`text-xs ${coin.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {coin.change >= 0 ? '+' : ''}{coin.change}%
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Deposit/Withdraw Tabs */}
      <Card className="bg-[#1E293B] border-[#334155]">
        <CardContent className="p-0">
          <Tabs defaultValue="deposit" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-[#334155] m-4 mb-0">
              <TabsTrigger value="deposit" className="text-gray-300 data-[state=active]:text-white">
                Nạp tiền
              </TabsTrigger>
              <TabsTrigger value="withdraw" className="text-gray-300 data-[state=active]:text-white">
                Rút tiền
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="deposit" className="p-4 space-y-4">
              {/* Coin Selection */}
              <div className="space-y-2">
                <div className="text-gray-400 text-sm">Chọn coin</div>
                <div className="grid grid-cols-3 gap-2">
                  {walletData.coins.map((coin) => (
                    <Button
                      key={coin.symbol}
                      size="sm"
                      onClick={() => handleCoinSelect(coin.symbol)}
                      className={`${
                        selectedCoin === coin.symbol 
                          ? 'bg-cyan-600 text-white' 
                          : 'bg-[#334155] text-gray-300'
                      }`}
                    >
                      {coin.symbol}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Deposit Address */}
              <div className="space-y-2">
                <div className="text-gray-400 text-sm">Địa chỉ nạp {selectedCoin}</div>
                <div className="bg-[#334155] rounded-lg p-3">
                  <div className="text-white text-sm font-mono break-all mb-2">
                    1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={handleCopyAddress}
                      className="flex-1 bg-[#475569] hover:bg-[#64748b] text-white"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Sao chép
                    </Button>
                    <Button
                      size="sm"
                      className="bg-[#475569] hover:bg-[#64748b] text-white"
                    >
                      <QrCode className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Deposit Instructions */}
              <div className="bg-yellow-600/20 border border-yellow-600 rounded-lg p-3">
                <div className="text-yellow-400 text-sm">
                  ⚠️ Chỉ gửi {selectedCoin} đến địa chỉ này. Gửi coin khác có thể mất vĩnh viễn.
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="withdraw" className="p-4 space-y-4">
              {/* Coin Selection */}
              <div className="space-y-2">
                <div className="text-gray-400 text-sm">Chọn coin</div>
                <div className="grid grid-cols-3 gap-2">
                  {walletData.coins.map((coin) => (
                    <Button
                      key={coin.symbol}
                      size="sm"
                      onClick={() => handleCoinSelect(coin.symbol)}
                      className={`${
                        selectedCoin === coin.symbol 
                          ? 'bg-cyan-600 text-white' 
                          : 'bg-[#334155] text-gray-300'
                      }`}
                    >
                      {coin.symbol}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Withdraw Address */}
              <div className="space-y-2">
                <div className="text-gray-400 text-sm">Địa chỉ nhận</div>
                <Input
                  placeholder="Nhập địa chỉ ví"
                  value={withdrawAddress}
                  onChange={(e) => setWithdrawAddress(e.target.value)}
                  className="bg-[#334155] border-[#475569] text-white"
                />
              </div>

              {/* Withdraw Amount */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-gray-400 text-sm">Số lượng</div>
                  <div className="text-gray-400 text-xs">
                    Khả dụng: {walletData.coins.find(c => c.symbol === selectedCoin)?.balance || 0} {selectedCoin}
                  </div>
                </div>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="bg-[#334155] border-[#475569] text-white"
                />
              </div>

              {/* Withdraw Fee */}
              <div className="bg-[#334155] rounded-lg p-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Phí rút</span>
                  <span className="text-white">0.0005 {selectedCoin}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Nhận được</span>
                  <span className="text-white">
                    {withdrawAmount ? (parseFloat(withdrawAmount) - 0.0005).toFixed(4) : '0.0000'} {selectedCoin}
                  </span>
                </div>
              </div>

              {/* Withdraw Button */}
              <Button
                onClick={handleWithdraw}
                disabled={!withdrawAmount || !withdrawAddress}
                className="w-full bg-red-600 hover:bg-red-700 text-white h-12"
              >
                Rút {selectedCoin}
              </Button>

              {/* Withdraw Warning */}
              <div className="bg-red-600/20 border border-red-600 rounded-lg p-3">
                <div className="text-red-400 text-sm">
                  ⚠️ Kiểm tra kỹ địa chỉ trước khi rút. Giao dịch không thể hoàn tác.
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card className="bg-[#1E293B] border-[#334155]">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg">Lịch sử giao dịch</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { type: 'deposit', coin: 'BTC', amount: '0.025', status: 'completed', time: '2 giờ trước' },
              { type: 'withdraw', coin: 'ETH', amount: '0.15', status: 'pending', time: '1 ngày trước' },
              { type: 'deposit', coin: 'USDT', amount: '500', status: 'completed', time: '2 ngày trước' },
            ].map((tx, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-[#334155] rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    tx.type === 'deposit' ? 'bg-green-600/20' : 'bg-red-600/20'
                  }`}>
                    {tx.type === 'deposit' ? 
                      <ArrowDownLeft className="w-4 h-4 text-green-400" /> : 
                      <ArrowUpRight className="w-4 h-4 text-red-400" />
                    }
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium">
                      {tx.type === 'deposit' ? 'Nạp' : 'Rút'} {tx.coin}
                    </div>
                    <div className="text-gray-400 text-xs">{tx.time}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white text-sm">
                    {tx.type === 'deposit' ? '+' : '-'}{tx.amount} {tx.coin}
                  </div>
                  <Badge className={`text-xs ${
                    tx.status === 'completed' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-yellow-600 text-white'
                  }`}>
                    {tx.status === 'completed' ? 'Hoàn thành' : 'Đang xử lý'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Wallet, Send, Download, Copy, QrCode, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, AlertCircle } from 'lucide-react'

interface WalletBalance {
  currency: string
  symbol: string
  balance: number
  available: number
  locked: number
  usdValue: number
}

interface Transaction {
  id: string
  type: 'deposit' | 'withdrawal' | 'trade'
  currency: string
  amount: number
  status: 'pending' | 'completed' | 'failed'
  txHash?: string
  address?: string
  timestamp: Date
  fee?: number
}

export function WalletManagement() {
  const [selectedCurrency, setSelectedCurrency] = useState('BTC')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawAddress, setWithdrawAddress] = useState('')

  // Mock data
  const balances: WalletBalance[] = [
    {
      currency: 'Bitcoin',
      symbol: 'BTC',
      balance: 1.25678900,
      available: 1.15678900,
      locked: 0.10000000,
      usdValue: 84567.89
    },
    {
      currency: 'US Dollar',
      symbol: 'USD',
      balance: 15678.90,
      available: 14678.90,
      locked: 1000.00,
      usdValue: 15678.90
    },
    {
      currency: 'Ethereum',
      symbol: 'ETH',
      balance: 5.67890123,
      available: 5.67890123,
      locked: 0,
      usdValue: 12456.78
    }
  ]

  const transactions: Transaction[] = [
    {
      id: 'TX001',
      type: 'deposit',
      currency: 'BTC',
      amount: 0.5,
      status: 'completed',
      txHash: '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z',
      address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      timestamp: new Date('2024-01-15T10:30:00'),
      fee: 0.0001
    },
    {
      id: 'TX002',
      type: 'withdrawal',
      currency: 'BTC',
      amount: 0.25,
      status: 'pending',
      address: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
      timestamp: new Date('2024-01-14T15:45:00'),
      fee: 0.0005
    },
    {
      id: 'TX003',
      type: 'trade',
      currency: 'USD',
      amount: 33617.25,
      status: 'completed',
      timestamp: new Date('2024-01-13T09:15:00')
    }
  ]

  const depositAddress = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Hoàn thành</Badge>
      case 'pending':
        return <Badge variant="secondary">Đang xử lý</Badge>
      case 'failed':
        return <Badge variant="destructive">Thất bại</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Show toast notification
  }

  return (
    <div className="space-y-6">
      {/* Wallet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {balances.map((balance) => (
          <Card key={balance.symbol} className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{balance.currency}</h3>
                    <p className="text-sm text-muted-foreground">{balance.symbol}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Tổng số dư:</span>
                  <span className="font-mono font-medium">
                    {balance.balance.toFixed(8)} {balance.symbol}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Khả dụng:</span>
                  <span className="font-mono font-medium text-green-600">
                    {balance.available.toFixed(8)} {balance.symbol}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Đang khóa:</span>
                  <span className="font-mono font-medium text-yellow-600">
                    {balance.locked.toFixed(8)} {balance.symbol}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <span className="text-sm text-muted-foreground">Giá trị USD:</span>
                  <span className="font-semibold text-foreground">
                    ${balance.usdValue.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Wallet Actions */}
      <Tabs defaultValue="deposit" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="deposit">Nạp tiền</TabsTrigger>
          <TabsTrigger value="withdraw">Rút tiền</TabsTrigger>
          <TabsTrigger value="history">Lịch sử</TabsTrigger>
        </TabsList>

        <TabsContent value="deposit">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowDownLeft className="w-5 h-5" />
                Nạp tiền vào ví
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Chọn loại tiền</Label>
                    <select 
                      className="w-full mt-1 p-2 border rounded-md bg-background border-border"
                      value={selectedCurrency}
                      onChange={(e) => setSelectedCurrency(e.target.value)}
                    >
                      <option value="BTC">Bitcoin (BTC)</option>
                      <option value="ETH">Ethereum (ETH)</option>
                      <option value="USD">US Dollar (USD)</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Địa chỉ nạp tiền</Label>
                    <div className="flex gap-2">
                      <Input
                        value={depositAddress}
                        readOnly
                        className="font-mono bg-muted"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(depositAddress)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Chỉ gửi {selectedCurrency} đến địa chỉ này. Gửi các loại tiền khác có thể dẫn đến mất tiền vĩnh viễn.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                      Lưu ý quan trọng:
                    </h4>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                      <li>• Số xác nhận tối thiểu: 6 confirmations</li>
                      <li>• Thời gian xử lý: 10-60 phút</li>
                      <li>• Số tiền tối thiểu: 0.001 {selectedCurrency}</li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-lg">
                  <div className="w-48 h-48 bg-white p-4 rounded-lg shadow-sm mb-4">
                    <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                      <QrCode className="w-16 h-16 text-gray-400" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    Quét mã QR để sao chép địa chỉ ví
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdraw">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5" />
                Rút tiền từ ví
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Chọn loại tiền</Label>
                    <select 
                      className="w-full mt-1 p-2 border rounded-md bg-background border-border"
                      value={selectedCurrency}
                      onChange={(e) => setSelectedCurrency(e.target.value)}
                    >
                      <option value="BTC">Bitcoin (BTC)</option>
                      <option value="ETH">Ethereum (ETH)</option>
                      <option value="USD">US Dollar (USD)</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="withdraw-address">Địa chỉ nhận</Label>
                    <Input
                      id="withdraw-address"
                      placeholder="Nhập địa chỉ ví nhận"
                      value={withdrawAddress}
                      onChange={(e) => setWithdrawAddress(e.target.value)}
                      className="font-mono"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="withdraw-amount">Số lượng</Label>
                    <div className="relative">
                      <Input
                        id="withdraw-amount"
                        type="number"
                        placeholder="0.00000000"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        className="font-mono pr-16"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        {selectedCurrency}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Khả dụng: 1.15678900 {selectedCurrency}</span>
                      <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                        Tối đa
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Phí giao dịch:</span>
                      <span className="font-mono">0.0005 {selectedCurrency}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Số tiền nhận:</span>
                      <span className="font-mono font-medium">
                        {withdrawAmount ? (parseFloat(withdrawAmount) - 0.0005).toFixed(8) : '0.00000000'} {selectedCurrency}
                      </span>
                    </div>
                  </div>
                  
                  <Button className="w-full" disabled={!withdrawAmount || !withdrawAddress}>
                    <Send className="w-4 h-4 mr-2" />
                    Rút tiền
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                      Giới hạn rút tiền:
                    </h4>
                    <div className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                      <div className="flex justify-between">
                        <span>Hàng ngày:</span>
                        <span>10 BTC</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Đã sử dụng:</span>
                        <span>0.25 BTC</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Còn lại:</span>
                        <span className="font-semibold">9.75 BTC</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                      Lưu ý bảo mật:
                    </h4>
                    <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                      <li>• Kiểm tra kỹ địa chỉ nhận trước khi gửi</li>
                      <li>• Giao dịch không thể hoàn tác</li>
                      <li>• Thời gian xử lý: 10-60 phút</li>
                      <li>• Yêu cầu xác thực 2FA</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Lịch sử giao dịch ví
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Thời gian</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>Tiền tệ</TableHead>
                    <TableHead>Số lượng</TableHead>
                    <TableHead>Địa chỉ/TxHash</TableHead>
                    <TableHead>Phí</TableHead>
                    <TableHead>Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-mono">{tx.id}</TableCell>
                      <TableCell className="text-sm">
                        {tx.timestamp.toLocaleString('vi-VN')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {tx.type === 'deposit' ? (
                            <ArrowDownLeft className="w-4 h-4 text-green-500" />
                          ) : tx.type === 'withdrawal' ? (
                            <ArrowUpRight className="w-4 h-4 text-red-500" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4 text-blue-500" />
                          )}
                          <span className="capitalize">
                            {tx.type === 'deposit' ? 'Nạp' : tx.type === 'withdrawal' ? 'Rút' : 'Giao dịch'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{tx.currency}</TableCell>
                      <TableCell className="font-mono">
                        {tx.type === 'deposit' ? '+' : '-'}{tx.amount.toFixed(8)}
                      </TableCell>
                      <TableCell>
                        {tx.txHash ? (
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 font-mono text-xs"
                            onClick={() => copyToClipboard(tx.txHash!)}
                          >
                            {tx.txHash.substring(0, 10)}...
                          </Button>
                        ) : tx.address ? (
                          <span className="font-mono text-xs">
                            {tx.address.substring(0, 10)}...
                          </span>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell className="font-mono">
                        {tx.fee ? `${tx.fee.toFixed(8)} ${tx.currency}` : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(tx.status)}
                          {getStatusBadge(tx.status)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

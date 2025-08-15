'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Download, Filter, Search, TrendingUp, TrendingDown, Clock, DollarSign } from 'lucide-react'

interface Trade {
  id: string
  type: 'buy' | 'sell'
  pair: string
  amount: number
  price: number
  total: number
  fee: number
  status: 'completed' | 'pending' | 'cancelled'
  timestamp: Date
}

interface Order {
  id: string
  type: 'buy' | 'sell'
  orderType: 'market' | 'limit'
  pair: string
  amount: number
  price: number
  filled: number
  remaining: number
  status: 'pending' | 'filled' | 'cancelled' | 'partial'
  timestamp: Date
}

export function TradingHistory() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  // Mock data
  const trades: Trade[] = [
    {
      id: 'T001',
      type: 'buy',
      pair: 'BTC/USD',
      amount: 0.5,
      price: 67234.50,
      total: 33617.25,
      fee: 33.62,
      status: 'completed',
      timestamp: new Date('2024-01-15T10:30:00')
    },
    {
      id: 'T002',
      type: 'sell',
      pair: 'BTC/USD',
      amount: 0.25,
      price: 67890.00,
      total: 16972.50,
      fee: 16.97,
      status: 'completed',
      timestamp: new Date('2024-01-14T15:45:00')
    },
    {
      id: 'T003',
      type: 'buy',
      pair: 'BTC/USD',
      amount: 1.0,
      price: 66500.00,
      total: 66500.00,
      fee: 66.50,
      status: 'completed',
      timestamp: new Date('2024-01-13T09:15:00')
    }
  ]

  const orders: Order[] = [
    {
      id: 'O001',
      type: 'buy',
      orderType: 'limit',
      pair: 'BTC/USD',
      amount: 0.5,
      price: 66000.00,
      filled: 0,
      remaining: 0.5,
      status: 'pending',
      timestamp: new Date('2024-01-15T14:20:00')
    },
    {
      id: 'O002',
      type: 'sell',
      orderType: 'market',
      pair: 'BTC/USD',
      amount: 0.25,
      price: 67890.00,
      filled: 0.25,
      remaining: 0,
      status: 'filled',
      timestamp: new Date('2024-01-14T15:45:00')
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
      case 'filled':
        return <Badge className="bg-green-500">Hoàn thành</Badge>
      case 'pending':
        return <Badge variant="secondary">Đang chờ</Badge>
      case 'cancelled':
        return <Badge variant="destructive">Đã hủy</Badge>
      case 'partial':
        return <Badge variant="outline">Một phần</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTotalProfit = () => {
    return trades.reduce((total, trade) => {
      const profit = trade.type === 'sell' ? trade.total - trade.fee : -(trade.total + trade.fee)
      return total + profit
    }, 0)
  }

  const getTotalFees = () => {
    return trades.reduce((total, trade) => total + trade.fee, 0)
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tổng giao dịch</p>
                <p className="text-2xl font-bold">{trades.length}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tổng khối lượng</p>
                <p className="text-2xl font-bold">
                  {trades.reduce((sum, trade) => sum + trade.total, 0).toLocaleString()} USD
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tổng phí</p>
                <p className="text-2xl font-bold text-red-500">
                  ${getTotalFees().toFixed(2)}
                </p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">P&L</p>
                <p className={`text-2xl font-bold ${getTotalProfit() >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {getTotalProfit() >= 0 ? '+' : ''}${getTotalProfit().toFixed(2)}
                </p>
              </div>
              {getTotalProfit() >= 0 ? (
                <TrendingUp className="w-8 h-8 text-green-500" />
              ) : (
                <TrendingDown className="w-8 h-8 text-red-500" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-48"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
                <SelectItem value="pending">Đang chờ</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="buy">Mua</SelectItem>
                <SelectItem value="sell">Bán</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Chọn ngày
            </Button>
            
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Xuất Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* History Tables */}
      <Tabs defaultValue="trades" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trades">Lịch sử giao dịch</TabsTrigger>
          <TabsTrigger value="orders">Lệnh đặt</TabsTrigger>
        </TabsList>

        <TabsContent value="trades">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Lịch sử giao dịch
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Thời gian</TableHead>
                    <TableHead>Cặp</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>Số lượng</TableHead>
                    <TableHead>Giá</TableHead>
                    <TableHead>Tổng</TableHead>
                    <TableHead>Phí</TableHead>
                    <TableHead>Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trades.map((trade) => (
                    <TableRow key={trade.id}>
                      <TableCell className="font-mono">{trade.id}</TableCell>
                      <TableCell className="text-sm">
                        {trade.timestamp.toLocaleString('vi-VN')}
                      </TableCell>
                      <TableCell className="font-medium">{trade.pair}</TableCell>
                      <TableCell>
                        <Badge variant={trade.type === 'buy' ? 'default' : 'secondary'}>
                          {trade.type === 'buy' ? 'MUA' : 'BÁN'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono">{trade.amount} BTC</TableCell>
                      <TableCell className="font-mono">${trade.price.toLocaleString()}</TableCell>
                      <TableCell className="font-mono">${trade.total.toLocaleString()}</TableCell>
                      <TableCell className="font-mono text-red-500">${trade.fee.toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(trade.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Lệnh đặt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Thời gian</TableHead>
                    <TableHead>Cặp</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>Loại lệnh</TableHead>
                    <TableHead>Số lượng</TableHead>
                    <TableHead>Giá</TableHead>
                    <TableHead>Đã khớp</TableHead>
                    <TableHead>Còn lại</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono">{order.id}</TableCell>
                      <TableCell className="text-sm">
                        {order.timestamp.toLocaleString('vi-VN')}
                      </TableCell>
                      <TableCell className="font-medium">{order.pair}</TableCell>
                      <TableCell>
                        <Badge variant={order.type === 'buy' ? 'default' : 'secondary'}>
                          {order.type === 'buy' ? 'MUA' : 'BÁN'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {order.orderType === 'market' ? 'Thị trường' : 'Giới hạn'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono">{order.amount} BTC</TableCell>
                      <TableCell className="font-mono">${order.price.toLocaleString()}</TableCell>
                      <TableCell className="font-mono">{order.filled} BTC</TableCell>
                      <TableCell className="font-mono">{order.remaining} BTC</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>
                        {order.status === 'pending' && (
                          <Button variant="outline" size="sm">
                            Hủy
                          </Button>
                        )}
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

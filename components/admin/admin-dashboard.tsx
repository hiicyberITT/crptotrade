'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, DollarSign, TrendingUp, AlertTriangle, Shield, Activity, Database, Settings } from 'lucide-react'

interface AdminStats {
  totalUsers: number
  totalVolume: number
  totalOrders: number
  activeUsers: number
  pendingWithdrawals: number
  systemHealth: 'healthy' | 'warning' | 'critical'
}

interface SystemLog {
  id: string
  timestamp: Date
  level: 'info' | 'warning' | 'error'
  message: string
  module: string
}

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 1247,
    totalVolume: 45678900,
    totalOrders: 8934,
    activeUsers: 234,
    pendingWithdrawals: 12,
    systemHealth: 'healthy'
  })

  const [logs, setLogs] = useState<SystemLog[]>([
    {
      id: '1',
      timestamp: new Date(),
      level: 'info',
      message: 'New user registration: user@example.com',
      module: 'Auth'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 300000),
      level: 'warning',
      message: 'High trading volume detected',
      module: 'Trading'
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 600000),
      level: 'error',
      message: 'Failed withdrawal attempt: insufficient funds',
      module: 'Wallet'
    }
  ])

  const recentOrders = [
    { id: '1', user: 'user1@example.com', type: 'buy', amount: 0.5, price: 67234, status: 'filled' },
    { id: '2', user: 'user2@example.com', type: 'sell', amount: 0.25, price: 67230, status: 'pending' },
    { id: '3', user: 'user3@example.com', type: 'buy', amount: 1.0, price: 67240, status: 'filled' }
  ]

  const systemMetrics = [
    { name: 'CPU Usage', value: '45%', status: 'healthy' },
    { name: 'Memory Usage', value: '67%', status: 'warning' },
    { name: 'Database Load', value: '23%', status: 'healthy' },
    { name: 'API Response Time', value: '120ms', status: 'healthy' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Quản lý hệ thống sàn giao dịch BTC</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={stats.systemHealth === 'healthy' ? 'default' : 'destructive'}>
            <Shield className="w-3 h-3 mr-1" />
            {stats.systemHealth === 'healthy' ? 'System Healthy' : 'System Issues'}
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                <p className="text-xs text-green-500">+12% from last month</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Volume</p>
                <p className="text-2xl font-bold">${stats.totalVolume.toLocaleString()}</p>
                <p className="text-xs text-green-500">+8% from last week</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">{stats.activeUsers}</p>
                <p className="text-xs text-blue-500">Currently online</p>
              </div>
              <Activity className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Withdrawals</p>
                <p className="text-2xl font-bold">{stats.pendingWithdrawals}</p>
                <p className="text-xs text-yellow-500">Requires attention</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">Recent Orders</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="system">System Health</TabsTrigger>
          <TabsTrigger value="logs">System Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Recent Trading Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono">{order.id}</TableCell>
                      <TableCell>{order.user}</TableCell>
                      <TableCell>
                        <Badge variant={order.type === 'buy' ? 'default' : 'secondary'}>
                          {order.type.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>{order.amount} BTC</TableCell>
                      <TableCell>${order.price.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={order.status === 'filled' ? 'default' : 'outline'}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Button>Add User</Button>
                  <Button variant="outline">Export Users</Button>
                  <Button variant="outline">Send Notification</Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  User management features would be implemented here
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>System Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemMetrics.map((metric, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{metric.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">{metric.value}</span>
                        <Badge variant={metric.status === 'healthy' ? 'default' : 'destructive'}>
                          {metric.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Database Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Connection Status</span>
                    <Badge variant="default">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Query Performance</span>
                    <span className="font-mono text-sm">95ms avg</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Storage Used</span>
                    <span className="font-mono text-sm">2.4GB / 10GB</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Database className="w-4 h-4 mr-2" />
                    Optimize Database
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>System Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-center gap-4 p-3 border rounded-lg">
                    <Badge variant={
                      log.level === 'error' ? 'destructive' : 
                      log.level === 'warning' ? 'secondary' : 'default'
                    }>
                      {log.level.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-muted-foreground font-mono">
                      {log.timestamp.toLocaleTimeString()}
                    </span>
                    <span className="text-sm font-medium">[{log.module}]</span>
                    <span className="text-sm flex-1">{log.message}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

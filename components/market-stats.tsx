'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Activity, DollarSign, Users } from 'lucide-react'

export function MarketStats() {
  const stats = [
    {
      title: "Market Cap",
      value: "$1.32T",
      change: "+2.34%",
      isPositive: true,
      icon: DollarSign
    },
    {
      title: "24h Volume",
      value: "$28.5B",
      change: "+12.45%",
      isPositive: true,
      icon: Activity
    },
    {
      title: "Active Traders",
      value: "45,678",
      change: "+5.67%",
      isPositive: true,
      icon: Users
    },
    {
      title: "Fear & Greed",
      value: "72",
      change: "Greed",
      isPositive: true,
      icon: TrendingUp
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <div className={`flex items-center gap-1 text-sm ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {stat.change}
                </div>
              </div>
              <div className={`p-3 rounded-full ${stat.isPositive ? 'bg-green-500/10 dark:bg-green-500/20' : 'bg-red-500/10 dark:bg-red-500/20'}`}>
                <stat.icon className={`w-6 h-6 ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

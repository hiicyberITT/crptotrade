import { NextResponse } from 'next/server'
import { getOrderBook, getRecentTrades, getCurrentPrice } from '@/lib/trading-engine'

export async function GET() {
  try {
    const [orderBook, recentTrades, currentPrice] = await Promise.all([
      getOrderBook(),
      getRecentTrades(20),
      getCurrentPrice()
    ])

    return NextResponse.json({
      orderBook,
      recentTrades,
      currentPrice,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Market data error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

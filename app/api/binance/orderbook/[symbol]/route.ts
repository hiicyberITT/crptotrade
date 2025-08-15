import { NextRequest, NextResponse } from 'next/server'
import { generateTickerData } from '@/lib/binance-api'

export async function GET(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  try {
    const { symbol } = params
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '100')
    
    // Generate realistic order book data
    const ticker = generateTickerData(symbol.toUpperCase())
    const midPrice = parseFloat(ticker.lastPrice)
    
    const bids: [string, string][] = []
    const asks: [string, string][] = []
    
    // Generate bids (buy orders) - prices below current price
    for (let i = 0; i < Math.min(limit, 50); i++) {
      const price = midPrice * (1 - (i + 1) * 0.0005) // 0.05% steps
      const quantity = Math.random() * 10 + 0.1
      bids.push([price.toFixed(8), quantity.toFixed(8)])
    }
    
    // Generate asks (sell orders) - prices above current price
    for (let i = 0; i < Math.min(limit, 50); i++) {
      const price = midPrice * (1 + (i + 1) * 0.0005) // 0.05% steps
      const quantity = Math.random() * 10 + 0.1
      asks.push([price.toFixed(8), quantity.toFixed(8)])
    }
    
    return NextResponse.json({
      success: true,
      symbol: symbol.toUpperCase(),
      lastUpdateId: Date.now(),
      bids,
      asks,
      timestamp: Date.now(),
      source: 'generated'
    })
  } catch (error) {
    console.error('OrderBook API error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to get order book data',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

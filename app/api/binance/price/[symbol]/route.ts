import { NextRequest, NextResponse } from 'next/server'
import { generateTickerData } from '@/lib/binance-api'

export async function GET(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  try {
    const { symbol } = params
    
    // Generate realistic ticker data
    const ticker = generateTickerData(symbol.toUpperCase())
    
    return NextResponse.json({
      success: true,
      symbol: ticker.symbol,
      price: parseFloat(ticker.lastPrice),
      priceChange: parseFloat(ticker.priceChange),
      priceChangePercent: parseFloat(ticker.priceChangePercent),
      high24h: parseFloat(ticker.highPrice),
      low24h: parseFloat(ticker.lowPrice),
      volume24h: parseFloat(ticker.volume),
      quoteVolume24h: parseFloat(ticker.quoteVolume),
      openPrice: parseFloat(ticker.openPrice),
      timestamp: Date.now(),
      source: 'generated'
    })
  } catch (error) {
    console.error('Price API error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to get price data',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

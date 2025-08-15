import { NextRequest, NextResponse } from 'next/server'
import { generateMarketData } from '@/lib/binance-api'

export async function GET(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  try {
    const { symbol } = params
    const { searchParams } = new URL(request.url)
    const interval = searchParams.get('interval') || '1h'
    const limit = parseInt(searchParams.get('limit') || '500')

    // Always use fallback data to avoid external API issues
    const data = generateMarketData(symbol.toUpperCase(), interval, limit)
    
    return NextResponse.json({
      success: true,
      data,
      symbol: symbol.toUpperCase(),
      interval,
      timestamp: Date.now(),
      source: 'generated'
    })
  } catch (error) {
    console.error('Klines API error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to generate klines data',
      message: error instanceof Error ? error.message : 'Unknown error',
      symbol: params.symbol.toUpperCase(),
      timestamp: Date.now()
    }, { status: 500 })
  }
}

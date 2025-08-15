import { NextRequest, NextResponse } from 'next/server'
import { generateTickerData } from '@/lib/binance-api'

export async function GET(request: NextRequest) {
  try {
    const symbols = [
      'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'ADAUSDT',
      'AVAXUSDT', 'DOTUSDT', 'MATICUSDT', 'LINKUSDT', 'UNIUSDT',
      'LTCUSDT', 'ATOMUSDT', 'XRPUSDT', 'DOGEUSDT', 'SHIBUSDT',
      'TRXUSDT', 'NEARUSDT', 'FTMUSDT', 'ALGOUSDT', 'VETUSDT'
    ]
    
    const marketData = symbols.map((symbol, index) => {
      const ticker = generateTickerData(symbol)
      
      return {
        id: symbol.toLowerCase().replace('usdt', ''),
        symbol: symbol.replace('USDT', ''),
        name: getSymbolName(symbol.replace('USDT', '')),
        price: parseFloat(ticker.lastPrice),
        change24h: parseFloat(ticker.priceChange),
        changePercent24h: parseFloat(ticker.priceChangePercent),
        volume24h: parseFloat(ticker.volume),
        quoteVolume24h: parseFloat(ticker.quoteVolume),
        high24h: parseFloat(ticker.highPrice),
        low24h: parseFloat(ticker.lowPrice),
        marketCap: parseFloat(ticker.lastPrice) * getEstimatedSupply(symbol.replace('USDT', '')),
        rank: index + 1,
        icon: getSymbolIcon(symbol.replace('USDT', ''))
      }
    })
    
    return NextResponse.json({
      success: true,
      data: marketData,
      timestamp: Date.now(),
      source: 'generated'
    })
  } catch (error) {
    console.error('Market API error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to get market data',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

function getSymbolName(symbol: string): string {
  const names: { [key: string]: string } = {
    'BTC': 'Bitcoin',
    'ETH': 'Ethereum',
    'BNB': 'BNB',
    'SOL': 'Solana',
    'ADA': 'Cardano',
    'AVAX': 'Avalanche',
    'DOT': 'Polkadot',
    'MATIC': 'Polygon',
    'LINK': 'Chainlink',
    'UNI': 'Uniswap',
    'LTC': 'Litecoin',
    'ATOM': 'Cosmos',
    'XRP': 'XRP',
    'DOGE': 'Dogecoin',
    'SHIB': 'Shiba Inu',
    'TRX': 'TRON',
    'NEAR': 'NEAR Protocol',
    'FTM': 'Fantom',
    'ALGO': 'Algorand',
    'VET': 'VeChain'
  }
  return names[symbol] || symbol
}

function getSymbolIcon(symbol: string): string {
  const icons: { [key: string]: string } = {
    'BTC': '₿',
    'ETH': 'Ξ',
    'BNB': '🔶',
    'SOL': '◎',
    'ADA': '₳',
    'AVAX': '🔺',
    'DOT': '●',
    'MATIC': '⬟',
    'LINK': '🔗',
    'UNI': '🦄',
    'LTC': 'Ł',
    'ATOM': '⚛',
    'XRP': '◉',
    'DOGE': '🐕',
    'SHIB': '🐶',
    'TRX': '⚡',
    'NEAR': '🌐',
    'FTM': '👻',
    'ALGO': '△',
    'VET': '⚡'
  }
  return icons[symbol] || '🪙'
}

function getEstimatedSupply(symbol: string): number {
  const supplies: { [key: string]: number } = {
    'BTC': 19700000,
    'ETH': 120280000,
    'BNB': 153856150,
    'SOL': 435000000,
    'ADA': 35000000000,
    'AVAX': 390000000,
    'DOT': 1310000000,
    'MATIC': 9200000000,
    'LINK': 570000000,
    'UNI': 753000000,
    'LTC': 74700000,
    'ATOM': 390000000,
    'XRP': 55000000000,
    'DOGE': 142000000000,
    'SHIB': 589000000000000,
    'TRX': 89000000000,
    'NEAR': 1070000000,
    'FTM': 2800000000,
    'ALGO': 7800000000,
    'VET': 72700000000
  }
  return supplies[symbol] || 1000000000
}

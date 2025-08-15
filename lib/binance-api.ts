export interface KlineData {
  openTime: number
  open: string
  high: string
  low: string
  close: string
  volume: string
  closeTime: number
  quoteAssetVolume: string
  numberOfTrades: number
  takerBuyBaseAssetVolume: string
  takerBuyQuoteAssetVolume: string
}

export interface TickerData {
  symbol: string
  priceChange: string
  priceChangePercent: string
  weightedAvgPrice: string
  prevClosePrice: string
  lastPrice: string
  lastQty: string
  bidPrice: string
  askPrice: string
  openPrice: string
  highPrice: string
  lowPrice: string
  volume: string
  quoteVolume: string
  openTime: number
  closeTime: number
  firstId: number
  lastId: number
  count: number
}

export interface OrderBookData {
  lastUpdateId: number
  bids: [string, string][]
  asks: [string, string][]
}

// Generate realistic market data
export function generateMarketData(symbol: string, interval: string, limit: number = 500): KlineData[] {
  const data: KlineData[] = []
  const now = Date.now()
  
  // Get interval in milliseconds
  const getIntervalMs = (interval: string): number => {
    const intervals: { [key: string]: number } = {
      '1m': 60 * 1000,
      '5m': 5 * 60 * 1000,
      '15m': 15 * 60 * 1000,
      '1h': 60 * 60 * 1000,
      '4h': 4 * 60 * 60 * 1000,
      '1d': 24 * 60 * 60 * 1000,
      '1w': 7 * 24 * 60 * 60 * 1000
    }
    return intervals[interval] || intervals['1h']
  }

  const intervalMs = getIntervalMs(interval)
  
  // Base prices for different symbols
  const basePrices: { [key: string]: number } = {
    'BTCUSDT': 43500,
    'ETHUSDT': 2650,
    'BNBUSDT': 315,
    'SOLUSDT': 98,
    'ADAUSDT': 0.48,
    'AVAXUSDT': 38,
    'DOTUSDT': 7.2,
    'MATICUSDT': 0.85,
    'LINKUSDT': 14.5,
    'UNIUSDT': 6.8
  }
  
  let currentPrice = basePrices[symbol] || 100
  
  for (let i = limit - 1; i >= 0; i--) {
    const openTime = now - (i * intervalMs)
    const closeTime = openTime + intervalMs - 1
    
    // Generate realistic price movement
    const volatility = 0.02 // 2% volatility
    const trend = Math.sin(i / 20) * 0.001 // Slight trending
    const randomChange = (Math.random() - 0.5) * volatility + trend
    
    const open = currentPrice
    const close = open * (1 + randomChange)
    const high = Math.max(open, close) * (1 + Math.random() * 0.01)
    const low = Math.min(open, close) * (1 - Math.random() * 0.01)
    
    // Generate volume (higher volume during price movements)
    const priceChangePercent = Math.abs((close - open) / open)
    const baseVolume = Math.random() * 50 + 25
    const volume = baseVolume * (1 + priceChangePercent * 10)
    
    const quoteVolume = volume * ((open + close) / 2)
    
    data.push({
      openTime,
      open: open.toFixed(8),
      high: high.toFixed(8),
      low: low.toFixed(8),
      close: close.toFixed(8),
      volume: volume.toFixed(8),
      closeTime,
      quoteAssetVolume: quoteVolume.toFixed(8),
      numberOfTrades: Math.floor(Math.random() * 1000) + 100,
      takerBuyBaseAssetVolume: (volume * 0.6).toFixed(8),
      takerBuyQuoteAssetVolume: (quoteVolume * 0.6).toFixed(8)
    })
    
    currentPrice = close
  }
  
  return data
}

export function generateTickerData(symbol: string): TickerData {
  const data = generateMarketData(symbol, '1h', 24)
  const latest = data[data.length - 1]
  const previous = data[data.length - 2]
  
  const priceChange = parseFloat(latest.close) - parseFloat(previous.close)
  const priceChangePercent = (priceChange / parseFloat(previous.close)) * 100
  
  return {
    symbol,
    priceChange: priceChange.toFixed(8),
    priceChangePercent: priceChangePercent.toFixed(2),
    weightedAvgPrice: latest.close,
    prevClosePrice: previous.close,
    lastPrice: latest.close,
    lastQty: '0.1',
    bidPrice: (parseFloat(latest.close) * 0.999).toFixed(8),
    askPrice: (parseFloat(latest.close) * 1.001).toFixed(8),
    openPrice: data[0].open,
    highPrice: Math.max(...data.map(d => parseFloat(d.high))).toFixed(8),
    lowPrice: Math.min(...data.map(d => parseFloat(d.low))).toFixed(8),
    volume: data.reduce((sum, d) => sum + parseFloat(d.volume), 0).toFixed(8),
    quoteVolume: data.reduce((sum, d) => sum + parseFloat(d.quoteAssetVolume), 0).toFixed(8),
    openTime: data[0].openTime,
    closeTime: latest.closeTime,
    firstId: 1,
    lastId: 1000,
    count: data.length
  }
}

export class BinanceAPI {
  private baseUrl = 'https://api.binance.com/api/v3'

  async getKlines(symbol: string, interval: string, limit: number = 500): Promise<KlineData[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      )
      
      if (!response.ok) {
        console.warn(`Binance API returned ${response.status}, using fallback data`)
        return generateMarketData(symbol, interval, limit)
      }
      
      const data = await response.json()
      
      return data.map((kline: any[]) => ({
        openTime: kline[0],
        open: kline[1],
        high: kline[2],
        low: kline[3],
        close: kline[4],
        volume: kline[5],
        closeTime: kline[6],
        quoteAssetVolume: kline[7],
        numberOfTrades: kline[8],
        takerBuyBaseAssetVolume: kline[9],
        takerBuyQuoteAssetVolume: kline[10]
      }))
    } catch (error) {
      console.warn('Binance API error, using fallback data:', error)
      return generateMarketData(symbol, interval, limit)
    }
  }

  async getTicker24hr(symbol?: string): Promise<TickerData | TickerData[]> {
    try {
      const url = symbol 
        ? `${this.baseUrl}/ticker/24hr?symbol=${symbol}`
        : `${this.baseUrl}/ticker/24hr`
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        console.warn(`Binance API returned ${response.status}, using fallback data`)
        if (symbol) {
          return generateTickerData(symbol)
        } else {
          const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'ADAUSDT']
          return symbols.map(s => generateTickerData(s))
        }
      }
      
      return await response.json()
    } catch (error) {
      console.warn('Binance API error, using fallback data:', error)
      if (symbol) {
        return generateTickerData(symbol)
      } else {
        const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'ADAUSDT']
        return symbols.map(s => generateTickerData(s))
      }
    }
  }

  async getOrderBook(symbol: string, limit: number = 100): Promise<OrderBookData> {
    try {
      const response = await fetch(
        `${this.baseUrl}/depth?symbol=${symbol}&limit=${limit}`,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      )
      
      if (!response.ok) {
        console.warn(`Binance API returned ${response.status}, using fallback data`)
        return this.generateFallbackOrderBook(symbol)
      }
      
      return await response.json()
    } catch (error) {
      console.warn('Binance API error, using fallback data:', error)
      return this.generateFallbackOrderBook(symbol)
    }
  }

  private generateFallbackOrderBook(symbol: string): OrderBookData {
    const ticker = generateTickerData(symbol)
    const midPrice = parseFloat(ticker.lastPrice)
    
    const bids: [string, string][] = []
    const asks: [string, string][] = []
    
    // Generate realistic order book
    for (let i = 0; i < 20; i++) {
      const bidPrice = midPrice * (1 - (i + 1) * 0.001)
      const askPrice = midPrice * (1 + (i + 1) * 0.001)
      const bidQty = Math.random() * 10 + 1
      const askQty = Math.random() * 10 + 1
      
      bids.push([bidPrice.toFixed(8), bidQty.toFixed(8)])
      asks.push([askPrice.toFixed(8), askQty.toFixed(8)])
    }
    
    return {
      lastUpdateId: Date.now(),
      bids,
      asks
    }
  }

  async getPrice(symbol: string): Promise<{ symbol: string; price: string }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/ticker/price?symbol=${symbol}`,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      )
      
      if (!response.ok) {
        console.warn(`Binance API returned ${response.status}, using fallback data`)
        const ticker = generateTickerData(symbol)
        return { symbol, price: ticker.lastPrice }
      }
      
      return await response.json()
    } catch (error) {
      console.warn('Binance API error, using fallback data:', error)
      const ticker = generateTickerData(symbol)
      return { symbol, price: ticker.lastPrice }
    }
  }
}

export const binanceAPI = new BinanceAPI()

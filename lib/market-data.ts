export interface CoinData {
  symbol: string
  name: string
  price: number
  change24h: number
  changePercent24h: number
  volume24h: number
  marketCap: number
  icon: string
  rank: number
  supply: number
  maxSupply?: number
  high24h?: number
  low24h?: number
}

export const BINANCE_COINS: CoinData[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 67234.50,
    change24h: 1567.89,
    changePercent24h: 2.39,
    volume24h: 28500000000,
    marketCap: 1320000000000,
    icon: '₿',
    rank: 1,
    supply: 19700000,
    maxSupply: 21000000,
    high24h: 68500.00,
    low24h: 65800.00
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    price: 3456.78,
    change24h: -89.12,
    changePercent24h: -2.51,
    volume24h: 15600000000,
    marketCap: 415000000000,
    icon: 'Ξ',
    rank: 2,
    supply: 120280000,
    high24h: 3520.00,
    low24h: 3380.00
  },
  {
    symbol: 'BNB',
    name: 'BNB',
    price: 312.45,
    change24h: 12.34,
    changePercent24h: 4.12,
    volume24h: 1200000000,
    marketCap: 48000000000,
    icon: '🔶',
    rank: 3,
    supply: 153856150,
    maxSupply: 200000000
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    price: 98.76,
    change24h: -3.21,
    changePercent24h: -3.15,
    volume24h: 2100000000,
    marketCap: 43000000000,
    icon: '◎',
    rank: 4,
    supply: 435000000
  },
  {
    symbol: 'ADA',
    name: 'Cardano',
    price: 0.4567,
    change24h: 0.0234,
    changePercent24h: 5.41,
    volume24h: 890000000,
    marketCap: 16000000000,
    icon: '₳',
    rank: 5,
    supply: 35000000000,
    maxSupply: 45000000000
  },
  {
    symbol: 'AVAX',
    name: 'Avalanche',
    price: 34.56,
    change24h: 1.23,
    changePercent24h: 3.69,
    volume24h: 567000000,
    marketCap: 13500000000,
    icon: '🔺',
    rank: 6,
    supply: 390000000,
    maxSupply: 720000000
  },
  {
    symbol: 'DOT',
    name: 'Polkadot',
    price: 6.78,
    change24h: -0.34,
    changePercent24h: -4.78,
    volume24h: 234000000,
    marketCap: 8900000000,
    icon: '●',
    rank: 7,
    supply: 1310000000
  },
  {
    symbol: 'MATIC',
    name: 'Polygon',
    price: 0.8901,
    change24h: 0.0567,
    changePercent24h: 6.81,
    volume24h: 456000000,
    marketCap: 8200000000,
    icon: '⬟',
    rank: 8,
    supply: 9200000000,
    maxSupply: 10000000000
  },
  {
    symbol: 'LINK',
    name: 'Chainlink',
    price: 14.23,
    change24h: 0.89,
    changePercent24h: 6.67,
    volume24h: 678000000,
    marketCap: 8100000000,
    icon: '🔗',
    rank: 9,
    supply: 570000000,
    maxSupply: 1000000000
  },
  {
    symbol: 'UNI',
    name: 'Uniswap',
    price: 7.45,
    change24h: -0.23,
    changePercent24h: -2.99,
    volume24h: 123000000,
    marketCap: 5600000000,
    icon: '🦄',
    rank: 10,
    supply: 753000000,
    maxSupply: 1000000000
  },
  {
    symbol: 'LTC',
    name: 'Litecoin',
    price: 89.12,
    change24h: 2.34,
    changePercent24h: 2.70,
    volume24h: 890000000,
    marketCap: 6700000000,
    icon: 'Ł',
    rank: 11,
    supply: 74700000,
    maxSupply: 84000000
  },
  {
    symbol: 'ATOM',
    name: 'Cosmos',
    price: 9.87,
    change24h: 0.45,
    changePercent24h: 4.78,
    volume24h: 234000000,
    marketCap: 3800000000,
    icon: '⚛',
    rank: 12,
    supply: 390000000
  },
  {
    symbol: 'XRP',
    name: 'XRP',
    price: 0.5234,
    change24h: -0.0123,
    changePercent24h: -2.30,
    volume24h: 1200000000,
    marketCap: 29000000000,
    icon: '◉',
    rank: 13,
    supply: 55000000000,
    maxSupply: 100000000000
  },
  {
    symbol: 'DOGE',
    name: 'Dogecoin',
    price: 0.0789,
    change24h: 0.0034,
    changePercent24h: 4.50,
    volume24h: 567000000,
    marketCap: 11200000000,
    icon: '🐕',
    rank: 14,
    supply: 142000000000
  },
  {
    symbol: 'SHIB',
    name: 'Shiba Inu',
    price: 0.00002345,
    change24h: 0.00000123,
    changePercent24h: 5.54,
    volume24h: 345000000,
    marketCap: 13800000000,
    icon: '🐶',
    rank: 15,
    supply: 589000000000000
  },
  {
    symbol: 'TRX',
    name: 'TRON',
    price: 0.1023,
    change24h: 0.0045,
    changePercent24h: 4.60,
    volume24h: 234000000,
    marketCap: 9100000000,
    icon: '⚡',
    rank: 16,
    supply: 89000000000
  },
  {
    symbol: 'NEAR',
    name: 'NEAR Protocol',
    price: 3.45,
    change24h: 0.12,
    changePercent24h: 3.61,
    volume24h: 123000000,
    marketCap: 3700000000,
    icon: '🌐',
    rank: 17,
    supply: 1070000000
  },
  {
    symbol: 'FTM',
    name: 'Fantom',
    price: 0.4567,
    change24h: 0.0234,
    changePercent24h: 5.41,
    volume24h: 89000000,
    marketCap: 1280000000,
    icon: '👻',
    rank: 18,
    supply: 2800000000,
    maxSupply: 3175000000
  },
  {
    symbol: 'ALGO',
    name: 'Algorand',
    price: 0.1789,
    change24h: 0.0089,
    changePercent24h: 5.24,
    volume24h: 67000000,
    marketCap: 1400000000,
    icon: '△',
    rank: 19,
    supply: 7800000000,
    maxSupply: 10000000000
  },
  {
    symbol: 'VET',
    name: 'VeChain',
    price: 0.0234,
    change24h: 0.0012,
    changePercent24h: 5.41,
    volume24h: 45000000,
    marketCap: 1700000000,
    icon: '⚡',
    rank: 20,
    supply: 72700000000,
    maxSupply: 86700000000
  }
]

export const FALLBACK_COINS: CoinData[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 67234.50,
    change24h: 1567.89,
    changePercent24h: 2.39,
    volume24h: 28500000000,
    marketCap: 1320000000000,
    icon: '₿',
    rank: 1,
    supply: 19700000,
    maxSupply: 21000000,
    high24h: 68500.00,
    low24h: 65800.00
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    price: 3456.78,
    change24h: -89.12,
    changePercent24h: -2.51,
    volume24h: 15600000000,
    marketCap: 415000000000,
    icon: 'Ξ',
    rank: 2,
    supply: 120280000,
    high24h: 3520.00,
    low24h: 3380.00
  },
  {
    symbol: 'BNB',
    name: 'BNB',
    price: 312.45,
    change24h: 12.34,
    changePercent24h: 4.12,
    volume24h: 1200000000,
    marketCap: 48000000000,
    icon: '🔶',
    rank: 3,
    supply: 153856150,
    maxSupply: 200000000,
    high24h: 325.00,
    low24h: 300.00
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    price: 98.76,
    change24h: -3.21,
    changePercent24h: -3.15,
    volume24h: 2100000000,
    marketCap: 43000000000,
    icon: '◎',
    rank: 4,
    supply: 435000000,
    high24h: 102.00,
    low24h: 95.00
  },
  {
    symbol: 'ADA',
    name: 'Cardano',
    price: 0.4567,
    change24h: 0.0234,
    changePercent24h: 5.41,
    volume24h: 890000000,
    marketCap: 16000000000,
    icon: '₳',
    rank: 5,
    supply: 35000000000,
    maxSupply: 45000000000,
    high24h: 0.4700,
    low24h: 0.4400
  },
  {
    symbol: 'AVAX',
    name: 'Avalanche',
    price: 34.56,
    change24h: 1.23,
    changePercent24h: 3.69,
    volume24h: 567000000,
    marketCap: 13500000000,
    icon: '🔺',
    rank: 6,
    supply: 390000000,
    maxSupply: 720000000,
    high24h: 35.80,
    low24h: 33.30
  },
  {
    symbol: 'DOT',
    name: 'Polkadot',
    price: 6.78,
    change24h: -0.34,
    changePercent24h: -4.78,
    volume24h: 234000000,
    marketCap: 8900000000,
    icon: '●',
    rank: 7,
    supply: 1310000000,
    high24h: 7.10,
    low24h: 6.40
  },
  {
    symbol: 'MATIC',
    name: 'Polygon',
    price: 0.8901,
    change24h: 0.0567,
    changePercent24h: 6.81,
    volume24h: 456000000,
    marketCap: 8200000000,
    icon: '⬟',
    rank: 8,
    supply: 9200000000,
    maxSupply: 10000000000,
    high24h: 0.9200,
    low24h: 0.8600
  },
  {
    symbol: 'LINK',
    name: 'Chainlink',
    price: 14.23,
    change24h: 0.89,
    changePercent24h: 6.67,
    volume24h: 678000000,
    marketCap: 8100000000,
    icon: '🔗',
    rank: 9,
    supply: 570000000,
    maxSupply: 1000000000,
    high24h: 14.80,
    low24h: 13.70
  },
  {
    symbol: 'UNI',
    name: 'Uniswap',
    price: 7.45,
    change24h: -0.23,
    changePercent24h: -2.99,
    volume24h: 123000000,
    marketCap: 5600000000,
    icon: '🦄',
    rank: 10,
    supply: 753000000,
    maxSupply: 1000000000,
    high24h: 7.70,
    low24h: 7.20
  },
  {
    symbol: 'LTC',
    name: 'Litecoin',
    price: 89.12,
    change24h: 2.34,
    changePercent24h: 2.70,
    volume24h: 890000000,
    marketCap: 6700000000,
    icon: 'Ł',
    rank: 11,
    supply: 74700000,
    maxSupply: 84000000,
    high24h: 91.50,
    low24h: 86.80
  },
  {
    symbol: 'ATOM',
    name: 'Cosmos',
    price: 9.87,
    change24h: 0.45,
    changePercent24h: 4.78,
    volume24h: 234000000,
    marketCap: 3800000000,
    icon: '⚛',
    rank: 12,
    supply: 390000000,
    high24h: 10.30,
    low24h: 9.40
  },
  {
    symbol: 'XRP',
    name: 'XRP',
    price: 0.5234,
    change24h: -0.0123,
    changePercent24h: -2.30,
    volume24h: 1200000000,
    marketCap: 29000000000,
    icon: '◉',
    rank: 13,
    supply: 55000000000,
    maxSupply: 100000000000,
    high24h: 0.5400,
    low24h: 0.5000
  },
  {
    symbol: 'DOGE',
    name: 'Dogecoin',
    price: 0.0789,
    change24h: 0.0034,
    changePercent24h: 4.50,
    volume24h: 567000000,
    marketCap: 11200000000,
    icon: '🐕',
    rank: 14,
    supply: 142000000000,
    high24h: 0.0820,
    low24h: 0.0760
  },
  {
    symbol: 'SHIB',
    name: 'Shiba Inu',
    price: 0.00002345,
    change24h: 0.00000123,
    changePercent24h: 5.54,
    volume24h: 345000000,
    marketCap: 13800000000,
    icon: '🐶',
    rank: 15,
    supply: 589000000000000,
    high24h: 0.00002400,
    low24h: 0.00002300
  },
  {
    symbol: 'TRX',
    name: 'TRON',
    price: 0.1023,
    change24h: 0.0045,
    changePercent24h: 4.60,
    volume24h: 234000000,
    marketCap: 9100000000,
    icon: '⚡',
    rank: 16,
    supply: 89000000000,
    high24h: 0.1060,
    low24h: 0.0990
  },
  {
    symbol: 'NEAR',
    name: 'NEAR Protocol',
    price: 3.45,
    change24h: 0.12,
    changePercent24h: 3.61,
    volume24h: 123000000,
    marketCap: 3700000000,
    icon: '🌐',
    rank: 17,
    supply: 1070000000,
    high24h: 3.58,
    low24h: 3.32
  },
  {
    symbol: 'FTM',
    name: 'Fantom',
    price: 0.4567,
    change24h: 0.0234,
    changePercent24h: 5.41,
    volume24h: 89000000,
    marketCap: 1280000000,
    icon: '👻',
    rank: 18,
    supply: 2800000000,
    maxSupply: 3175000000,
    high24h: 0.4700,
    low24h: 0.4400
  },
  {
    symbol: 'ALGO',
    name: 'Algorand',
    price: 0.1789,
    change24h: 0.0089,
    changePercent24h: 5.24,
    volume24h: 67000000,
    marketCap: 1400000000,
    icon: '△',
    rank: 19,
    supply: 7800000000,
    maxSupply: 10000000000,
    high24h: 0.1850,
    low24h: 0.1730
  },
  {
    symbol: 'VET',
    name: 'VeChain',
    price: 0.0234,
    change24h: 0.0012,
    changePercent24h: 5.41,
    volume24h: 45000000,
    marketCap: 1700000000,
    icon: '⚡',
    rank: 20,
    supply: 72700000000,
    maxSupply: 86700000000,
    high24h: 0.0250,
    low24h: 0.0220
  }
]

export const BINANCE_TRADING_PAIRS = [
  'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'ADAUSDT',
  'AVAXUSDT', 'DOTUSDT', 'MATICUSDT', 'LINKUSDT', 'UNIUSDT',
  'LTCUSDT', 'ATOMUSDT', 'XRPUSDT', 'DOGEUSDT', 'SHIBUSDT',
  'TRXUSDT', 'NEARUSDT', 'FTMUSDT', 'ALGOUSDT', 'VETUSDT'
]

// Real-time price update using Binance WebSocket
export class BinanceWebSocketManager {
  private ws: WebSocket | null = null
  private subscribers: Map<string, (data: any) => void> = new Map()

  connect(symbols: string[]) {
    const streams = symbols.map(symbol => `${symbol.toLowerCase()}@ticker`)
    const streamString = streams.join('/')
    
    this.ws = new WebSocket(`wss://stream.binance.com:9443/ws/${streamString}`)
    
    this.ws.onopen = () => {
      console.log('Connected to Binance WebSocket')
    }
    
    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.stream && data.data) {
          const symbol = data.stream.split('@')[0].toUpperCase()
          const callback = this.subscribers.get(symbol)
          if (callback) {
            callback(data.data)
          }
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
      }
    }
    
    this.ws.onclose = () => {
      console.log('Binance WebSocket disconnected')
      // Attempt to reconnect after 5 seconds
      setTimeout(() => this.connect(symbols), 5000)
    }
    
    this.ws.onerror = (error) => {
      console.error('Binance WebSocket error:', error)
    }
  }
  
  subscribe(symbol: string, callback: (data: any) => void) {
    this.subscribers.set(symbol.toUpperCase(), callback)
  }
  
  unsubscribe(symbol: string) {
    this.subscribers.delete(symbol.toUpperCase())
  }
  
  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.subscribers.clear()
  }
}

export const binanceWS = new BinanceWebSocketManager()

export function generateRandomPriceUpdate(coin: CoinData): CoinData {
  const volatility = coin.symbol === 'BTC' ? 0.02 : coin.symbol === 'ETH' ? 0.03 : 0.05
  const priceChange = (Math.random() - 0.5) * coin.price * volatility
  const newPrice = Math.max(coin.price + priceChange, coin.price * 0.95)
  const percentChange = (priceChange / coin.price) * 100
  
  return {
    ...coin,
    price: newPrice,
    change24h: coin.change24h + priceChange,
    changePercent24h: coin.changePercent24h + percentChange * 0.1,
    volume24h: coin.volume24h * (0.9 + Math.random() * 0.2)
  }
}

'use server'

export interface Order {
  id: string
  userId: string
  type: 'buy' | 'sell'
  orderType: 'market' | 'limit'
  amount: number
  price?: number
  status: 'pending' | 'filled' | 'cancelled' | 'partial'
  filled: number
  remaining: number
  timestamp: Date
  expiresAt?: Date
}

export interface Trade {
  id: string
  buyOrderId: string
  sellOrderId: string
  price: number
  amount: number
  timestamp: Date
  buyerId: string
  sellerId: string
}

export interface OrderBook {
  bids: Array<{ price: number; amount: number; total: number }>
  asks: Array<{ price: number; amount: number; total: number }>
}

// Mock trading data
const orders = new Map<string, Order>()
const trades: Trade[] = []
let currentPrice = 67234.50

export async function createOrder(
  userId: string,
  type: 'buy' | 'sell',
  orderType: 'market' | 'limit',
  amount: number,
  price?: number
): Promise<Order> {
  const order: Order = {
    id: crypto.randomUUID(),
    userId,
    type,
    orderType,
    amount,
    price: price || currentPrice,
    status: 'pending',
    filled: 0,
    remaining: amount,
    timestamp: new Date(),
    expiresAt: orderType === 'limit' ? new Date(Date.now() + 24 * 60 * 60 * 1000) : undefined
  }

  orders.set(order.id, order)

  // Process order matching
  await processOrderMatching(order)

  return order
}

async function processOrderMatching(newOrder: Order) {
  const oppositeType = newOrder.type === 'buy' ? 'sell' : 'buy'
  const matchingOrders = Array.from(orders.values())
    .filter(order => 
      order.type === oppositeType && 
      order.status === 'pending' &&
      order.remaining > 0
    )
    .sort((a, b) => {
      if (newOrder.type === 'buy') {
        return (a.price || 0) - (b.price || 0) // Buy orders match with lowest sell prices first
      } else {
        return (b.price || 0) - (a.price || 0) // Sell orders match with highest buy prices first
      }
    })

  for (const matchingOrder of matchingOrders) {
    if (newOrder.remaining <= 0) break

    const canMatch = newOrder.type === 'buy' 
      ? (newOrder.price || 0) >= (matchingOrder.price || 0)
      : (newOrder.price || 0) <= (matchingOrder.price || 0)

    if (canMatch) {
      const tradeAmount = Math.min(newOrder.remaining, matchingOrder.remaining)
      const tradePrice = matchingOrder.price || currentPrice

      // Create trade
      const trade: Trade = {
        id: crypto.randomUUID(),
        buyOrderId: newOrder.type === 'buy' ? newOrder.id : matchingOrder.id,
        sellOrderId: newOrder.type === 'sell' ? newOrder.id : matchingOrder.id,
        price: tradePrice,
        amount: tradeAmount,
        timestamp: new Date(),
        buyerId: newOrder.type === 'buy' ? newOrder.userId : matchingOrder.userId,
        sellerId: newOrder.type === 'sell' ? newOrder.userId : matchingOrder.userId
      }

      trades.push(trade)

      // Update orders
      newOrder.filled += tradeAmount
      newOrder.remaining -= tradeAmount
      matchingOrder.filled += tradeAmount
      matchingOrder.remaining -= tradeAmount

      // Update order status
      if (newOrder.remaining === 0) {
        newOrder.status = 'filled'
      } else if (newOrder.filled > 0) {
        newOrder.status = 'partial'
      }

      if (matchingOrder.remaining === 0) {
        matchingOrder.status = 'filled'
      } else if (matchingOrder.filled > 0) {
        matchingOrder.status = 'partial'
      }

      // Update current price
      currentPrice = tradePrice
    }
  }
}

export async function getOrderBook(): Promise<OrderBook> {
  const activeOrders = Array.from(orders.values())
    .filter(order => order.status === 'pending' && order.remaining > 0)

  const bids = activeOrders
    .filter(order => order.type === 'buy')
    .reduce((acc, order) => {
      const price = order.price || 0
      const existing = acc.find(b => b.price === price)
      if (existing) {
        existing.amount += order.remaining
        existing.total += order.remaining * price
      } else {
        acc.push({
          price,
          amount: order.remaining,
          total: order.remaining * price
        })
      }
      return acc
    }, [] as Array<{ price: number; amount: number; total: number }>)
    .sort((a, b) => b.price - a.price)

  const asks = activeOrders
    .filter(order => order.type === 'sell')
    .reduce((acc, order) => {
      const price = order.price || 0
      const existing = acc.find(a => a.price === price)
      if (existing) {
        existing.amount += order.remaining
        existing.total += order.remaining * price
      } else {
        acc.push({
          price,
          amount: order.remaining,
          total: order.remaining * price
        })
      }
      return acc
    }, [] as Array<{ price: number; amount: number; total: number }>)
    .sort((a, b) => a.price - b.price)

  return { bids, asks }
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  return Array.from(orders.values())
    .filter(order => order.userId === userId)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

export async function getRecentTrades(limit: number = 50): Promise<Trade[]> {
  return trades
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit)
}

export async function cancelOrder(orderId: string, userId: string): Promise<boolean> {
  const order = orders.get(orderId)
  if (!order || order.userId !== userId) {
    return false
  }

  if (order.status === 'pending' || order.status === 'partial') {
    order.status = 'cancelled'
    return true
  }

  return false
}

export async function getCurrentPrice(): Promise<number> {
  return currentPrice
}

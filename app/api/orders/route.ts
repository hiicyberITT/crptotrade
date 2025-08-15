import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { createOrder, getUserOrders, cancelOrder } from '@/lib/trading-engine'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { type, orderType, amount, price } = await request.json()

    // Validate input
    if (!type || !orderType || !amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid order parameters' }, { status: 400 })
    }

    if (orderType === 'limit' && (!price || price <= 0)) {
      return NextResponse.json({ error: 'Price required for limit orders' }, { status: 400 })
    }

    const order = await createOrder(user.id, type, orderType, amount, price)
    
    return NextResponse.json({ order })
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const orders = await getUserOrders(user.id)
    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Get orders error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('id')

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 })
    }

    const success = await cancelOrder(orderId, user.id)
    
    if (!success) {
      return NextResponse.json({ error: 'Cannot cancel order' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Cancel order error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

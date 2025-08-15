'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/format'

export type OrderRow = {
  id: string
  symbol: string
  side: 'buy' | 'sell'
  type: 'market' | 'limit' | 'stop'
  price: number
  quantity: number
  status: 'open' | 'filled' | 'canceled'
  createdAt: string
}

export function MobileOpenOrders({
  rows = [],
  onCancel,
  emptyHint = 'Không có dữ liệu',
}: {
  rows?: OrderRow[]
  onCancel?: (id: string) => void
  emptyHint?: string
}) {
  return (
    <Card className="bg-[#0F172A] border-[#1E293B]">
      <CardContent className="p-2 space-y-2">
        {rows.length === 0 && <div className="text-sm text-gray-500 px-2 py-3">{emptyHint}</div>}
        {rows.map((r) => (
          <div key={r.id} className="bg-[#111827] rounded-md p-3">
            <div className="flex items-center justify-between">
              <div className="text-white font-medium">
                {r.symbol}{' '}
                <span className={r.side === 'buy' ? 'text-green-400' : 'text-red-400'}>
                  {r.side.toUpperCase()}
                </span>
              </div>
              <div className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleString()}</div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
              <div className="text-gray-400">Loại</div>
              <div className="text-white capitalize">{r.type}</div>
              <div className="text-gray-400">Giá</div>
              <div className="text-white">{formatCurrency(r.price)}</div>
              <div className="text-gray-400">Số lượng</div>
              <div className="text-white">{r.quantity}</div>
              <div className="text-gray-400">Trạng thái</div>
              <div className="text-white capitalize">{r.status}</div>
            </div>
            {onCancel && r.status === 'open' && (
              <div className="mt-3">
                <Button variant="outline" size="sm" className="border-red-600 text-red-400" onClick={() => onCancel(r.id)}>
                  Hủy lệnh
                </Button>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

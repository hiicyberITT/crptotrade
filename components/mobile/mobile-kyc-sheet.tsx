'use client'

import { useEffect, useMemo, useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle2, Shield, BadgeIcon as IdCard, AlertCircle, ArrowRight } from 'lucide-react'
import { namesMatch } from '@/lib/normalize'
import { useToast } from '@/hooks/use-toast'
import type { User as UserType } from '@/lib/auth'

type DocType = 'cccd' | 'cmnd' | 'passport'

type Props = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  user?: UserType | null
  onUserUpdate?: (updated: UserType) => void
}

export function MobileKYCSheet({
  open = false,
  onOpenChange = () => {},
  user = null,
  onUserUpdate = () => {},
}: Props) {
  const { toast } = useToast()
  const [docType, setDocType] = useState<DocType>('cccd')
  const [docNumber, setDocNumber] = useState('')
  const [docFullName, setDocFullName] = useState('')

  const accountName = useMemo(() => {
    if (!user) return ''
    return user.profile?.fullName || `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
  }, [user])

  const isMatch = useMemo(() => {
    if (!docFullName.trim() || !accountName.trim()) return undefined
    return namesMatch(accountName, docFullName)
  }, [accountName, docFullName])

  useEffect(() => {
    if (!open) {
      // reset fields on close
      setDocNumber('')
      setDocFullName('')
      setDocType('cccd')
    }
  }, [open])

  const handleVerify = () => {
    if (!user) return
    if (!docFullName.trim() || !docNumber.trim()) {
      toast({ title: 'Thiếu thông tin', description: 'Vui lòng nhập họ tên và số giấy tờ.', variant: 'destructive' })
      return
    }

    const match = namesMatch(accountName, docFullName)
    // update user locally
    const updated: UserType = {
      ...user,
      profile: {
        ...(user.profile || {}),
        fullName: match ? docFullName.trim() : (user.profile?.fullName || accountName),
        // @ts-ignore
        idType: docType.toUpperCase(),
        // @ts-ignore
        idNumber: docNumber.trim(),
      },
      // @ts-ignore keep simple status on user object
      kycStatus: match ? 'approved' : 'pending',
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(updated))
    }
    onUserUpdate(updated)

    if (match) {
      toast({ title: 'Xác minh thành công', description: 'Thông tin KYC đã được duyệt.' })
      onOpenChange(false)
    } else {
      toast({
        title: 'Đã gửi xác minh',
        description: 'Tên không trùng khớp. Hồ sơ đang chờ xem xét thủ công.',
      })
      onOpenChange(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <IdCard className="w-5 h-5" />
            Xác minh KYC
          </SheetTitle>
          <SheetDescription>
            Điền thông tin giấy tờ để xác minh tài khoản. Nếu họ tên trùng khớp, hồ sơ sẽ được duyệt ngay.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Thông tin của bạn được mã hoá và chỉ dùng cho mục đích xác minh.
            </AlertDescription>
          </Alert>

          {/* Account name preview */}
          <div className="space-y-1">
            <Label>Họ tên trên tài khoản</Label>
            <Input value={accountName} readOnly />
          </div>

          {/* Doc type quick toggles */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              className={`h-9 rounded border text-sm ${docType === 'cccd' ? 'bg-primary text-primary-foreground' : 'bg-background border-input'}`}
              onClick={() => setDocType('cccd')}
            >
              CCCD
            </button>
            <button
              type="button"
              className={`h-9 rounded border text-sm ${docType === 'cmnd' ? 'bg-primary text-primary-foreground' : 'bg-background border-input'}`}
              onClick={() => setDocType('cmnd')}
            >
              CMND
            </button>
            <button
              type="button"
              className={`h-9 rounded border text-sm ${docType === 'passport' ? 'bg-primary text-primary-foreground' : 'bg-background border-input'}`}
              onClick={() => setDocType('passport')}
            >
              Hộ chiếu
            </button>
          </div>

          <div className="space-y-1">
            <Label>Số giấy tờ</Label>
            <Input
              value={docNumber}
              onChange={(e) => setDocNumber(e.target.value)}
              placeholder="VD: 0xxx-xxxxxx"
            />
          </div>

          <div className="space-y-1">
            <Label>Họ tên trên giấy tờ</Label>
            <Input
              value={docFullName}
              onChange={(e) => setDocFullName(e.target.value)}
              placeholder="Nhập đúng họ tên theo giấy tờ"
            />
            {isMatch !== undefined && (
              <div className={`flex items-center gap-2 text-xs ${isMatch ? 'text-green-600' : 'text-yellow-600'}`}>
                {isMatch ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                <span>{isMatch ? 'Trùng khớp với tài khoản.' : 'Không trùng khớp, sẽ xét duyệt thủ công.'}</span>
              </div>
            )}
          </div>

          <Separator />

          <Button className="w-full" onClick={handleVerify}>
            Tiếp tục xác minh
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

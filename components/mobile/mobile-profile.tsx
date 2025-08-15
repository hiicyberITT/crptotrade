'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle, Shield, BadgeIcon as IdCard, Save, User, PhoneIcon, Mail, AlertCircle, XCircle } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import type { User as UserType } from '@/lib/auth'
import { useToast } from '@/hooks/use-toast'
import { namesMatch } from '@/lib/normalize'
import { validateVNPhone } from '@/lib/phone'
import Link from 'next/link'
import { MobileKYCSheet } from './mobile-kyc-sheet'

type DocType = 'cccd' | 'cmnd' | 'passport'

function MobileProfile() {
  const { toast } = useToast()
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(false)

  // Customer Info (only 3 fields)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')

  // Phone validation state
  const [phone, setPhone] = useState('')
  const [phoneValid, setPhoneValid] = useState(false)
  const [phoneMessage, setPhoneMessage] = useState('')

  // KYC quick match fields (also used for card verification button)
  const [docType, setDocType] = useState<DocType>('cccd')
  const [docNumber, setDocNumber] = useState('')
  const [docFullName, setDocFullName] = useState('')
  const [note, setNote] = useState('')

  // KYC sheet
  const [kycOpen, setKycOpen] = useState(false)

  useEffect(() => {
    const u = getCurrentUser()
    if (u) {
      setUser(u)
      const name = u.profile?.fullName || `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim()
      setFullName(name)
      setEmail(u.email)

      const existingPhone = u.profile?.phone || ''
      setPhone(existingPhone)
      const initial = validateVNPhone(existingPhone)
      setPhoneValid(initial.isValid)
      setPhoneMessage(initial.message)

      // Auto-open KYC if not approved
      const status = (u as any).kycStatus || 'none'
      if (status !== 'approved') {
        setKycOpen(true)
      }
    } else {
      // If no user found, don't block UI
      setKycOpen(false)
    }
  }, [])

  const kycStatus = (user as any)?.kycStatus || 'none'
  const kycBadge = useMemo(() => {
    switch (kycStatus) {
      case 'approved':
        return <Badge className="bg-green-600 text-white"><CheckCircle className="w-3 h-3 mr-1" />Đã xác minh</Badge>
      case 'pending':
        return <Badge className="bg-yellow-500 text-white"><Shield className="w-3 h-3 mr-1" />Chờ xác minh</Badge>
      case 'rejected':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Bị từ chối</Badge>
      default:
        return <Badge variant="outline"><Shield className="w-3 h-3 mr-1" />Chưa xác minh</Badge>
    }
  }, [kycStatus])

  const onPhoneChange = (v: string) => {
    setPhone(v)
    const res = validateVNPhone(v)
    setPhoneValid(res.isValid)
    setPhoneMessage(res.message)
  }

  const saveCustomerInfo = async () => {
    if (!user) return
    // require a valid non-empty phone
    const res = validateVNPhone(phone)
    if (!res.isValid) {
      setPhoneValid(false)
      setPhoneMessage(res.message)
      toast({ title: 'Số điện thoại không hợp lệ', description: res.message, variant: 'destructive' })
      return
    }

    setLoading(true)
    try {
      const parts = fullName.trim().split(/\s+/)
      const firstName = parts[0] ?? user.firstName
      const lastName = parts.slice(1).join(' ') || user.lastName

      const updated: UserType = {
        ...user,
        firstName,
        lastName,
        profile: {
          ...(user.profile || {}),
          fullName: fullName.trim(),
          phone: res.normalizedLocal,
          // @ts-ignore - store E.164 for backend use
          phoneE164: res.e164,
        },
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(updated))
      }
      setUser(updated)
      toast({ title: 'Đã lưu', description: 'Thông tin khách hàng đã được cập nhật.' })
    } catch {
      toast({ title: 'Lỗi', description: 'Không thể lưu thông tin. Vui lòng thử lại.', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const compareAndUpdateFromDocument = () => {
    if (!user) return
    if (!docFullName.trim() || !docNumber.trim()) {
      toast({ title: 'Thiếu thông tin', description: 'Vui lòng nhập họ tên trên giấy tờ và số giấy tờ.', variant: 'destructive' })
      return
    }

    const match = namesMatch(fullName, docFullName)
    const applyUpdate = () => {
      const parts = docFullName.trim().split(/\s+/)
      const firstName = parts[0] ?? user.firstName
      const lastName = parts.slice(1).join(' ') || user.lastName

      const res = validateVNPhone(phone)

      const updated: UserType = {
        ...user,
        firstName,
        lastName,
        profile: {
          ...(user.profile || {}),
          fullName: docFullName.trim(),
          phone: res.isValid ? res.normalizedLocal : (phone || ''),
          // @ts-ignore
          phoneE164: res.isValid ? res.e164 : undefined,
          // @ts-ignore
          idType: docType.toUpperCase(),
          // @ts-ignore
          idNumber: docNumber.trim(),
          // @ts-ignore
          kycNote: note.trim(),
        },
        // @ts-ignore
        kycStatus: match ? 'approved' : 'pending',
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(updated))
      }
      setUser(updated)
      setFullName(docFullName.trim())
    }

    if (match) {
      applyUpdate()
      toast({
        title: 'Đã đối chiếu và cập nhật',
        description: 'Họ tên đã được cập nhật theo giấy tờ vì trùng khớp.',
      })
    } else {
      const ok = typeof window !== 'undefined' ? window.confirm('Họ tên trên giấy tờ KHÔNG trùng khớp. Bạn có muốn gửi xác minh và cập nhật theo giấy tờ?') : false
      if (ok) {
        applyUpdate()
        toast({
          title: 'Đã gửi xác minh',
          description: 'Hồ sơ sẽ được duyệt thủ công.',
        })
      }
    }
  }

  if (!user) {
    return (
      <div className="p-4">
        <div className="text-sm text-muted-foreground">Đang tải thông tin...</div>
      </div>
    )
  }

  return (
    <main className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Tài khoản</h1>
        {kycBadge}
      </div>

      {/* Prompt to verify KYC if not approved */}
      {(kycStatus !== 'approved') && (
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between gap-2">
            <span className="text-sm">Tài khoản chưa xác minh KYC.</span>
            <Button size="sm" onClick={() => setKycOpen(true)} className="shrink-0">
              <IdCard className="w-4 h-4 mr-2" />
              Xác minh ngay
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Customer Info: only 3 fields */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Thông tin khách hàng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><User className="w-4 h-4" /> Họ và tên</Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Ví dụ: Nguyễn Văn A" />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2"><Mail className="w-4 h-4" /> Email</Label>
            <Input value={email} readOnly className="bg-muted/50" />
            <p className="text-xs text-muted-foreground">Email không thể thay đổi.</p>
          </div>

          <div className="space-y-1">
            <Label className="flex items-center gap-2"><PhoneIcon className="w-4 h-4" /> Số điện thoại</Label>
            <Input
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              placeholder="VD: 0912345678 hoặc +84912345678"
              aria-invalid={!phoneValid}
              className={!phone ? '' : (phoneValid ? 'border-green-500 focus-visible:ring-green-500' : 'border-red-500 focus-visible:ring-red-500')}
            />
            {!!phone && (
              <div className={`flex items-center gap-2 text-xs ${phoneValid ? 'text-green-600' : 'text-red-600'}`}>
                {phoneValid ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                <span>{phoneMessage}</span>
              </div>
            )}
          </div>

          <Button onClick={saveCustomerInfo} disabled={loading || !phoneValid || !phone} className="w-full">
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </CardContent>
      </Card>

      {/* Optional inline KYC quick verify card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <IdCard className="w-4 h-4" />
            Xác minh giấy tờ (CCCD/CMND/Hộ chiếu)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Nhập đúng họ tên như trên giấy tờ. Hệ thống sẽ đối chiếu và cập nhật nếu trùng khớp.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setDocType('cccd')}
              className={`h-9 rounded border text-sm ${docType === 'cccd' ? 'bg-primary text-primary-foreground' : 'bg-background border-input'}`}
            >
              CCCD
            </button>
            <button
              onClick={() => setDocType('cmnd')}
              className={`h-9 rounded border text-sm ${docType === 'cmnd' ? 'bg-primary text-primary-foreground' : 'bg-background border-input'}`}
            >
              CMND
            </button>
            <button
              onClick={() => setDocType('passport')}
              className={`h-9 rounded border text-sm col-span-2 ${docType === 'passport' ? 'bg-primary text-primary-foreground' : 'bg-background border-input'}`}
            >
              Hộ chiếu
            </button>
          </div>

          <div className="space-y-2">
            <Label>Họ tên trên giấy tờ</Label>
            <Input
              value={docFullName}
              onChange={(e) => setDocFullName(e.target.value)}
              placeholder="Nhập họ tên như trên giấy tờ"
            />
          </div>

          <div className="space-y-2">
            <Label>Số giấy tờ</Label>
            <Input
              value={docNumber}
              onChange={(e) => setDocNumber(e.target.value)}
              placeholder="Nhập số CCCD/CMND/Hộ chiếu"
            />
          </div>

          <div className="space-y-2">
            <Label>Ghi chú (tuỳ chọn)</Label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ví dụ: Họ tên không dấu..."
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setKycOpen(true)}>
              Mở cửa sổ xác minh
            </Button>
            <Button className="flex-1" onClick={compareAndUpdateFromDocument}>
              Đối chiếu và cập nhật
            </Button>
          </div>

          <Separator />

          <div className="text-xs text-muted-foreground">
            Muốn xem tiến trình xác minh chi tiết? Vào{' '}
            <Link href="/kyc/verify" className="underline underline-offset-2">
              Xác minh KYC
            </Link>
            .
          </div>
        </CardContent>
      </Card>

      {/* KYC bottom sheet (auto opens if not approved) */}
      <MobileKYCSheet
        open={kycOpen}
        onOpenChange={setKycOpen}
        user={user}
        onUserUpdate={(u) => setUser(u)}
      />
    </main>
  )
}

export { MobileProfile }
export default MobileProfile

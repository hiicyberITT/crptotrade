'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, FileText, BadgeIcon as IdCard, Loader2, Mail, ShieldCheck } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

type DocType = 'cccd' | 'cmnd' | 'passport'

export interface MobileVerificationFlowProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  email: string
  onCompleted?: () => void
}

function normalizeVNName(name: string) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

export function MobileVerificationFlow({
  open = false,
  onOpenChange,
  email,
  onCompleted,
}: MobileVerificationFlowProps) {
  const { toast } = useToast()
  const [step, setStep] = useState<1 | 2>(1)
  const [verifying, setVerifying] = useState(false)
  const [emailCode, setEmailCode] = useState('')
  const [emailVerified, setEmailVerified] = useState(false)

  const [docType, setDocType] = useState<DocType>('cccd')
  const [docName, setDocName] = useState('')
  const [docNumber, setDocNumber] = useState('')
  const [submittingKyc, setSubmittingKyc] = useState(false)
  const [kycDone, setKycDone] = useState(false)

  // Pull user from localStorage to compare/update
  const storedUser = useMemo(() => {
    if (typeof window === 'undefined') return null
    try {
      const userRaw = localStorage.getItem('user')
      return userRaw ? JSON.parse(userRaw) : null
    } catch {
      return null
    }
  }, [open])

  const storedFullName: string = useMemo(() => {
    if (!storedUser) return ''
    // Prefer profile.fullName if present; else compose from firstName/lastName
    const profileName = storedUser?.profile?.fullName
    if (profileName && String(profileName).trim().length > 0) return profileName
    const composed = [storedUser?.firstName, storedUser?.lastName].filter(Boolean).join(' ')
    return composed.trim()
  }, [storedUser])

  useEffect(() => {
    if (!open) {
      // Reset state when closing
      setStep(1)
      setEmailCode('')
      setEmailVerified(false)
      setDocType('cccd')
      setDocName('')
      setDocNumber('')
      setSubmittingKyc(false)
      setKycDone(false)
    }
  }, [open])

  async function handleVerifyEmail(e: React.FormEvent) {
    e.preventDefault()
    if (!email) {
      toast({ variant: 'destructive', description: 'Thiếu email để xác minh.' })
      return
    }
    if (!emailCode || emailCode.trim().length < 4) {
      toast({ variant: 'destructive', description: 'Vui lòng nhập mã xác minh hợp lệ.' })
      return
    }
    setVerifying(true)
    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: emailCode.trim() }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.error || 'Xác minh email thất bại')
      }
      // mark verified locally
      if (storedUser) {
        const updated = { ...storedUser, isVerified: true }
        localStorage.setItem('user', JSON.stringify(updated))
      }
      setEmailVerified(true)
      toast({ description: 'Email đã được xác minh thành công.' })
      setStep(2)
    } catch (err: any) {
      toast({ variant: 'destructive', description: err?.message || 'Xác minh email thất bại.' })
    } finally {
      setVerifying(false)
    }
  }

  function mapDocTypeLabel(v: DocType) {
    switch (v) {
      case 'cccd':
        return 'CCCD'
      case 'cmnd':
        return 'CMND'
      case 'passport':
        return 'Hộ chiếu'
      default:
        return 'Giấy tờ'
    }
  }

  async function handleSubmitKyc(e: React.FormEvent) {
    e.preventDefault()
    if (!docName.trim() || !docNumber.trim()) {
      toast({ variant: 'destructive', description: 'Vui lòng nhập đầy đủ họ tên trên giấy tờ và số giấy tờ.' })
      return
    }
    const nameMatches =
      normalizeVNName(docName) === normalizeVNName(storedFullName || '')

    if (!nameMatches) {
      const proceed = window.confirm(
        'Họ tên trên giấy tờ không trùng khớp với hồ sơ tài khoản. Bạn có muốn cập nhật hồ sơ theo tên trên giấy tờ và tiếp tục?'
      )
      if (!proceed) return
    }

    setSubmittingKyc(true)
    try {
      // Optional: Attempt to call an existing KYC endpoint if available
      const payload = {
        docType,
        docNumber: docNumber.trim(),
        docName: docName.trim(),
      }
      try {
        await fetch('/api/kyc/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        // Ignore response details; we handle local update below
      } catch {
        // If the route is not implemented, gracefully continue with local update
      }

      // Update local user profile and KYC status
      if (storedUser) {
        const updated = {
          ...storedUser,
          isVerified: true,
          kycStatus: 'approved',
          profile: {
            ...(storedUser.profile || {}),
            fullName: docName.trim(),
            idType: mapDocTypeLabel(docType),
            idNumber: docNumber.trim(),
          },
          tradingLimits: {
            daily: 10000,
            monthly: 100000,
            withdrawal: 5000,
          },
        }
        localStorage.setItem('user', JSON.stringify(updated))
      }
      setKycDone(true)
      toast({ description: 'KYC đã được xác minh và cập nhật hồ sơ.' })
    } catch (err: any) {
      toast({ variant: 'destructive', description: err?.message || 'Gửi KYC thất bại. Vui lòng thử lại.' })
    } finally {
      setSubmittingKyc(false)
    }
  }

  function handleFinish() {
    onOpenChange?.(false)
    onCompleted?.()
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh] p-0">
        <div className="h-full overflow-y-auto">
          <SheetHeader className="px-4 pt-4 pb-2">
            <SheetTitle>Xác minh tài khoản</SheetTitle>
            <SheetDescription>Hoàn tất các bước dưới đây để bắt đầu giao dịch</SheetDescription>
          </SheetHeader>

          {/* Step indicator */}
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant={step >= 1 ? 'default' : 'secondary'} className="gap-1">
                  <Mail className="w-3.5 h-3.5" /> Email
                </Badge>
                <span className="text-muted-foreground">{'>'}</span>
                <Badge variant={step >= 2 ? 'default' : 'secondary'} className="gap-1">
                  <IdCard className="w-3.5 h-3.5" /> KYC
                </Badge>
              </div>
              {emailVerified && (
                <div className="text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Email đã xác minh
                </div>
              )}
            </div>
          </div>

          {/* Steps */}
          <div className="px-4 pb-24">
            {step === 1 && (
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-1">
                    <Label>Email</Label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <Input value={email} readOnly />
                      </div>
                      <Badge variant="outline">Mã 6 số</Badge>
                    </div>
                  </div>

                  <form onSubmit={handleVerifyEmail} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="emailCode">Nhập mã xác minh</Label>
                      <div className="relative">
                        <Input
                          id="emailCode"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          placeholder="123456"
                          value={emailCode}
                          onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Kiểm tra hộp thư đến (và Spam) để lấy mã xác minh.
                      </p>
                    </div>

                    <Button type="submit" className="w-full" disabled={verifying || !emailCode}>
                      {verifying ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang xác minh...</> : 'Xác minh email'}
                    </Button>

                    <Alert>
                      <ShieldCheck className="h-4 w-4" />
                      <AlertDescription>
                        Với bản demo, bạn có thể dùng mã 123456, 654321 hoặc 111111.
                      </AlertDescription>
                    </Alert>
                  </form>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <Alert>
                    <FileText className="h-4 w-4" />
                    <AlertDescription>
                      Nhập họ tên chính xác như trên giấy tờ. Hệ thống sẽ đối chiếu với hồ sơ tài khoản.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label>Loại giấy tờ</Label>
                    <Select value={docType} onValueChange={(v) => setDocType(v as DocType)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn giấy tờ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cccd">CCCD</SelectItem>
                        <SelectItem value="cmnd">CMND</SelectItem>
                        <SelectItem value="passport">Hộ chiếu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="docName">Họ tên trên giấy tờ</Label>
                    <Input
                      id="docName"
                      placeholder="Ví dụ: Nguyen Van A"
                      value={docName}
                      onChange={(e) => setDocName(e.target.value)}
                    />
                    {storedFullName && (
                      <p className="text-xs text-muted-foreground">
                        Tên trên hồ sơ: <span className="font-medium">{storedFullName}</span>
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="docNumber">Số giấy tờ</Label>
                    <Input
                      id="docNumber"
                      placeholder="VD: 0123456789"
                      value={docNumber}
                      onChange={(e) => setDocNumber(e.target.value.trim())}
                    />
                  </div>

                  {/* Optional uploads (not required for demo) */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="front">Ảnh mặt trước (tùy chọn)</Label>
                      <Input id="front" type="file" accept="image/*" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="back">Ảnh mặt sau (tùy chọn)</Label>
                      <Input id="back" type="file" accept="image/*" />
                    </div>
                  </div>

                  <form onSubmit={handleSubmitKyc} className="space-y-3">
                    <Button type="submit" className="w-full" disabled={submittingKyc || !docName || !docNumber}>
                      {submittingKyc ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang gửi KYC...</> : 'Gửi và xác minh'}
                    </Button>
                  </form>

                  {kycDone && (
                    <div className="rounded-lg border p-4 bg-green-50 text-green-700">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <p className="font-medium">KYC thành công</p>
                      </div>
                      <p className="text-sm mt-1">
                        Hồ sơ đã được cập nhật. Bạn có thể bắt đầu giao dịch ngay bây giờ.
                      </p>
                      <div className="mt-3">
                        <Button onClick={handleFinish} className="w-full">Hoàn tất</Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default MobileVerificationFlow

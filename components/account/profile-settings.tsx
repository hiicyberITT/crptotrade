'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { UserIcon, Edit, Save, AlertCircle, CheckCircle, Shield, CreditCard, PhoneIcon, Mail, XCircle } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import type { User as UserType } from '@/lib/auth'
import { validateVNPhone } from '@/lib/phone'

export function ProfileSettings() {
  const [user, setUser] = useState<UserType | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')

  // Phone validation
  const [phone, setPhone] = useState('')
  const [phoneValid, setPhoneValid] = useState(false)
  const [phoneMessage, setPhoneMessage] = useState('')

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
      setFullName(currentUser.profile?.fullName || `${currentUser.firstName} ${currentUser.lastName}`.trim())
      setEmail(currentUser.email)

      const existingPhone = currentUser.profile?.phone || ''
      setPhone(existingPhone)
      const initial = validateVNPhone(existingPhone)
      setPhoneValid(initial.isValid)
      setPhoneMessage(initial.message)
    }
  }, [])

  const onPhoneChange = (v: string) => {
    setPhone(v)
    const res = validateVNPhone(v)
    setPhoneValid(res.isValid)
    setPhoneMessage(res.message)
  }

  const handleSave = async () => {
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      // Validate phone before save
      const res = validateVNPhone(phone)
      if (!res.isValid) {
        setIsLoading(false)
        setError(res.message)
        return
      }

      await new Promise((r) => setTimeout(r, 300))
      if (user) {
        const [first, ...rest] = fullName.trim().split(' ')
        const updated: UserType = {
          ...user,
          firstName: first || user.firstName,
          lastName: rest.join(' ') || user.lastName,
          profile: {
            ...(user.profile || {}),
            fullName: fullName.trim(),
            phone: res.normalizedLocal,
            // @ts-ignore - store E.164 for backend
            phoneE164: res.e164,
          },
        }
        localStorage.setItem('user', JSON.stringify(updated))
        setUser(updated)
      }
      setSuccess('Cập nhật thông tin thành công!')
      setIsEditing(false)
    } catch (e) {
      setError('Có lỗi xảy ra khi cập nhật thông tin')
    } finally {
      setIsLoading(false)
    }
  }

  const getKYCStatusBadge = (status?: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500 text-white"><CheckCircle className="w-3 h-3 mr-1" />Đã xác thực</Badge>
      case 'pending':
        return <Badge className="bg-yellow-500 text-white"><AlertCircle className="w-3 h-3 mr-1" />Chờ xác thực</Badge>
      case 'rejected':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Bị từ chối</Badge>
      default:
        return <Badge variant="outline"><Shield className="w-3 h-3 mr-1" />Chưa xác thực</Badge>
    }
  }

  if (!user) {
    return <div className="p-4">Đang tải...</div>
  }

  return (
    <div className="space-y-6">
      {user.kycStatus !== 'approved' && (
        <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span>
                Tài khoản của bạn chưa được xác thực danh tính. Vui lòng hoàn thành KYC để sử dụng đầy đủ tính năng.
              </span>
              <a href="/kyc/verify">
                <Button size="sm" className="ml-4">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Xác thực ngay
                </Button>
              </a>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <UserIcon className="w-5 h-5 text-primary" />
              <CardTitle className="text-foreground">Thông tin khách hàng</CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              {getKYCStatusBadge(user.kycStatus)}
              {!isEditing ? (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Chỉnh sửa
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                    Hủy
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={isLoading || !phoneValid || !phone}>
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? 'Đang lưu...' : 'Lưu'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* Only 3 fields: Full name, Email, Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Họ và tên</Label>
              {isEditing ? (
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nhập họ và tên" />
              ) : (
                <div className="p-2 bg-muted rounded">{fullName || 'Chưa cập nhật'}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <div className="p-2 bg-muted rounded text-muted-foreground flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>{email}</span>
              </div>
            </div>

            <div className="space-y-1">
              <Label>Số điện thoại</Label>
              {isEditing ? (
                <>
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
                </>
              ) : (
                <div className="p-2 bg-muted rounded flex items-center gap-2">
                  <PhoneIcon className="w-4 h-4" />
                  <span>{phone || 'Chưa cập nhật'}</span>
                </div>
              )}
            </div>
          </div>

          <Separator className="bg-border" />

          <div className="text-sm text-muted-foreground">
            Để đồng bộ thông tin theo giấy tờ, hãy vào KYC hoặc dùng phần “Xác minh giấy tờ” trong giao diện mobile.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

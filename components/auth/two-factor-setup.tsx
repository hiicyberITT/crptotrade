'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Smartphone, QrCode, Key, CheckCircle, AlertCircle, Copy } from 'lucide-react'

interface TwoFactorSetupProps {
  onComplete?: () => void
}

export function TwoFactorSetup({ onComplete }: TwoFactorSetupProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [qrCode, setQrCode] = useState('otpauth://totp/BTC%20Exchange%20Pro:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=BTC%20Exchange%20Pro')
  const [secretKey, setSecretKey] = useState('JBSWY3DPEHPK3PXP')
  const [verificationCode, setVerificationCode] = useState('')
  const [backupCodes, setBackupCodes] = useState([
    '1a2b-3c4d', '5e6f-7g8h', '9i0j-1k2l',
    '3m4n-5o6p', '7q8r-9s0t', '1u2v-3w4x'
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleVerify2FA = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/setup-2fa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: verificationCode,
          secret: secretKey
        })
      })

      const result = await response.json()

      if (response.ok) {
        setCurrentStep(3)
      } else {
        setError(result.error || 'Mã xác thực không đúng')
      }
    } catch (error) {
      setError('Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Show toast notification
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Smartphone className="w-16 h-16 text-primary mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Cài đặt xác thực 2 bước</h3>
        <p className="text-muted-foreground">
          Tăng cường bảo mật tài khoản với xác thực 2 bước
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-4 border rounded-lg">
          <h4 className="font-semibold mb-2">Bước 1: Tải ứng dụng xác thực</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Tải một trong các ứng dụng sau về điện thoại:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm">Google Authenticator</Button>
            <Button variant="outline" size="sm">Microsoft Authenticator</Button>
            <Button variant="outline" size="sm">Authy</Button>
            <Button variant="outline" size="sm">1Password</Button>
          </div>
        </div>

        <div className="p-4 border rounded-lg">
          <h4 className="font-semibold mb-2">Bước 2: Quét mã QR</h4>
          <p className="text-sm text-muted-foreground">
            Sử dụng ứng dụng xác thực để quét mã QR bên dưới
          </p>
        </div>
      </div>

      <Button onClick={() => setCurrentStep(2)} className="w-full">
        Tiếp tục
      </Button>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <QrCode className="w-16 h-16 text-primary mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Quét mã QR</h3>
        <p className="text-muted-foreground">
          Sử dụng ứng dụng xác thực để quét mã QR
        </p>
      </div>

      <div className="flex justify-center">
        <div className="w-48 h-48 bg-white p-4 rounded-lg shadow-sm border">
          <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
            <QrCode className="w-16 h-16 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Hoặc nhập mã thủ công:</Label>
        <div className="flex gap-2">
          <Input
            value={secretKey}
            readOnly
            className="font-mono bg-muted"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(secretKey)}
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="verificationCode">Nhập mã xác thực từ ứng dụng</Label>
          <Input
            id="verificationCode"
            type="text"
            placeholder="123456"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="text-center text-2xl tracking-widest"
            maxLength={6}
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(1)}
            className="flex-1"
          >
            Quay lại
          </Button>
          <Button
            onClick={handleVerify2FA}
            disabled={isLoading || verificationCode.length !== 6}
            className="flex-1"
          >
            {isLoading ? 'Đang xác thực...' : 'Xác thực'}
          </Button>
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">2FA đã được kích hoạt!</h3>
        <p className="text-muted-foreground">
          Tài khoản của bạn giờ đây được bảo vệ bởi xác thực 2 bước
        </p>
      </div>

      <Alert>
        <Key className="h-4 w-4" />
        <AlertDescription>
          <strong>Quan trọng:</strong> Lưu các mã khôi phục bên dưới ở nơi an toàn. 
          Bạn có thể sử dụng chúng để truy cập tài khoản nếu mất điện thoại.
        </AlertDescription>
      </Alert>

      <div className="space-y-3">
        <Label>Mã khôi phục (Recovery Codes):</Label>
        <div className="grid grid-cols-2 gap-2 p-4 bg-muted rounded-lg">
          {backupCodes.map((code, index) => (
            <div key={index} className="font-mono text-sm p-2 bg-background rounded border">
              {code}
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => copyToClipboard(backupCodes.join('\n'))}
          className="w-full"
        >
          <Copy className="w-4 h-4 mr-2" />
          Sao chép tất cả mã
        </Button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <span className="text-sm">Trạng thái 2FA:</span>
          <Badge className="bg-green-500">Đã kích hoạt</Badge>
        </div>
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <span className="text-sm">Mã khôi phục:</span>
          <span className="text-sm font-medium">6 mã khả dụng</span>
        </div>
      </div>

      <Button onClick={onComplete} className="w-full">
        Hoàn thành
      </Button>
    </div>
  )

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Xác thực 2 bước</CardTitle>
        <p className="text-muted-foreground">
          Bảo vệ tài khoản với lớp bảo mật bổ sung
        </p>
      </CardHeader>
      <CardContent>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </CardContent>
    </Card>
  )
}

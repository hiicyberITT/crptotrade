'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, Camera, FileText, CheckCircle, AlertCircle, User, Calendar, MapPin, CreditCard } from 'lucide-react'

interface KYCVerificationProps {
  onComplete?: () => void
}

export function KYCVerification({ onComplete }: KYCVerificationProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<{[key: string]: File | null}>({
    idFront: null,
    idBack: null,
    selfie: null,
    proofOfAddress: null
  })

  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    dateOfBirth: '',
    nationality: '',
    idNumber: '',
    idType: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    occupation: ''
  })

  const handleFileUpload = (type: string, file: File) => {
    setUploadedFiles(prev => ({ ...prev, [type]: file }))
    setError('')
  }

  const handlePersonalInfoChange = (field: string, value: string) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const validateStep1 = () => {
    const required = ['fullName', 'dateOfBirth', 'nationality', 'idNumber', 'idType']
    for (const field of required) {
      if (!personalInfo[field as keyof typeof personalInfo]) {
        setError(`Vui lòng điền đầy đủ thông tin`)
        return false
      }
    }
    return true
  }

  const validateStep2 = () => {
    const required = ['address', 'city', 'country']
    for (const field of required) {
      if (!personalInfo[field as keyof typeof personalInfo]) {
        setError(`Vui lòng điền đầy đủ địa chỉ`)
        return false
      }
    }
    return true
  }

  const validateStep3 = () => {
    if (!uploadedFiles.idFront || !uploadedFiles.idBack) {
      setError('Vui lòng tải lên ảnh mặt trước và mặt sau của giấy tờ tùy thân')
      return false
    }
    if (!uploadedFiles.selfie) {
      setError('Vui lòng tải lên ảnh selfie với giấy tờ tùy thân')
      return false
    }
    return true
  }

  const handleNext = () => {
    setError('')
    
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2)
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3)
    } else if (currentStep === 3 && validateStep3()) {
      setCurrentStep(4)
    } else if (currentStep === 4) {
      handleSubmitKYC()
    }
  }

  const handleSubmitKYC = async () => {
    setIsLoading(true)
    setError('')

    try {
      const formData = new FormData()
      
      // Add personal info
      Object.entries(personalInfo).forEach(([key, value]) => {
        formData.append(key, value)
      })
      
      // Add files
      Object.entries(uploadedFiles).forEach(([key, file]) => {
        if (file) {
          formData.append(key, file)
        }
      })

      const response = await fetch('/api/kyc/submit', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (response.ok) {
        setCurrentStep(5)
      } else {
        setError(result.error || 'Có lỗi xảy ra khi gửi thông tin KYC')
      }
    } catch (error) {
      setError('Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  const FileUploadArea = ({ type, title, description, accept, icon: Icon }: {
    type: string
    title: string
    description: string
    accept: string
    icon: any
  }) => (
    <div className="space-y-2">
      <Label>{title}</Label>
      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
        {uploadedFiles[type] ? (
          <div className="space-y-2">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto" />
            <p className="text-sm font-medium text-green-600">
              {uploadedFiles[type]!.name}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setUploadedFiles(prev => ({ ...prev, [type]: null }))}
            >
              Thay đổi
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Icon className="w-8 h-8 text-muted-foreground mx-auto" />
            <p className="text-sm font-medium">{title}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const input = document.createElement('input')
                input.type = 'file'
                input.accept = accept
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0]
                  if (file) handleFileUpload(type, file)
                }
                input.click()
              }}
            >
              <Upload className="w-4 h-4 mr-2" />
              Tải lên
            </Button>
          </div>
        )}
      </div>
    </div>
  )

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <User className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Thông tin cá nhân</h3>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullName">Họ và tên (theo giấy tờ tùy thân)</Label>
        <Input
          id="fullName"
          value={personalInfo.fullName}
          onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
          placeholder="Nguyễn Văn A"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Ngày sinh</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={personalInfo.dateOfBirth}
            onChange={(e) => handlePersonalInfoChange('dateOfBirth', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nationality">Quốc tịch</Label>
          <Select value={personalInfo.nationality} onValueChange={(value) => handlePersonalInfoChange('nationality', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn quốc tịch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="VN">Việt Nam</SelectItem>
              <SelectItem value="US">Hoa Kỳ</SelectItem>
              <SelectItem value="JP">Nhật Bản</SelectItem>
              <SelectItem value="KR">Hàn Quốc</SelectItem>
              <SelectItem value="CN">Trung Quốc</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="idType">Loại giấy tờ</Label>
          <Select value={personalInfo.idType} onValueChange={(value) => handlePersonalInfoChange('idType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn loại giấy tờ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CCCD">Căn cước công dân</SelectItem>
              <SelectItem value="CMND">Chứng minh nhân dân</SelectItem>
              <SelectItem value="PASSPORT">Hộ chiếu</SelectItem>
              <SelectItem value="GPLX">Giấy phép lái xe</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="idNumber">Số giấy tờ</Label>
          <Input
            id="idNumber"
            value={personalInfo.idNumber}
            onChange={(e) => handlePersonalInfoChange('idNumber', e.target.value)}
            placeholder="123456789"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="occupation">Nghề nghiệp</Label>
        <Input
          id="occupation"
          value={personalInfo.occupation}
          onChange={(e) => handlePersonalInfoChange('occupation', e.target.value)}
          placeholder="Kỹ sư phần mềm"
        />
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Địa chỉ cư trú</h3>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Địa chỉ</Label>
        <Input
          id="address"
          value={personalInfo.address}
          onChange={(e) => handlePersonalInfoChange('address', e.target.value)}
          placeholder="123 Đường ABC, Phường XYZ"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">Thành phố</Label>
          <Input
            id="city"
            value={personalInfo.city}
            onChange={(e) => handlePersonalInfoChange('city', e.target.value)}
            placeholder="Hồ Chí Minh"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="postalCode">Mã bưu điện</Label>
          <Input
            id="postalCode"
            value={personalInfo.postalCode}
            onChange={(e) => handlePersonalInfoChange('postalCode', e.target.value)}
            placeholder="700000"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="country">Quốc gia</Label>
        <Select value={personalInfo.country} onValueChange={(value) => handlePersonalInfoChange('country', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn quốc gia" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="VN">Việt Nam</SelectItem>
            <SelectItem value="US">Hoa Kỳ</SelectItem>
            <SelectItem value="JP">Nhật Bản</SelectItem>
            <SelectItem value="KR">Hàn Quốc</SelectItem>
            <SelectItem value="CN">Trung Quốc</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Tải lên giấy tờ</h3>
      </div>

      <FileUploadArea
        type="idFront"
        title="Mặt trước giấy tờ tùy thân"
        description="Ảnh rõ nét, đầy đủ 4 góc, định dạng JPG/PNG"
        accept="image/*"
        icon={CreditCard}
      />

      <FileUploadArea
        type="idBack"
        title="Mặt sau giấy tờ tùy thân"
        description="Ảnh rõ nét, đầy đủ 4 góc, định dạng JPG/PNG"
        accept="image/*"
        icon={CreditCard}
      />

      <FileUploadArea
        type="selfie"
        title="Ảnh selfie với giấy tờ tùy thân"
        description="Chụp ảnh bản thân cầm giấy tờ tùy thân"
        accept="image/*"
        icon={Camera}
      />

      <FileUploadArea
        type="proofOfAddress"
        title="Giấy tờ xác minh địa chỉ (tùy chọn)"
        description="Hóa đơn điện/nước/gas trong 3 tháng gần nhất"
        accept="image/*,application/pdf"
        icon={FileText}
      />

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Lưu ý:</strong> Tất cả ảnh phải rõ nét, không bị mờ hay che khuất. 
          Thông tin trên giấy tờ phải khớp với thông tin đã nhập.
        </AlertDescription>
      </Alert>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Xác nhận thông tin</h3>
      </div>

      <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
        <div>
          <h4 className="font-medium mb-2">Thông tin cá nhân:</h4>
          <div className="text-sm space-y-1">
            <p><strong>Họ tên:</strong> {personalInfo.fullName}</p>
            <p><strong>Ngày sinh:</strong> {personalInfo.dateOfBirth}</p>
            <p><strong>Quốc tịch:</strong> {personalInfo.nationality}</p>
            <p><strong>Số giấy tờ:</strong> {personalInfo.idNumber}</p>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Địa chỉ:</h4>
          <div className="text-sm">
            <p>{personalInfo.address}, {personalInfo.city}, {personalInfo.country}</p>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Giấy tờ đã tải lên:</h4>
          <div className="text-sm space-y-1">
            <p>✓ Mặt trước giấy tờ tùy thân</p>
            <p>✓ Mặt sau giấy tờ tùy thân</p>
            <p>✓ Ảnh selfie với giấy tờ</p>
            {uploadedFiles.proofOfAddress && <p>✓ Giấy tờ xác minh địa chỉ</p>}
          </div>
        </div>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Bằng cách gửi thông tin KYC, bạn xác nhận rằng tất cả thông tin được cung cấp là chính xác và đúng sự thật.
        </AlertDescription>
      </Alert>
    </div>
  )

  const renderStep5 = () => (
    <div className="text-center space-y-4">
      <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">
          KYC đã được gửi thành công!
        </h3>
        <p className="text-sm text-green-600 dark:text-green-300">
          Thông tin KYC của bạn đang được xem xét. Chúng tôi sẽ thông báo kết quả trong vòng 1-3 ngày làm việc.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <span className="text-sm">Trạng thái KYC:</span>
          <Badge variant="secondary">Đang xử lý</Badge>
        </div>
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <span className="text-sm">Thời gian xử lý:</span>
          <span className="text-sm font-medium">1-3 ngày làm việc</span>
        </div>
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <span className="text-sm">Giới hạn hiện tại:</span>
          <span className="text-sm font-medium">1 BTC/ngày</span>
        </div>
      </div>

      <Button onClick={onComplete} className="w-full">
        Hoàn thành
      </Button>
    </div>
  )

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Xác thực danh tính (KYC)</CardTitle>
        <p className="text-muted-foreground">
          Hoàn thành xác thực để tăng giới hạn giao dịch
        </p>
        {currentStep < 5 && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>Bước {currentStep}/4</span>
              <span>{Math.round((currentStep / 4) * 100)}%</span>
            </div>
            <Progress value={(currentStep / 4) * 100} className="h-2" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
        {currentStep === 5 && renderStep5()}

        {currentStep < 5 && (
          <div className="flex gap-3 mt-6">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex-1"
              >
                Quay lại
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Đang xử lý...' : currentStep === 4 ? 'Gửi KYC' : 'Tiếp tục'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

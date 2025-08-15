'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, Upload, CheckCircle, AlertCircle, Eye, RotateCcw, Scan, CreditCard, FileText, User, Calendar, MapPin, Shield, Zap } from 'lucide-react'

interface DocumentData {
  type: 'cccd' | 'cmnd' | 'passport'
  number: string
  fullName: string
  dateOfBirth: string
  placeOfBirth: string
  nationality: string
  gender: string
  address: string
  issueDate: string
  expiryDate: string
  issuingAuthority: string
  photo?: string
}

interface VerificationResult {
  isValid: boolean
  confidence: number
  extractedData: Partial<DocumentData>
  validationErrors: string[]
  ocrResults: any
}

export function DocumentVerification() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedDocType, setSelectedDocType] = useState<'cccd' | 'cmnd' | 'passport'>('cccd')
  const [uploadedImages, setUploadedImages] = useState<{[key: string]: File | null}>({
    front: null,
    back: null
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null)
  const [extractedData, setExtractedData] = useState<Partial<DocumentData>>({})
  const [manualData, setManualData] = useState<Partial<DocumentData>>({})
  const [error, setError] = useState('')
  const [cameraActive, setCameraActive] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const documentTypes = {
    cccd: {
      name: 'Căn cước công dân',
      icon: CreditCard,
      fields: ['number', 'fullName', 'dateOfBirth', 'gender', 'nationality', 'placeOfBirth', 'address', 'issueDate', 'expiryDate']
    },
    cmnd: {
      name: 'Chứng minh nhân dân',
      icon: CreditCard,
      fields: ['number', 'fullName', 'dateOfBirth', 'gender', 'placeOfBirth', 'address', 'issueDate']
    },
    passport: {
      name: 'Hộ chiếu',
      icon: FileText,
      fields: ['number', 'fullName', 'dateOfBirth', 'gender', 'nationality', 'placeOfBirth', 'issueDate', 'expiryDate', 'issuingAuthority']
    }
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraActive(true)
      }
    } catch (error) {
      setError('Không thể truy cập camera. Vui lòng sử dụng tính năng tải file.')
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach(track => track.stop())
      videoRef.current.srcObject = null
      setCameraActive(false)
    }
  }

  const capturePhoto = (side: 'front' | 'back') => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      const ctx = canvas.getContext('2d')
      ctx?.drawImage(video, 0, 0)
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `${selectedDocType}_${side}.jpg`, { type: 'image/jpeg' })
          setUploadedImages(prev => ({ ...prev, [side]: file }))
        }
      }, 'image/jpeg', 0.9)
    }
  }

  const handleFileUpload = (side: 'front' | 'back', file: File) => {
    // Validate file
    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn file hình ảnh')
      return
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB
      setError('File quá lớn. Vui lòng chọn file nhỏ hơn 10MB')
      return
    }

    setUploadedImages(prev => ({ ...prev, [side]: file }))
    setError('')
  }

  const processDocument = async () => {
    if (!uploadedImages.front) {
      setError('Vui lòng tải lên ảnh mặt trước của giấy tờ')
      return
    }

    if (selectedDocType !== 'passport' && !uploadedImages.back) {
      setError('Vui lòng tải lên ảnh mặt sau của giấy tờ')
      return
    }

    setIsProcessing(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('documentType', selectedDocType)
      formData.append('front', uploadedImages.front)
      if (uploadedImages.back) {
        formData.append('back', uploadedImages.back)
      }

      const response = await fetch('/api/kyc/verify-document', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (response.ok) {
        setVerificationResult(result)
        setExtractedData(result.extractedData)
        setManualData(result.extractedData)
        setCurrentStep(3)
      } else {
        setError(result.error || 'Có lỗi xảy ra khi xử lý giấy tờ')
      }
    } catch (error) {
      setError('Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setIsProcessing(false)
    }
  }

  const validateExtractedData = () => {
    const errors: string[] = []
    const requiredFields = documentTypes[selectedDocType].fields

    requiredFields.forEach(field => {
      if (!manualData[field as keyof DocumentData]) {
        errors.push(`${getFieldLabel(field)} là bắt buộc`)
      }
    })

    // Validate ID number format
    if (manualData.number) {
      if (selectedDocType === 'cccd' && !/^\d{12}$/.test(manualData.number)) {
        errors.push('Số CCCD phải có 12 chữ số')
      } else if (selectedDocType === 'cmnd' && !/^\d{9}$/.test(manualData.number)) {
        errors.push('Số CMND phải có 9 chữ số')
      } else if (selectedDocType === 'passport' && !/^[A-Z]\d{7}$/.test(manualData.number)) {
        errors.push('Số hộ chiếu phải có định dạng A1234567')
      }
    }

    // Validate dates
    if (manualData.dateOfBirth) {
      const birthDate = new Date(manualData.dateOfBirth)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      if (age < 18 || age > 100) {
        errors.push('Tuổi phải từ 18 đến 100')
      }
    }

    if (manualData.expiryDate) {
      const expiryDate = new Date(manualData.expiryDate)
      const today = new Date()
      if (expiryDate < today) {
        errors.push('Giấy tờ đã hết hạn')
      }
    }

    return errors
  }

  const getFieldLabel = (field: string) => {
    const labels: {[key: string]: string} = {
      number: selectedDocType === 'passport' ? 'Số hộ chiếu' : selectedDocType === 'cccd' ? 'Số CCCD' : 'Số CMND',
      fullName: 'Họ và tên',
      dateOfBirth: 'Ngày sinh',
      gender: 'Giới tính',
      nationality: 'Quốc tịch',
      placeOfBirth: 'Nơi sinh',
      address: 'Địa chỉ',
      issueDate: 'Ngày cấp',
      expiryDate: 'Ngày hết hạn',
      issuingAuthority: 'Nơi cấp'
    }
    return labels[field] || field
  }

  const handleSubmitVerification = async () => {
    const validationErrors = validateExtractedData()
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '))
      return
    }

    setIsProcessing(true)
    setError('')

    try {
      const response = await fetch('/api/kyc/submit-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentType: selectedDocType,
          extractedData: manualData,
          verificationResult,
          images: {
            front: uploadedImages.front?.name,
            back: uploadedImages.back?.name
          }
        })
      })

      const result = await response.json()

      if (response.ok) {
        setCurrentStep(4)
      } else {
        setError(result.error || 'Có lỗi xảy ra khi gửi thông tin')
      }
    } catch (error) {
      setError('Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setIsProcessing(false)
    }
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Chọn loại giấy tờ</h3>
        <p className="text-muted-foreground">
          Chọn loại giấy tờ tùy thân bạn muốn xác minh
        </p>
      </div>

      <div className="grid gap-4">
        {Object.entries(documentTypes).map(([type, info]) => (
          <Card 
            key={type}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedDocType === type ? 'ring-2 ring-primary bg-primary/5' : ''
            }`}
            onClick={() => setSelectedDocType(type as any)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${
                  selectedDocType === type ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  <info.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{info.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {type === 'cccd' && 'Căn cước công dân 12 số (từ 2021)'}
                    {type === 'cmnd' && 'Chứng minh nhân dân 9 số (trước 2021)'}
                    {type === 'passport' && 'Hộ chiếu Việt Nam'}
                  </p>
                </div>
                {selectedDocType === type && (
                  <CheckCircle className="w-6 h-6 text-primary" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Lưu ý:</strong> Giấy tờ phải còn hiệu lực, rõ nét và không bị che khuất. 
          Thông tin trên giấy tờ phải khớp với thông tin tài khoản.
        </AlertDescription>
      </Alert>

      <Button onClick={() => setCurrentStep(2)} className="w-full">
        Tiếp tục
      </Button>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Camera className="w-16 h-16 text-primary mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Chụp ảnh giấy tờ</h3>
        <p className="text-muted-foreground">
          Chụp ảnh hoặc tải lên ảnh {documentTypes[selectedDocType].name}
        </p>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Tải file</TabsTrigger>
          <TabsTrigger value="camera">Chụp ảnh</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          {/* Front side upload */}
          <div className="space-y-2">
            <Label>Mặt trước {documentTypes[selectedDocType].name}</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
              {uploadedImages.front ? (
                <div className="space-y-2">
                  <img 
                    src={URL.createObjectURL(uploadedImages.front) || "/placeholder.svg"} 
                    alt="Front"
                    className="max-w-full max-h-48 mx-auto rounded"
                  />
                  <p className="text-sm font-medium text-green-600">
                    {uploadedImages.front.name}
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setUploadedImages(prev => ({ ...prev, front: null }))}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Chụp lại
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto" />
                  <p className="text-sm font-medium">Tải lên mặt trước</p>
                  <p className="text-xs text-muted-foreground">JPG, PNG tối đa 10MB</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const input = document.createElement('input')
                      input.type = 'file'
                      input.accept = 'image/*'
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0]
                        if (file) handleFileUpload('front', file)
                      }
                      input.click()
                    }}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Chọn file
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Back side upload (not for passport) */}
          {selectedDocType !== 'passport' && (
            <div className="space-y-2">
              <Label>Mặt sau {documentTypes[selectedDocType].name}</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                {uploadedImages.back ? (
                  <div className="space-y-2">
                    <img 
                      src={URL.createObjectURL(uploadedImages.back) || "/placeholder.svg"} 
                      alt="Back"
                      className="max-w-full max-h-48 mx-auto rounded"
                    />
                    <p className="text-sm font-medium text-green-600">
                      {uploadedImages.back.name}
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setUploadedImages(prev => ({ ...prev, back: null }))}
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Chụp lại
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto" />
                    <p className="text-sm font-medium">Tải lên mặt sau</p>
                    <p className="text-xs text-muted-foreground">JPG, PNG tối đa 10MB</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const input = document.createElement('input')
                        input.type = 'file'
                        input.accept = 'image/*'
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0]
                          if (file) handleFileUpload('back', file)
                        }
                        input.click()
                      }}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Chọn file
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="camera" className="space-y-4">
          <div className="space-y-4">
            {!cameraActive ? (
              <div className="text-center p-8 border-2 border-dashed border-border rounded-lg">
                <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  Nhấn nút bên dưới để bật camera và chụp ảnh giấy tờ
                </p>
                <Button onClick={startCamera}>
                  <Camera className="w-4 h-4 mr-2" />
                  Bật camera
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full rounded-lg"
                  />
                  <div className="absolute inset-0 border-2 border-primary rounded-lg pointer-events-none">
                    <div className="absolute top-4 left-4 w-8 h-8 border-l-4 border-t-4 border-primary"></div>
                    <div className="absolute top-4 right-4 w-8 h-8 border-r-4 border-t-4 border-primary"></div>
                    <div className="absolute bottom-4 left-4 w-8 h-8 border-l-4 border-b-4 border-primary"></div>
                    <div className="absolute bottom-4 right-4 w-8 h-8 border-r-4 border-b-4 border-primary"></div>
                  </div>
                </div>
                
                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={() => capturePhoto('front')}
                    disabled={!!uploadedImages.front}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Chụp mặt trước
                  </Button>
                  {selectedDocType !== 'passport' && (
                    <Button
                      onClick={() => capturePhoto('back')}
                      disabled={!!uploadedImages.back}
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Chụp mặt sau
                    </Button>
                  )}
                  <Button variant="outline" onClick={stopCamera}>
                    Tắt camera
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <canvas ref={canvasRef} className="hidden" />

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
          onClick={processDocument}
          disabled={isProcessing || !uploadedImages.front || (selectedDocType !== 'passport' && !uploadedImages.back)}
          className="flex-1"
        >
          {isProcessing ? (
            <>
              <Scan className="w-4 h-4 mr-2 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Xử lý AI
            </>
          )}
        </Button>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Scan className="w-16 h-16 text-primary mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Xác minh thông tin</h3>
        <p className="text-muted-foreground">
          Kiểm tra và chỉnh sửa thông tin được trích xuất từ giấy tờ
        </p>
      </div>

      {verificationResult && (
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold">Kết quả AI OCR</h4>
            <Badge variant={verificationResult.confidence > 0.8 ? 'default' : 'secondary'}>
              Độ tin cậy: {Math.round(verificationResult.confidence * 100)}%
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              {verificationResult.isValid ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-500" />
              )}
              <span>Giấy tờ hợp lệ: {verificationResult.isValid ? 'Có' : 'Không'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-500" />
              <span>Đã trích xuất: {Object.keys(extractedData).length} trường</span>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h4 className="font-semibold">Thông tin được trích xuất:</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documentTypes[selectedDocType].fields.map((field) => (
            <div key={field} className="space-y-2">
              <Label htmlFor={field}>{getFieldLabel(field)}</Label>
              <Input
                id={field}
                value={manualData[field as keyof DocumentData] || ''}
                onChange={(e) => setManualData(prev => ({ ...prev, [field]: e.target.value }))}
                className={extractedData[field as keyof DocumentData] ? 'bg-green-50 dark:bg-green-900/20' : ''}
                placeholder={`Nhập ${getFieldLabel(field).toLowerCase()}`}
              />
              {extractedData[field as keyof DocumentData] && (
                <p className="text-xs text-green-600">
                  ✓ Được trích xuất tự động
                </p>
              )}
            </div>
          ))}
        </div>

        {selectedDocType === 'cccd' && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>CCCD 12 số:</strong> Số căn cước phải có đúng 12 chữ số. 
              Ví dụ: 001234567890
            </AlertDescription>
          </Alert>
        )}

        {selectedDocType === 'passport' && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Hộ chiếu:</strong> Số hộ chiếu có định dạng 1 chữ cái + 7 chữ số. 
              Ví dụ: A1234567
            </AlertDescription>
          </Alert>
        )}
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
          onClick={() => setCurrentStep(2)}
          className="flex-1"
        >
          Quay lại
        </Button>
        <Button
          onClick={handleSubmitVerification}
          disabled={isProcessing}
          className="flex-1"
        >
          {isProcessing ? 'Đang gửi...' : 'Xác nhận thông tin'}
        </Button>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="text-center space-y-6">
      <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">
          Xác minh thành công!
        </h3>
        <p className="text-sm text-green-600 dark:text-green-300">
          Thông tin giấy tờ của bạn đã được xác minh và lưu trữ an toàn
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <span className="text-sm">Loại giấy tờ:</span>
          <Badge variant="outline">{documentTypes[selectedDocType].name}</Badge>
        </div>
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <span className="text-sm">Số giấy tờ:</span>
          <span className="text-sm font-mono">{manualData.number}</span>
        </div>
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <span className="text-sm">Họ và tên:</span>
          <span className="text-sm font-medium">{manualData.fullName}</span>
        </div>
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <span className="text-sm">Trạng thái:</span>
          <Badge className="bg-green-500">Đã xác minh</Badge>
        </div>
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Thông tin của bạn được mã hóa và bảo mật theo tiêu chuẩn quốc tế. 
          Chúng tôi chỉ sử dụng thông tin này để xác minh danh tính và tuân thủ quy định pháp luật.
        </AlertDescription>
      </Alert>

      <Button className="w-full">
        Hoàn thành xác minh
      </Button>
    </div>
  )

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Xác minh giấy tờ tùy thân</CardTitle>
        <p className="text-muted-foreground">
          Sử dụng AI để xác minh thông tin từ CCCD, CMND hoặc Hộ chiếu
        </p>
        <div className="mt-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Bước {currentStep}/4</span>
            <span>{Math.round((currentStep / 4) * 100)}%</span>
          </div>
          <Progress value={(currentStep / 4) * 100} className="h-2" />
        </div>
      </CardHeader>
      <CardContent>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </CardContent>
    </Card>
  )
}

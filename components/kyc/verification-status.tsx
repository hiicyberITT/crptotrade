"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  FileText,
  User,
  Shield,
  RefreshCw,
  Eye,
  Upload,
  CheckCircle2,
  Download,
  MessageSquare,
} from "lucide-react"

interface VerificationStatus {
  id: string
  documentType: "cccd" | "cmnd" | "passport"
  status: "pending" | "approved" | "rejected" | "pending_review" | "processing"
  confidence: number
  submittedAt: Date
  reviewedAt?: Date
  estimatedReviewTime?: string
  extractedData: any
  notes?: string[]
  reviewSteps: {
    step: string
    status: "completed" | "current" | "pending"
    completedAt?: Date
    description: string
  }[]
}

export function VerificationStatus() {
  const [verifications, setVerifications] = useState<VerificationStatus[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchVerificationStatus()
  }, [])

  const fetchVerificationStatus = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/kyc/verification-status")
      const data = await response.json()

      if (response.ok) {
        // Convert date strings back to Date objects
        const verifications = (data.verifications || []).map((v: any) => ({
          ...v,
          submittedAt: new Date(v.submittedAt),
          reviewedAt: v.reviewedAt ? new Date(v.reviewedAt) : undefined,
          reviewSteps: v.reviewSteps.map((step: any) => ({
            ...step,
            completedAt: step.completedAt ? new Date(step.completedAt) : undefined,
          })),
        }))
        setVerifications(verifications)
      }
    } catch (error) {
      console.error("Error fetching verification status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />
      case "pending_review":
        return <Clock className="w-5 h-5 text-yellow-500" />
      case "processing":
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
      default:
        return <AlertCircle className="w-5 h-5 text-blue-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500 text-white">✅ Đã duyệt</Badge>
      case "rejected":
        return <Badge variant="destructive">❌ Bị từ chối</Badge>
      case "pending_review":
        return <Badge className="bg-yellow-500 text-white">👁️ Đang xem xét</Badge>
      case "processing":
        return <Badge className="bg-blue-500 text-white">⚡ Đang xử lý</Badge>
      default:
        return <Badge variant="outline">⏳ Đang chờ</Badge>
    }
  }

  const getDocumentTypeName = (type: string) => {
    const names = {
      cccd: "Căn cước công dân",
      cmnd: "Chứng minh nhân dân",
      passport: "Hộ chiếu",
    }
    return names[type as keyof typeof names] || type
  }

  const getStepIcon = (stepStatus: string) => {
    switch (stepStatus) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case "current":
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  if (isLoading) {
    return (
      <Card className="bg-[#0F172A] border-[#1E293B]">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin mr-2 text-blue-400" />
            <span className="text-gray-300">Đang tải trạng thái xác minh...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (verifications.length === 0) {
    return (
      <Card className="bg-[#0F172A] border-[#1E293B]">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-white">Chưa có xác minh nào</h3>
          <p className="text-gray-400 mb-6">Bạn chưa gửi giấy tờ nào để xác minh danh tính</p>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            <Upload className="w-4 h-4 mr-2" />
            Bắt đầu xác minh
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Trạng thái xác minh</h2>
        <Button
          variant="outline"
          onClick={fetchVerificationStatus}
          className="border-[#334155] text-gray-300 hover:text-white hover:bg-[#1E293B] bg-transparent"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Làm mới
        </Button>
      </div>

      {verifications.map((verification) => (
        <Card key={verification.id} className="bg-[#0F172A] border-[#1E293B]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-white">
                {getStatusIcon(verification.status)}
                {getDocumentTypeName(verification.documentType)}
              </CardTitle>
              {getStatusBadge(verification.status)}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Progress Steps */}
            <div className="space-y-4">
              <h4 className="font-semibold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                Tiến độ xác minh
              </h4>
              <div className="space-y-3">
                {verification.reviewSteps.map((step, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-[#1E293B] rounded-lg">
                    {getStepIcon(step.status)}
                    <div className="flex-1">
                      <div className="text-white font-medium">{step.step}</div>
                      <div className="text-gray-400 text-sm">{step.description}</div>
                      {step.completedAt && (
                        <div className="text-green-400 text-xs mt-1">
                          Hoàn thành: {step.completedAt.toLocaleString("vi-VN")}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-[#334155]" />

            {/* Basic Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="p-3 bg-[#1E293B] rounded-lg">
                <span className="text-gray-400 block mb-1">Số giấy tờ:</span>
                <p className="font-mono font-medium text-white">{verification.extractedData.number}</p>
              </div>
              <div className="p-3 bg-[#1E293B] rounded-lg">
                <span className="text-gray-400 block mb-1">Họ tên:</span>
                <p className="font-medium text-white">{verification.extractedData.fullName}</p>
              </div>
              <div className="p-3 bg-[#1E293B] rounded-lg">
                <span className="text-gray-400 block mb-1">Ngày gửi:</span>
                <p className="text-white">{verification.submittedAt.toLocaleDateString("vi-VN")}</p>
              </div>
              <div className="p-3 bg-[#1E293B] rounded-lg">
                <span className="text-gray-400 block mb-1">Độ tin cậy:</span>
                <div className="flex items-center gap-2">
                  <Progress value={verification.confidence * 100} className="h-2 flex-1" />
                  <span className="text-xs text-white">{Math.round(verification.confidence * 100)}%</span>
                </div>
              </div>
            </div>

            {/* Status Details */}
            {verification.status === "processing" && (
              <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
                <AlertDescription className="text-blue-800 dark:text-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">Đang xử lý tự động...</div>
                      <div className="text-sm mt-1">
                        Hệ thống AI đang phân tích giấy tờ của bạn. Quá trình này thường mất 2-5 phút.
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {verification.status === "pending_review" && (
              <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
                <Clock className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                  <div className="space-y-2">
                    <div className="font-semibold">Đang chờ xem xét thủ công</div>
                    <div className="text-sm">
                      Giấy tờ của bạn cần được xem xét bởi nhân viên. Thời gian dự kiến:{" "}
                      <strong>{verification.estimatedReviewTime || "1-3 ngày làm việc"}</strong>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>Hỗ trợ 24/7</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Shield className="w-4 h-4" />
                        <span>Bảo mật tuyệt đối</span>
                      </div>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {verification.status === "approved" && (
              <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  <div className="space-y-2">
                    <div className="font-semibold">🎉 Xác minh thành công!</div>
                    <div className="text-sm">
                      Giấy tờ đã được xác minh thành công. Tài khoản của bạn đã được nâng cấp với các quyền lợi:
                    </div>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• Giới hạn giao dịch: $10,000/ngày</li>
                      <li>• Rút tiền không giới hạn</li>
                      <li>• Truy cập tính năng margin trading</li>
                      <li>• Ưu tiên hỗ trợ khách hàng VIP</li>
                    </ul>
                    {verification.reviewedAt && (
                      <div className="text-xs mt-2 p-2 bg-green-100 dark:bg-green-800/30 rounded">
                        Duyệt lúc: {verification.reviewedAt.toLocaleString("vi-VN")}
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {verification.status === "rejected" && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="font-semibold">Giấy tờ không thể xác minh</div>
                    <div className="text-sm">
                      Vui lòng kiểm tra lại thông tin và gửi lại với chất lượng ảnh tốt hơn.
                    </div>
                    {verification.notes && verification.notes.length > 0 && (
                      <div className="mt-3">
                        <strong>Lý do cụ thể:</strong>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          {verification.notes.map((note, index) => (
                            <li key={index} className="text-sm">
                              {note}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                      <div className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                        💡 Mẹo để xác minh thành công:
                      </div>
                      <ul className="text-xs text-red-700 dark:text-red-300 space-y-1">
                        <li>• Chụp ảnh trong điều kiện ánh sáng tốt</li>
                        <li>• Đảm bảo 4 góc giấy tờ đều hiển thị rõ</li>
                        <li>• Không bị mờ, nhòe hoặc phản quang</li>
                        <li>• Thông tin phải khớp với tài khoản đăng ký</li>
                      </ul>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Actions */}
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                className="border-[#334155] text-gray-300 hover:text-white hover:bg-[#1E293B] bg-transparent"
              >
                <Eye className="w-4 h-4 mr-2" />
                Xem chi tiết
              </Button>

              {verification.status === "approved" && (
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <Download className="w-4 h-4 mr-2" />
                  Tải chứng nhận
                </Button>
              )}

              {verification.status === "rejected" && (
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Gửi lại
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                className="border-[#334155] text-gray-300 hover:text-white hover:bg-[#1E293B] bg-transparent"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Liên hệ hỗ trợ
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Overall KYC Status */}
      <Card className="bg-[#0F172A] border-[#1E293B]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Shield className="w-5 h-5 text-blue-400" />
            Tổng quan xác minh
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border border-[#334155] rounded-lg bg-[#1E293B]">
              <User className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <h4 className="font-semibold text-white">Cấp độ hiện tại</h4>
              <Badge variant="outline" className="mt-1 border-[#334155] text-gray-300">
                {verifications.some((v) => v.status === "approved") ? "✅ Đã xác minh" : "⏳ Chưa xác minh"}
              </Badge>
            </div>

            <div className="text-center p-4 border border-[#334155] rounded-lg bg-[#1E293B]">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <h4 className="font-semibold text-white">Đã duyệt</h4>
              <p className="text-2xl font-bold text-green-400">
                {verifications.filter((v) => v.status === "approved").length}
              </p>
            </div>

            <div className="text-center p-4 border border-[#334155] rounded-lg bg-[#1E293B]">
              <Clock className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <h4 className="font-semibold text-white">Chờ duyệt</h4>
              <p className="text-2xl font-bold text-yellow-400">
                {verifications.filter((v) => v.status === "pending_review").length}
              </p>
            </div>

            <div className="text-center p-4 border border-[#334155] rounded-lg bg-[#1E293B]">
              <RefreshCw className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <h4 className="font-semibold text-white">Đang xử lý</h4>
              <p className="text-2xl font-bold text-blue-400">
                {verifications.filter((v) => v.status === "processing").length}
              </p>
            </div>
          </div>

          {/* Benefits Section */}
          <Separator className="my-6 bg-[#334155]" />
          <div className="space-y-4">
            <h4 className="font-semibold text-white">🎁 Quyền lợi sau khi xác minh</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-600/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-blue-400" />
                  <span className="font-medium text-white">Bảo mật nâng cao</span>
                </div>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Bảo vệ tài khoản 2FA</li>
                  <li>• Whitelist địa chỉ rút tiền</li>
                  <li>• Thông báo giao dịch realtime</li>
                </ul>
              </div>

              <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-600/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="font-medium text-white">Giới hạn cao</span>
                </div>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Giao dịch $10,000/ngày</li>
                  <li>• Rút tiền không giới hạn</li>
                  <li>• Margin trading x10</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

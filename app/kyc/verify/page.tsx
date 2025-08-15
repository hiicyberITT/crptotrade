'use client'

import { DocumentVerification } from '@/components/kyc/document-verification'
import { VerificationStatus } from '@/components/kyc/verification-status'
import { ThemeToggle } from '@/components/theme-toggle'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Bitcoin, ArrowLeft, Shield, FileText, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function KYCVerifyPage() {
  return (
    <div className="min-h-screen bg-[#0B1426]">
      {/* Header */}
      <div className="bg-[#0F172A] border-b border-[#1E293B] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/account">
                <Button variant="outline" size="sm" className="border-[#334155] text-gray-300 hover:text-white hover:bg-[#1E293B]">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Quay lại tài khoản
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Xác thực danh tính (KYC)</h1>
                  <p className="text-sm text-gray-400">Tải lên CCCD, CMND hoặc Hộ chiếu để xác minh</p>
                </div>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="max-w-7xl mx-auto p-4">
        <Alert className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <div className="font-semibold">Tại sao cần xác thực danh tính?</div>
              <ul className="text-sm space-y-1 ml-4">
                <li>• Tăng giới hạn giao dịch lên $10,000/ngày</li>
                <li>• Bảo vệ tài khoản khỏi gian lận</li>
                <li>• Tuân thủ quy định pháp luật về chống rửa tiền</li>
                <li>• Truy cập đầy đủ tính năng nâng cao</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>

        {/* Process Steps */}
        <div className="mb-8 p-6 bg-[#0F172A] border border-[#1E293B] rounded-lg">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            Quy trình xác thực
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-[#1E293B] rounded-lg">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                1
              </div>
              <div>
                <div className="text-white font-medium">Chọn loại giấy tờ</div>
                <div className="text-gray-400 text-sm">CCCD, CMND hoặc Hộ chiếu</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-[#1E293B] rounded-lg">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                2
              </div>
              <div>
                <div className="text-white font-medium">Tải lên ảnh</div>
                <div className="text-gray-400 text-sm">Ảnh rõ nét, đầy đủ 4 góc</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-[#1E293B] rounded-lg">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                3
              </div>
              <div>
                <div className="text-white font-medium">Chờ xác minh</div>
                <div className="text-gray-400 text-sm">1-3 ngày làm việc</div>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="verify" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto bg-[#1E293B] border-[#334155]">
            <TabsTrigger 
              value="verify" 
              className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-[#334155]"
            >
              <FileText className="w-4 h-4 mr-2" />
              Xác minh mới
            </TabsTrigger>
            <TabsTrigger 
              value="status"
              className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-[#334155]"
            >
              <Clock className="w-4 h-4 mr-2" />
              Trạng thái
            </TabsTrigger>
          </TabsList>

          <TabsContent value="verify">
            <DocumentVerification />
          </TabsContent>

          <TabsContent value="status">
            <VerificationStatus />
          </TabsContent>
        </Tabs>

        {/* Support Info */}
        <div className="mt-8 p-4 bg-[#0F172A] border border-[#1E293B] rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
            <div>
              <div className="text-white font-medium mb-1">Cần hỗ trợ?</div>
              <div className="text-gray-400 text-sm">
                Nếu gặp khó khăn trong quá trình xác thực, vui lòng liên hệ bộ phận hỗ trợ khách hàng 24/7.
              </div>
              <div className="flex gap-4 mt-2 text-sm">
                <span className="text-blue-400">📧 support@cryptotrade.vn</span>
                <span className="text-green-400">📞 1900-1234</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

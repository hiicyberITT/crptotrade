'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from 'lucide-react'

export function OAuthErrorHandler() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam) {
      setError(errorParam)
      // Clean up URL
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete('error')
      window.history.replaceState({}, '', newUrl.toString())
    }
  }, [searchParams])

  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case 'oauth_cancelled':
        return 'Bạn đã hủy đăng nhập bằng mạng xã hội.'
      case 'oauth_access_denied':
        return 'Quyền truy cập bị từ chối. Vui lòng thử lại.'
      case 'oauth_state_mismatch':
        return 'Lỗi bảo mật. Vui lòng thử đăng nhập lại.'
      case 'oauth_invalid_request':
        return 'Yêu cầu không hợp lệ. Vui lòng thử lại.'
      case 'oauth_callback_error':
        return 'Có lỗi xảy ra trong quá trình đăng nhập. Vui lòng thử lại.'
      case 'oauth_email_required':
        return 'Cần quyền truy cập email để tiếp tục. Vui lòng cấp quyền và thử lại.'
      case 'oauth_error':
        return 'Có lỗi xảy ra với dịch vụ đăng nhập. Vui lòng thử lại sau.'
      default:
        return 'Có lỗi không xác định xảy ra. Vui lòng thử lại.'
    }
  }

  const handleRetry = () => {
    setError(null)
    router.refresh()
  }

  const handleRegisterSuggestion = () => {
    setError(null)
    const newUrl = new URL(window.location.href)
    newUrl.searchParams.set('tab', 'register')
    router.push(newUrl.toString())
  }

  if (!error) return null

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex flex-col gap-3">
        <span>{getErrorMessage(error)}</span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRetry}
            className="h-8"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Thử lại
          </Button>
          {error === 'user_not_found' && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRegisterSuggestion}
              className="h-8"
            >
              Đăng ký tài khoản
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  )
}

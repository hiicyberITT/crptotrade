import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Mock verification data with detailed review steps
    const mockVerifications = [
      {
        id: '1',
        documentType: 'cccd',
        status: 'approved',
        confidence: 0.95,
        submittedAt: new Date('2024-01-10T10:00:00'),
        reviewedAt: new Date('2024-01-11T14:30:00'),
        extractedData: {
          number: '001234567890',
          fullName: 'NGUYỄN VĂN A',
          dateOfBirth: '01/01/1990',
          gender: 'Nam',
          nationality: 'Việt Nam'
        },
        reviewSteps: [
          {
            step: 'Tải lên thành công',
            status: 'completed',
            completedAt: new Date('2024-01-10T10:00:00'),
            description: 'Ảnh giấy tờ đã được tải lên hệ thống'
          },
          {
            step: 'Xử lý AI',
            status: 'completed',
            completedAt: new Date('2024-01-10T10:02:00'),
            description: 'AI đã trích xuất thông tin từ giấy tờ'
          },
          {
            step: 'Xem xét thủ công',
            status: 'completed',
            completedAt: new Date('2024-01-11T14:30:00'),
            description: 'Nhân viên đã xác minh thông tin'
          },
          {
            step: 'Hoàn thành',
            status: 'completed',
            completedAt: new Date('2024-01-11T14:30:00'),
            description: 'Tài khoản đã được nâng cấp'
          }
        ]
      },
      {
        id: '2',
        documentType: 'passport',
        status: 'processing',
        confidence: 0.78,
        submittedAt: new Date('2024-01-15T16:20:00'),
        estimatedReviewTime: '2-5 phút',
        extractedData: {
          number: 'A1234567',
          fullName: 'NGUYEN VAN A',
          dateOfBirth: '01/01/1990',
          nationality: 'VNM'
        },
        reviewSteps: [
          {
            step: 'Tải lên thành công',
            status: 'completed',
            completedAt: new Date('2024-01-15T16:20:00'),
            description: 'Ảnh giấy tờ đã được tải lên hệ thống'
          },
          {
            step: 'Xử lý AI',
            status: 'current',
            description: 'AI đang phân tích và trích xuất thông tin'
          },
          {
            step: 'Xem xét thủ công',
            status: 'pending',
            description: 'Chờ nhân viên xác minh (nếu cần)'
          },
          {
            step: 'Hoàn thành',
            status: 'pending',
            description: 'Nâng cấp tài khoản'
          }
        ]
      },
      {
        id: '3',
        documentType: 'cmnd',
        status: 'rejected',
        confidence: 0.45,
        submittedAt: new Date('2024-01-12T09:15:00'),
        reviewedAt: new Date('2024-01-13T11:20:00'),
        extractedData: {
          number: '123456789',
          fullName: 'NGUYEN VAN B',
          dateOfBirth: '15/05/1985',
          gender: 'Nam'
        },
        notes: [
          'Ảnh bị mờ, không đọc được thông tin rõ ràng',
          'Góc trên bên phải bị che khuất',
          'Chất lượng ảnh quá thấp (dưới 300 DPI)'
        ],
        reviewSteps: [
          {
            step: 'Tải lên thành công',
            status: 'completed',
            completedAt: new Date('2024-01-12T09:15:00'),
            description: 'Ảnh giấy tờ đã được tải lên hệ thống'
          },
          {
            step: 'Xử lý AI',
            status: 'completed',
            completedAt: new Date('2024-01-12T09:17:00'),
            description: 'AI phát hiện chất lượng ảnh không đạt yêu cầu'
          },
          {
            step: 'Xem xét thủ công',
            status: 'completed',
            completedAt: new Date('2024-01-13T11:20:00'),
            description: 'Nhân viên xác nhận từ chối do chất lượng ảnh'
          },
          {
            step: 'Hoàn thành',
            status: 'completed',
            completedAt: new Date('2024-01-13T11:20:00'),
            description: 'Yêu cầu gửi lại với ảnh chất lượng cao hơn'
          }
        ]
      }
    ]

    // Filter verifications for current user and convert dates
    const userVerifications = mockVerifications.map(v => ({
      ...v,
      submittedAt: new Date(v.submittedAt),
      reviewedAt: v.reviewedAt ? new Date(v.reviewedAt) : undefined,
      reviewSteps: v.reviewSteps.map(step => ({
        ...step,
        completedAt: step.completedAt ? new Date(step.completedAt) : undefined
      }))
    }))

    return NextResponse.json({
      success: true,
      verifications: userVerifications,
      summary: {
        total: userVerifications.length,
        approved: userVerifications.filter(v => v.status === 'approved').length,
        pending: userVerifications.filter(v => v.status === 'pending_review').length,
        processing: userVerifications.filter(v => v.status === 'processing').length,
        rejected: userVerifications.filter(v => v.status === 'rejected').length
      }
    })

  } catch (error) {
    console.error('Get verification status error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      documentType,
      extractedData,
      verificationResult,
      images
    } = await request.json()

    // Validate required data
    if (!documentType || !extractedData || !verificationResult) {
      return NextResponse.json({ error: 'Missing required data' }, { status: 400 })
    }

    // Additional validation based on document type
    const requiredFields = {
      cccd: ['number', 'fullName', 'dateOfBirth', 'gender', 'nationality'],
      cmnd: ['number', 'fullName', 'dateOfBirth', 'gender'],
      passport: ['number', 'fullName', 'dateOfBirth', 'nationality']
    }

    const required = requiredFields[documentType as keyof typeof requiredFields] || []
    
    for (const field of required) {
      if (!extractedData[field]) {
        return NextResponse.json({ 
          error: `Missing required field: ${field}` 
        }, { status: 400 })
      }
    }

    // Create verification record
    const verificationRecord = {
      id: crypto.randomUUID(),
      userId: user.id,
      documentType,
      documentNumber: extractedData.number,
      extractedData,
      verificationResult,
      images,
      status: verificationResult.confidence > 0.8 ? 'approved' : 'pending_review',
      submittedAt: new Date(),
      reviewedAt: null,
      reviewedBy: null,
      notes: []
    }

    // In production, save to database
    console.log('Document verification submitted:', verificationRecord)

    // Check for potential fraud indicators
    const fraudChecks = {
      duplicateDocument: false, // Check if document number already exists
      suspiciousData: verificationResult.confidence < 0.5,
      imageQuality: verificationResult.confidence > 0.7,
      dataConsistency: true // Check if extracted data is consistent
    }

    // Auto-approve if high confidence and no fraud indicators
    let finalStatus = 'pending_review'
    if (verificationResult.confidence > 0.9 && !fraudChecks.suspiciousData) {
      finalStatus = 'approved'
    } else if (verificationResult.confidence < 0.3 || fraudChecks.suspiciousData) {
      finalStatus = 'rejected'
    }

    // Update user KYC status
    const kycUpdate = {
      documentVerified: finalStatus === 'approved',
      documentType,
      documentNumber: extractedData.number,
      verificationLevel: finalStatus === 'approved' ? 'level_2' : 'level_1',
      lastVerificationDate: new Date()
    }

    console.log('KYC status updated:', kycUpdate)

    // Send notification based on status
    if (finalStatus === 'approved') {
      // Send approval notification
      console.log('Sending approval notification to user:', user.email)
    } else if (finalStatus === 'rejected') {
      // Send rejection notification
      console.log('Sending rejection notification to user:', user.email)
    } else {
      // Send pending review notification
      console.log('Sending pending review notification to user:', user.email)
    }

    return NextResponse.json({
      success: true,
      verificationId: verificationRecord.id,
      status: finalStatus,
      confidence: verificationResult.confidence,
      message: getStatusMessage(finalStatus),
      estimatedReviewTime: finalStatus === 'pending_review' ? '1-3 business days' : null
    })

  } catch (error) {
    console.error('Submit verification error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function getStatusMessage(status: string): string {
  switch (status) {
    case 'approved':
      return 'Giấy tờ của bạn đã được xác minh thành công. Tài khoản đã được nâng cấp.'
    case 'rejected':
      return 'Giấy tờ không thể xác minh. Vui lòng kiểm tra lại thông tin và thử lại.'
    case 'pending_review':
      return 'Giấy tờ đang được xem xét thủ công. Chúng tôi sẽ thông báo kết quả trong 1-3 ngày làm việc.'
    default:
      return 'Trạng thái không xác định.'
  }
}

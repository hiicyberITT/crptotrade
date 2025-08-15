import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    
    // Extract personal info
    const personalInfo = {
      fullName: formData.get('fullName') as string,
      dateOfBirth: formData.get('dateOfBirth') as string,
      nationality: formData.get('nationality') as string,
      idNumber: formData.get('idNumber') as string,
      idType: formData.get('idType') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      postalCode: formData.get('postalCode') as string,
      country: formData.get('country') as string,
      occupation: formData.get('occupation') as string
    }

    // Extract files
    const files = {
      idFront: formData.get('idFront') as File,
      idBack: formData.get('idBack') as File,
      selfie: formData.get('selfie') as File,
      proofOfAddress: formData.get('proofOfAddress') as File
    }

    // Validate required fields
    const requiredFields = ['fullName', 'dateOfBirth', 'nationality', 'idNumber', 'idType', 'address', 'city', 'country']
    for (const field of requiredFields) {
      if (!personalInfo[field as keyof typeof personalInfo]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    // Validate required files
    if (!files.idFront || !files.idBack || !files.selfie) {
      return NextResponse.json({ error: 'Required documents are missing' }, { status: 400 })
    }

    // In real app, save files to storage and personal info to database
    console.log('KYC submission for user:', user.id)
    console.log('Personal info:', personalInfo)
    console.log('Files uploaded:', Object.keys(files).filter(key => files[key as keyof typeof files]))

    // Mock KYC processing
    const kycSubmission = {
      id: crypto.randomUUID(),
      userId: user.id,
      personalInfo,
      files: Object.keys(files).filter(key => files[key as keyof typeof files]),
      status: 'pending',
      submittedAt: new Date(),
      reviewedAt: null,
      reviewedBy: null
    }

    return NextResponse.json({
      success: true,
      kycId: kycSubmission.id,
      status: 'pending',
      message: 'KYC submitted successfully. Review will be completed within 1-3 business days.'
    })

  } catch (error) {
    console.error('KYC submission error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

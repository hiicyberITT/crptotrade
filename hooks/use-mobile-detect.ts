'use client'

import { useState, useEffect } from 'react'

export function useMobileDetect() {
  const [isMobile, setIsMobile] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone']
      const isMobileUA = mobileKeywords.some(keyword => userAgent.includes(keyword))
      const isMobileScreen = window.innerWidth < 768
      
      setIsMobile(isMobileUA || isMobileScreen)
      setIsLoading(false)
    }

    // Initial check
    checkDevice()

    // Listen for resize events
    const handleResize = () => {
      const isMobileScreen = window.innerWidth < 768
      const userAgent = navigator.userAgent.toLowerCase()
      const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone']
      const isMobileUA = mobileKeywords.some(keyword => userAgent.includes(keyword))
      
      setIsMobile(isMobileUA || isMobileScreen)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return { isMobile, isLoading }
}

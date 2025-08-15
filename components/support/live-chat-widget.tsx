'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, X, Send, Phone, Mail, Clock, Minimize2, Maximize2, Bot, User, Headphones } from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot' | 'agent'
  timestamp: Date
  type?: 'text' | 'quick-reply' | 'system'
}

type Position = { x: number; y: number }

const BUTTON_SIZE = 56 // w-14 h-14
const EDGE_MARGIN = 12
const POS_KEY = 'livechat_launcher_pos_v1'

function clampPos(pos: Position, vw: number, vh: number): Position {
  const maxX = Math.max(EDGE_MARGIN, vw - BUTTON_SIZE - EDGE_MARGIN)
  const maxY = Math.max(EDGE_MARGIN, vh - BUTTON_SIZE - EDGE_MARGIN)
  return {
    x: Math.min(Math.max(pos.x, EDGE_MARGIN), maxX),
    y: Math.min(Math.max(pos.y, EDGE_MARGIN), maxY),
  }
}

export function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOnline, setIsOnline] = useState(true)

  // Draggable launcher state
  const [launcherPos, setLauncherPos] = useState<Position>({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragOffsetRef = useRef<{ dx: number; dy: number }>({ dx: 0, dy: 0 })
  const wasDraggedRef = useRef(false)
  const launcherRef = useRef<HTMLDivElement>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Simulate online status
    const interval = setInterval(() => {
      setIsOnline(Math.random() > 0.1) // 90% online
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  // Initialize and persist launcher position
  useEffect(() => {
    const init = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const defaultPos: Position = {
        x: vw - BUTTON_SIZE - 24,
        y: vh - BUTTON_SIZE - 24,
      }
      try {
        const saved = localStorage.getItem(POS_KEY)
        if (saved) {
          const parsed = JSON.parse(saved) as Position
          setLauncherPos(clampPos(parsed, vw, vh))
        } else {
          setLauncherPos(clampPos(defaultPos, vw, vh))
        }
      } catch {
        setLauncherPos(clampPos(defaultPos, vw, vh))
      }
    }
    init()
    const onResize = () => {
      setLauncherPos((prev) => clampPos(prev, window.innerWidth, window.innerHeight))
    }
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
    }
  }, [])

  const persistPos = (pos: Position) => {
    try {
      localStorage.setItem(POS_KEY, JSON.stringify(pos))
    } catch {
      // ignore
    }
  }

  const startDrag = (clientX: number, clientY: number) => {
    setIsDragging(true)
    wasDraggedRef.current = false
    dragOffsetRef.current = {
      dx: clientX - launcherPos.x,
      dy: clientY - launcherPos.y,
    }
  }

  const onDrag = (clientX: number, clientY: number) => {
    if (!isDragging) return
    const vw = window.innerWidth
    const vh = window.innerHeight
    const next = clampPos(
      { x: clientX - dragOffsetRef.current.dx, y: clientY - dragOffsetRef.current.dy },
      vw,
      vh
    )
    // If moved more than 6px, treat as drag (avoid accidental click)
    if (Math.abs(next.x - launcherPos.x) + Math.abs(next.y - launcherPos.y) > 6) {
      wasDraggedRef.current = true
    }
    setLauncherPos(next)
  }

  const endDrag = () => {
    if (!isDragging) return
    setIsDragging(false)
    persistPos(launcherPos)
  }

  // Global listeners for mouse/touch drag
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => onDrag(e.clientX, e.clientY)
    const onMouseUp = () => endDrag()
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        onDrag(e.touches[0].clientX, e.touches[0].clientY)
        // Prevent scrolling while dragging
        if (isDragging) e.preventDefault()
      }
    }
    const onTouchEnd = () => endDrag()

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('mouseup', onMouseUp)
      window.addEventListener('touchmove', onTouchMove, { passive: false })
      window.addEventListener('touchend', onTouchEnd)
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [isDragging]) // eslint-disable-line react-hooks/exhaustive-deps

  const addMessage = (text: string, sender: 'user' | 'bot' | 'agent', type: 'text' | 'quick-reply' | 'system' = 'text') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
      type
    }
    setMessages(prev => [...prev, newMessage])
    
    if (sender !== 'user' && (!isOpen || isMinimized)) {
      setUnreadCount(prev => prev + 1)
    }
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    addMessage(inputValue, 'user')
    setInputValue('')
    setIsTyping(true)

    // Simulate bot response
    setTimeout(() => {
      setIsTyping(false)
      const responses = getBotResponse(inputValue)
      responses.forEach((response, index) => {
        setTimeout(() => {
          addMessage(response, 'bot')
        }, index * 1000)
      })
    }, 1500)
  }

  const getBotResponse = (userMessage: string): string[] => {
    const message = userMessage.toLowerCase()
    
    if (message.includes('kyc') || message.includes('xác minh') || message.includes('xác thực')) {
      return [
        '🔐 Tôi hiểu bạn cần hỗ trợ về KYC! Đây là quy trình xác minh danh tính để bảo vệ tài khoản.',
        '📋 Bạn cần chuẩn bị: CCCD/CMND/Hộ chiếu, chụp ảnh rõ nét, đầy đủ 4 góc.',
        '⏱️ Thời gian xử lý: AI tự động (2-5 phút) hoặc xem xét thủ công (1-3 ngày).',
        'Bạn có cần hướng dẫn chi tiết không? 😊'
      ]
    }
    
    if (message.includes('giao dịch') || message.includes('trade') || message.includes('mua') || message.includes('bán')) {
      return [
        '💰 Về giao dịch, chúng tôi hỗ trợ mua/bán Bitcoin và 50+ altcoin khác!',
        '📊 Phí giao dịch chỉ 0.1% - cạnh tranh nhất thị trường.',
        '🚀 Margin trading x10 cho tài khoản đã xác minh KYC.',
        'Bạn muốn biết thêm về loại giao dịch nào? 🤔'
      ]
    }
    
    if (message.includes('rút tiền') || message.includes('nạp tiền') || message.includes('withdraw') || message.includes('deposit')) {
      return [
        '💳 Về nạp/rút tiền:',
        '• Nạp tiền: Chuyển khoản ngân hàng, ví điện tử (5-15 phút)',
        '• Rút tiền: Tài khoản KYC rút không giới hạn, chưa KYC giới hạn $100/ngày',
        '• Phí rút: 0.0005 BTC, phí nạp: Miễn phí',
        'Cần hỗ trợ thêm không? 💪'
      ]
    }
    
    if (message.includes('bảo mật') || message.includes('security') || message.includes('2fa')) {
      return [
        '🛡️ Bảo mật là ưu tiên hàng đầu của chúng tôi!',
        '🔐 2FA, whitelist IP, email xác nhận giao dịch',
        '❄️ 95% tài sản lưu trữ cold wallet offline',
        '🏦 Bảo hiểm tài sản lên đến $100M',
        'Tài khoản của bạn đã bật 2FA chưa? 🔒'
      ]
    }

    // Default responses
    const defaultResponses = [
      [
        '👋 Xin chào! Tôi là AI Assistant của sàn giao dịch.',
        '🤖 Tôi có thể hỗ trợ bạn về: KYC, giao dịch, nạp/rút tiền, bảo mật.',
        'Bạn cần hỗ trợ gì hôm nay? 😊'
      ],
      [
        '💡 Tôi hiểu bạn cần hỗ trợ!',
        '📞 Nếu cần hỗ trợ nhanh, bạn có thể gọi hotline: 1900-1234',
        '💬 Hoặc tiếp tục chat với tôi, tôi sẽ cố gắng giúp bạn!'
      ],
      [
        '🔍 Tôi đang tìm hiểu câu hỏi của bạn...',
        '⚡ Trong lúc chờ, bạn có thể xem FAQ hoặc liên hệ nhân viên hỗ trợ.',
        '🎯 Hãy mô tả cụ thể hơn để tôi hỗ trợ tốt nhất!'
      ]
    ]
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  const handleQuickReply = (reply: string) => {
    addMessage(reply, 'user', 'quick-reply')
    setIsTyping(true)
    
    setTimeout(() => {
      setIsTyping(false)
      const responses = getBotResponse(reply)
      responses.forEach((response, index) => {
        setTimeout(() => {
          addMessage(response, 'bot')
        }, index * 1000)
      })
    }, 1000)
  }

  const openChat = () => {
    setIsOpen(true)
    setIsMinimized(false)
    setUnreadCount(0)
    
    if (messages.length === 0) {
      setTimeout(() => {
        addMessage('👋 Xin chào! Tôi là AI Assistant. Tôi có thể hỗ trợ bạn về KYC, giao dịch, và các dịch vụ khác. Bạn cần hỗ trợ gì? 😊', 'bot', 'system')
      }, 500)
    }
  }

  const quickReplies = [
    { text: '🔐 Hướng dẫn KYC', value: 'Hướng dẫn xác minh KYC' },
    { text: '💰 Phí giao dịch', value: 'Phí giao dịch là bao nhiêu' },
    { text: '💳 Nạp/rút tiền', value: 'Hướng dẫn nạp rút tiền' },
    { text: '🛡️ Bảo mật tài khoản', value: 'Cách bảo mật tài khoản' },
    { text: '📞 Liên hệ nhân viên', value: 'Tôi muốn nói chuyện với nhân viên' }
  ]

  // Draggable launcher (only when chat is closed)
  if (!isOpen) {
    return (
      <div
        ref={launcherRef}
        className="fixed z-50 touch-none select-none"
        style={{ left: launcherPos.x, top: launcherPos.y }}
        onMouseDown={(e) => {
          // Left click only
          if (e.button !== 0) return
          startDrag(e.clientX, e.clientY)
        }}
        onTouchStart={(e) => {
          if (e.touches[0]) startDrag(e.touches[0].clientX, e.touches[0].clientY)
        }}
        aria-label="Nút mở hỗ trợ khách hàng có thể kéo thả"
      >
        <Button
          onClick={() => {
            // If it was dragged, don't treat as click
            if (wasDraggedRef.current) return
            openChat()
          }}
          className={`relative w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg transition-all duration-200 ${isDragging ? 'scale-95 cursor-grabbing' : 'hover:scale-110 cursor-grab'}`}
        >
          <MessageCircle className="w-6 h-6 text-white" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
          <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'} border-2 border-white`} />
        </Button>
      </div>
    )
  }

  // Open chat window (fixed bottom-right as before)
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`w-96 bg-[#0F172A] border-[#1E293B] shadow-2xl transition-all duration-300 ${isMinimized ? 'h-16' : 'h-[600px]'}`}>
        <CardHeader className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Headphones className="w-5 h-5" />
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'} border border-white`} />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold">Hỗ trợ khách hàng</CardTitle>
                <div className="text-xs opacity-90">
                  {isOnline ? '🟢 Đang online' : '🔴 Offline'} • Phản hồi trong 1 phút
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="w-8 h-8 p-0 hover:bg-white/20"
                aria-label={isMinimized ? 'Mở rộng cửa sổ chat' : 'Thu nhỏ cửa sổ chat'}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 p-0 hover:bg-white/20"
                aria-label="Đóng cửa sổ chat"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[536px]">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0B1426]">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start gap-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      message.sender === 'user' 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                    }`}>
                      {message.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={`rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                        : 'bg-[#1E293B] text-gray-200 border border-[#334155]'
                    }`}>
                      <div className="text-sm whitespace-pre-wrap">{message.text}</div>
                      <div className={`text-xs mt-1 opacity-70 ${
                        message.sender === 'user' ? 'text-blue-100' : 'text-gray-400'
                      }`}>
                        {message.timestamp.toLocaleTimeString('vi-VN', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {messages.length <= 1 && (
              <div className="p-3 bg-[#0F172A] border-t border-[#1E293B]">
                <div className="text-xs text-gray-400 mb-2">💡 Câu hỏi thường gặp:</div>
                <div className="flex flex-wrap gap-2">
                  {quickReplies.slice(0, 3).map((reply, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickReply(reply.value)}
                      className="text-xs border-[#334155] text-gray-300 hover:text-white hover:bg-[#1E293B]"
                    >
                      {reply.text}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 bg-[#0F172A] border-t border-[#1E293B]">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage() }}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 bg-[#1E293B] border-[#334155] text-white placeholder-gray-400"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Contact Info */}
              <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  <span>1900-1234</span>
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  <span>support@crypto.vn</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>24/7</span>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}

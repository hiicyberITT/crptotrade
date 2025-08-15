'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageCircle, Phone, Mail, Clock, User, Send, Search, HelpCircle, FileText, Zap, Shield, DollarSign, AlertCircle, CheckCircle } from 'lucide-react'

interface SupportTicket {
  id: string
  subject: string
  category: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in-progress' | 'resolved' | 'closed'
  createdAt: string
  lastUpdate: string
  messages: {
    id: string
    sender: 'user' | 'support'
    message: string
    timestamp: string
  }[]
}

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
  helpful: number
}

export function CustomerSupport() {
  const [activeTab, setActiveTab] = useState('chat')
  const [chatMessage, setChatMessage] = useState('')
  const [isOnline, setIsOnline] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: '',
    priority: 'medium',
    message: ''
  })

  const supportTickets: SupportTicket[] = [
    {
      id: 'TK001',
      subject: 'Không thể rút tiền',
      category: 'withdrawal',
      priority: 'high',
      status: 'in-progress',
      createdAt: '2024-01-20T10:30:00Z',
      lastUpdate: '2024-01-20T14:15:00Z',
      messages: [
        {
          id: '1',
          sender: 'user',
          message: 'Tôi không thể rút BTC về ví của mình. Giao dịch bị pending từ 2 giờ trước.',
          timestamp: '2024-01-20T10:30:00Z'
        },
        {
          id: '2',
          sender: 'support',
          message: 'Chúng tôi đang kiểm tra vấn đề này. Vui lòng cung cấp transaction ID để chúng tôi hỗ trợ nhanh hơn.',
          timestamp: '2024-01-20T14:15:00Z'
        }
      ]
    }
  ]

  const faqItems: FAQItem[] = [
    {
      id: '1',
      question: 'Làm thế nào để nạp tiền vào tài khoản?',
      answer: 'Bạn có thể nạp tiền bằng cách: 1) Chuyển khoản ngân hàng, 2) Nạp cryptocurrency, 3) Sử dụng thẻ tín dụng. Vào mục "Ví" > "Nạp tiền" để bắt đầu.',
      category: 'deposit',
      helpful: 45
    },
    {
      id: '2',
      question: 'Phí giao dịch là bao nhiêu?',
      answer: 'Phí giao dịch spot: 0.1% cho maker và taker. Phí rút tiền: BTC 0.0005, ETH 0.005, USDT 5. Phí nạp tiền qua ngân hàng: Miễn phí.',
      category: 'fees',
      helpful: 38
    },
    {
      id: '3',
      question: 'Tại sao tài khoản của tôi bị khóa?',
      answer: 'Tài khoản có thể bị khóa do: 1) Hoạt động đáng nghi, 2) Chưa hoàn thành KYC, 3) Vi phạm điều khoản sử dụng. Liên hệ support để được hỗ trợ.',
      category: 'account',
      helpful: 29
    },
    {
      id: '4',
      question: 'Làm thế nào để bật xác thực 2FA?',
      answer: 'Vào "Cài đặt" > "Bảo mật" > "Xác thực 2 bước". Tải ứng dụng Google Authenticator, quét mã QR và nhập mã xác thực để kích hoạt.',
      category: 'security',
      helpful: 52
    }
  ]

  const categories = [
    { value: 'all', label: 'Tất cả' },
    { value: 'account', label: 'Tài khoản' },
    { value: 'deposit', label: 'Nạp tiền' },
    { value: 'withdrawal', label: 'Rút tiền' },
    { value: 'trading', label: 'Giao dịch' },
    { value: 'security', label: 'Bảo mật' },
    { value: 'fees', label: 'Phí' },
    { value: 'kyc', label: 'KYC' },
    { value: 'other', label: 'Khác' }
  ]

  const filteredFAQ = faqItems.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      console.log('Sending message:', chatMessage)
      setChatMessage('')
    }
  }

  const handleCreateTicket = () => {
    if (newTicket.subject && newTicket.category && newTicket.message) {
      console.log('Creating ticket:', newTicket)
      setNewTicket({ subject: '', category: '', priority: 'medium', message: '' })
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-600'
      case 'high': return 'bg-orange-600'
      case 'medium': return 'bg-yellow-600'
      case 'low': return 'bg-green-600'
      default: return 'bg-gray-600'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-600'
      case 'in-progress': return 'bg-orange-600'
      case 'resolved': return 'bg-green-600'
      case 'closed': return 'bg-gray-600'
      default: return 'bg-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-[#0B1426] text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Trung tâm hỗ trợ</h1>
          <p className="text-gray-400">Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7</p>
        </div>

        {/* Quick Contact */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-[#0F172A] border-[#1E293B]">
            <CardContent className="p-6 text-center">
              <MessageCircle className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">Live Chat</h3>
              <p className="text-sm text-gray-400 mb-3">Trò chuyện trực tiếp với chuyên viên</p>
              <div className="flex items-center justify-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-xs text-gray-400">
                  {isOnline ? 'Đang online' : 'Offline'}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0F172A] border-[#1E293B]">
            <CardContent className="p-6 text-center">
              <Phone className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">Hotline</h3>
              <p className="text-sm text-gray-400 mb-3">1900 1234 (24/7)</p>
              <p className="text-xs text-gray-500">Miễn phí từ điện thoại cố định</p>
            </CardContent>
          </Card>

          <Card className="bg-[#0F172A] border-[#1E293B]">
            <CardContent className="p-6 text-center">
              <Mail className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">Email</h3>
              <p className="text-sm text-gray-400 mb-3">support@cryptotrade.com</p>
              <p className="text-xs text-gray-500">Phản hồi trong 2-4 giờ</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Support Interface */}
        <Card className="bg-[#0F172A] border-[#1E293B]">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 bg-[#1E293B]">
                <TabsTrigger value="chat" className="text-gray-300 data-[state=active]:text-white">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Live Chat
                </TabsTrigger>
                <TabsTrigger value="faq" className="text-gray-300 data-[state=active]:text-white">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  FAQ
                </TabsTrigger>
                <TabsTrigger value="tickets" className="text-gray-300 data-[state=active]:text-white">
                  <FileText className="w-4 h-4 mr-2" />
                  Tickets
                </TabsTrigger>
                <TabsTrigger value="guides" className="text-gray-300 data-[state=active]:text-white">
                  <Zap className="w-4 h-4 mr-2" />
                  Hướng dẫn
                </TabsTrigger>
              </TabsList>

              {/* Live Chat */}
              <TabsContent value="chat" className="space-y-4">
                <div className="bg-[#1E293B] rounded-lg p-4 h-96 overflow-y-auto">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                      <div className="bg-[#334155] rounded-lg p-3 max-w-xs">
                        <p className="text-sm">Xin chào! Tôi có thể giúp gì cho bạn?</p>
                        <span className="text-xs text-gray-400">10:30</span>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 justify-end">
                      <div className="bg-blue-600 rounded-lg p-3 max-w-xs">
                        <p className="text-sm">Tôi muốn hỏi về phí giao dịch</p>
                        <span className="text-xs text-blue-200">10:32</span>
                      </div>
                      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                      <div className="bg-[#334155] rounded-lg p-3 max-w-xs">
                        <p className="text-sm">Phí giao dịch spot của chúng tôi là 0.1% cho cả maker và taker. Bạn có thể xem chi tiết tại mục "Phí giao dịch" trong cài đặt.</p>
                        <span className="text-xs text-gray-400">10:33</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Nhập tin nhắn..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="bg-[#1E293B] border-[#334155] text-white"
                  />
                  <Button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </TabsContent>

              {/* FAQ */}
              <TabsContent value="faq" className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Tìm kiếm câu hỏi..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-[#1E293B] border-[#334155] text-white"
                      />
                    </div>
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48 bg-[#1E293B] border-[#334155] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1E293B] border-[#334155]">
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value} className="text-white hover:bg-[#334155]">
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  {filteredFAQ.map((item) => (
                    <Card key={item.id} className="bg-[#1E293B] border-[#334155]">
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-white mb-2">{item.question}</h3>
                        <p className="text-gray-300 text-sm mb-3">{item.answer}</p>
                        <div className="flex items-center justify-between">
                          <Badge className="bg-blue-600 text-white">
                            {categories.find(c => c.value === item.category)?.label}
                          </Badge>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <CheckCircle className="w-3 h-3" />
                            <span>{item.helpful} người thấy hữu ích</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Support Tickets */}
              <TabsContent value="tickets" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-white">Tickets của bạn</h3>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Tạo ticket mới
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#0F172A] border-[#1E293B] text-white">
                      <DialogHeader>
                        <DialogTitle>Tạo ticket hỗ trợ</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Tiêu đề</Label>
                          <Input
                            value={newTicket.subject}
                            onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                            placeholder="Mô tả ngắn gọn vấn đề"
                            className="bg-[#1E293B] border-[#334155] text-white"
                          />
                        </div>
                        <div>
                          <Label>Danh mục</Label>
                          <Select value={newTicket.category} onValueChange={(value) => setNewTicket({...newTicket, category: value})}>
                            <SelectTrigger className="bg-[#1E293B] border-[#334155] text-white">
                              <SelectValue placeholder="Chọn danh mục" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1E293B] border-[#334155]">
                              {categories.slice(1).map((cat) => (
                                <SelectItem key={cat.value} value={cat.value} className="text-white hover:bg-[#334155]">
                                  {cat.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Mức độ ưu tiên</Label>
                          <Select value={newTicket.priority} onValueChange={(value) => setNewTicket({...newTicket, priority: value as any})}>
                            <SelectTrigger className="bg-[#1E293B] border-[#334155] text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1E293B] border-[#334155]">
                              <SelectItem value="low" className="text-white hover:bg-[#334155]">Thấp</SelectItem>
                              <SelectItem value="medium" className="text-white hover:bg-[#334155]">Trung bình</SelectItem>
                              <SelectItem value="high" className="text-white hover:bg-[#334155]">Cao</SelectItem>
                              <SelectItem value="urgent" className="text-white hover:bg-[#334155]">Khẩn cấp</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Mô tả chi tiết</Label>
                          <Textarea
                            value={newTicket.message}
                            onChange={(e) => setNewTicket({...newTicket, message: e.target.value})}
                            placeholder="Mô tả chi tiết vấn đề bạn gặp phải..."
                            className="bg-[#1E293B] border-[#334155] text-white"
                            rows={4}
                          />
                        </div>
                        <Button onClick={handleCreateTicket} className="w-full bg-blue-600 hover:bg-blue-700">
                          Tạo ticket
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="space-y-3">
                  {supportTickets.map((ticket) => (
                    <Card key={ticket.id} className="bg-[#1E293B] border-[#334155]">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-white">#{ticket.id} - {ticket.subject}</h3>
                            <p className="text-sm text-gray-400">
                              Tạo: {new Date(ticket.createdAt).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Badge className={getPriorityColor(ticket.priority) + ' text-white'}>
                              {ticket.priority}
                            </Badge>
                            <Badge className={getStatusColor(ticket.status) + ' text-white'}>
                              {ticket.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="bg-[#0F172A] rounded p-3">
                          <p className="text-sm text-gray-300">
                            {ticket.messages[ticket.messages.length - 1].message}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Guides */}
              <TabsContent value="guides" className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="bg-[#1E293B] border-[#334155]">
                    <CardContent className="p-6">
                      <DollarSign className="w-8 h-8 text-green-400 mb-3" />
                      <h3 className="font-semibold text-white mb-2">Hướng dẫn giao dịch</h3>
                      <p className="text-sm text-gray-400 mb-4">
                        Học cách mua bán Bitcoin và các loại tiền điện tử khác
                      </p>
                      <Button variant="outline" className="border-[#334155] text-gray-300 hover:text-white">
                        Xem hướng dẫn
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#1E293B] border-[#334155]">
                    <CardContent className="p-6">
                      <Shield className="w-8 h-8 text-blue-400 mb-3" />
                      <h3 className="font-semibold text-white mb-2">Bảo mật tài khoản</h3>
                      <p className="text-sm text-gray-400 mb-4">
                        Cách bảo vệ tài khoản với 2FA và các biện pháp bảo mật
                      </p>
                      <Button variant="outline" className="border-[#334155] text-gray-300 hover:text-white">
                        Xem hướng dẫn
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#1E293B] border-[#334155]">
                    <CardContent className="p-6">
                      <Zap className="w-8 h-8 text-yellow-400 mb-3" />
                      <h3 className="font-semibold text-white mb-2">Nạp và rút tiền</h3>
                      <p className="text-sm text-gray-400 mb-4">
                        Hướng dẫn nạp tiền qua ngân hàng và rút cryptocurrency
                      </p>
                      <Button variant="outline" className="border-[#334155] text-gray-300 hover:text-white">
                        Xem hướng dẫn
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#1E293B] border-[#334155]">
                    <CardContent className="p-6">
                      <FileText className="w-8 h-8 text-purple-400 mb-3" />
                      <h3 className="font-semibold text-white mb-2">Xác thực KYC</h3>
                      <p className="text-sm text-gray-400 mb-4">
                        Quy trình xác thực danh tính để tăng giới hạn giao dịch
                      </p>
                      <Button variant="outline" className="border-[#334155] text-gray-300 hover:text-white">
                        Xem hướng dẫn
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

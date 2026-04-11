import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Settings, LogOut, Package, Calendar, Award, Heart, Sparkles, ChevronRight, User, TrendingUp, BarChart3, Building2 } from 'lucide-react'
import { Button, PageHeader } from '@/components/ui'
import { PartnerOnboarding } from '@/components/PartnerOnboarding'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'
import type { Booking, Order } from '@/types'

const BOOKINGS: Booking[] = [
  { service: 'Lume Wellness Spa', type: 'Deep Tissue Massage', date: 'March 25, 2026', status: 'Upcoming' },
  { service: 'Serenity Yoga Studio', type: 'Vinyasa Flow', date: 'March 22, 2026', status: 'Completed' },
]

const ORDERS: Order[] = [
  { id: 'ORD-1024', date: 'March 18, 2026', total: '₹128', status: 'Delivered', items: 3 },
  { id: 'ORD-1023', date: 'March 10, 2026', total: '₹95', status: 'Delivered', items: 2 },
]

const PERFORMANCE_DATA = [
  { month: 'Oct', points: 1200 },
  { month: 'Nov', points: 1550 },
  { month: 'Dec', points: 1900 },
  { month: 'Jan', points: 2100 },
  { month: 'Feb', points: 2350 },
  { month: 'Mar', points: 2450 },
]

const TABS = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'bookings', label: 'Bookings', icon: Calendar },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'mishti', label: 'Mishti Scan', icon: Sparkles },
  { id: 'partner', label: 'Partner With Us', icon: Building2 },
]

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')

  if (!user) return null

  const dynamicStats = [
    { icon: Award, label: 'Ritual Points', value: user.points?.toLocaleString() || '0' },
    { icon: Package, label: 'Total Orders', value: '12' },
    { icon: Heart, label: 'Favorites', value: '18' },
    { icon: Sparkles, label: 'Glow Score', value: '84' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="bg-cream min-h-screen pb-32">
      <PageHeader 
        label="Account" 
        title={`My <em class='text-rose italic'>Ritual</em>`}
        subtitle={`Welcome back, ${user.name?.split(' ')[0] || 'Member'}. Manage your bookings, track your orders, and view your personalized wellness insights.`}
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* User Profile Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12 p-10 bg-dark text-cream relative overflow-hidden shadow-xl rounded-sm">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-3xl rounded-full" />
          <div className="relative z-10 flex items-center gap-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-linen/10 border border-gold/30 flex items-center justify-center overflow-hidden">
                <User className="w-12 h-12 text-gold/50" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-gold text-dark p-2 rounded-full shadow-lg">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-gold text-[10px] uppercase tracking-[4px] mb-2 font-medium">{user.membership} Member</p>
              <h2 className="font-playfair text-3xl mb-2">{user.name}</h2>
              <p className="text-cream/40 text-xs font-light tracking-widest uppercase">Member since Oct 2024</p>
            </div>
          </div>
          <div className="relative z-10 flex gap-4 w-full md:w-auto">
            <Button variant="outline-cream" className="flex-1 md:flex-none h-12 px-8">
              <Settings className="w-4 h-4 mr-2" /> Settings
            </Button>
            <Button variant="gold" className="flex-1 md:flex-none h-12 px-8" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>

        {/* Tabs Switcher */}
        <div className="flex flex-wrap gap-4 mb-12 border-b border-dark/5 pb-6">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-3 px-8 py-3 text-[11px] uppercase tracking-[2px] transition-all relative",
                activeTab === tab.id ? "text-dark" : "text-mauve hover:text-dark"
              )}
            >
              <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-gold" : "text-mauve/40")} />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="dashTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold"
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {dynamicStats.map((stat) => (
                  <div key={stat.label} className="bg-linen p-8 border border-dark/5 shadow-sm">
                    <div className="flex items-center gap-4 mb-6">
                      <stat.icon className="w-5 h-5 text-gold" />
                      <p className="text-[10px] uppercase tracking-widest text-mauve font-medium">{stat.label}</p>
                    </div>
                    <p className="font-playfair text-4xl text-dark">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                <div className="lg:col-span-2">
                  <div className="bg-linen p-8 border border-dark/5 shadow-sm h-full">
                    <div className="flex justify-between items-center mb-10">
                      <div>
                        <h3 className="font-playfair text-xl text-dark italic">Ritual Points History</h3>
                        <p className="text-[10px] text-mauve uppercase tracking-[2px] mt-1">Consistency is key to transformation</p>
                      </div>
                      <div className="flex items-center gap-2 text-rose">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-xs font-medium">+15% this month</span>
                      </div>
                    </div>
                    <div className="h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={PERFORMANCE_DATA}>
                          <defs>
                            <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#d4af7a" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#d4af7a" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2e1a1a" opacity={0.05} />
                          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#7a4a4a' }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#7a4a4a' }} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#faf4ee', border: '1px solid #d4af7a33', borderRadius: '4px' }}
                            labelStyle={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: '#7a4a4a' }}
                          />
                          <Area type="monotone" dataKey="points" stroke="#d4af7a" strokeWidth={3} fillOpacity={1} fill="url(#colorPoints)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
                <div className="bg-dark text-cream p-10 shadow-2xl rounded-sm flex flex-col justify-center">
                  <h4 className="font-playfair text-xl mb-6 italic">Mishti's Insight</h4>
                  <p className="text-cream/50 text-sm mb-8 leading-relaxed font-light italic">
                    "Based on your scan from March 18th, your hydration levels have improved by 12%."
                  </p>
                  <Button variant="gold" className="w-full" onClick={() => setActiveTab('mishti')}>View Full Report</Button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'bookings' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl space-y-6">
              <div className="flex justify-between items-end mb-8">
                <h3 className="font-playfair text-2xl text-dark italic">Upcoming Bookings</h3>
                <Button variant="outline" className="h-10 px-6 text-[10px]">Schedule New</Button>
              </div>
              {BOOKINGS.map(booking => (
                <div key={booking.service} className="p-8 bg-linen border border-dark/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:bg-cream transition-colors shadow-sm">
                  <div className="flex gap-6">
                    <div className="w-12 h-12 bg-dark flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <h4 className="text-dark font-medium mb-1">{booking.service}</h4>
                      <p className="text-mauve text-xs font-light mb-2">{booking.type}</p>
                      <p className="text-mauve text-[10px] uppercase tracking-widest font-medium opacity-60">{booking.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                    <span className={cn("px-4 py-1 text-[8px] uppercase tracking-widest rounded-full", booking.status === 'Upcoming' ? 'bg-gold text-dark' : 'bg-mauve text-cream')}>{booking.status}</span>
                    <Button variant="ghost" className="p-2"><ChevronRight className="w-4 h-4 text-dark/20 group-hover:text-gold" /></Button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl space-y-6">
              <h3 className="font-playfair text-2xl text-dark italic mb-8">Purchase History</h3>
              {ORDERS.map(order => (
                <div key={order.id} className="p-8 bg-linen border border-dark/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:bg-cream transition-colors shadow-sm">
                  <div className="flex gap-6">
                    <div className="w-12 h-12 bg-mauve/10 flex items-center justify-center">
                      <Package className="w-5 h-5 text-mauve" />
                    </div>
                    <div>
                      <h4 className="text-dark font-medium mb-1 font-playfair">{order.id}</h4>
                      <p className="text-mauve text-xs font-light mb-2">{order.items} items · {order.total}</p>
                      <p className="text-mauve text-[10px] uppercase tracking-widest font-medium opacity-60">{order.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                    <span className="px-4 py-1 text-[8px] uppercase tracking-widest bg-dark text-cream rounded-full">{order.status}</span>
                    <Button variant="ghost" className="p-2"><ChevronRight className="w-4 h-4 text-dark/20 group-hover:text-gold" /></Button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'mishti' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-20 text-center space-y-8">
              <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-10 h-10 text-gold" />
              </div>
              <div>
                <h3 className="font-playfair text-3xl text-dark italic lg:max-w-md">Your Skin Analysis is being updated.</h3>
                <p className="text-mauve font-light mt-4 max-w-sm mx-auto">Maintain your daily ritual for the most accurate tracking of your progress.</p>
              </div>
              <Button variant="gold" onClick={() => navigate('/mishti')}>Start New Scan</Button>
            </motion.div>
          )}

          {activeTab === 'partner' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex justify-between items-end mb-8">
                <h3 className="font-playfair text-2xl text-dark italic">Partner Application</h3>
              </div>
              <PartnerOnboarding />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

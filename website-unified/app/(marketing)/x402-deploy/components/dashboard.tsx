'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Users, DollarSign, Activity, ArrowUp, ArrowDown } from 'lucide-react'

const metrics = [
  { label: 'Revenue (24h)', value: '$1,234.56', change: '+12.3%', trend: 'up' },
  { label: 'API Calls', value: '45,678', change: '+8.7%', trend: 'up' },
  { label: 'Unique Users', value: '1,234', change: '-2.1%', trend: 'down' },
  { label: 'Avg Price', value: '$0.027', change: '+5.2%', trend: 'up' },
]

const recentTransactions = [
  { time: '2 min ago', address: '0x742d...bEb', amount: '$0.10', chain: 'Base', status: 'confirmed' },
  { time: '5 min ago', address: '0x1234...567', amount: '$0.05', chain: 'Arbitrum', status: 'confirmed' },
  { time: '8 min ago', address: '0xabcd...ef0', amount: '$0.15', chain: 'Base', status: 'confirmed' },
  { time: '12 min ago', address: '0x9876...321', amount: '$0.08', chain: 'Optimism', status: 'confirmed' },
  { time: '15 min ago', address: '0xfedc...ba9', amount: '$0.12', chain: 'Base', status: 'confirmed' },
]

const endpoints = [
  { path: '/api/premium/data', calls: 12345, revenue: '$345.67', avgTime: '125ms' },
  { path: '/api/analytics', calls: 8901, revenue: '$267.03', avgTime: '89ms' },
  { path: '/api/market/prices', calls: 5678, revenue: '$170.34', avgTime: '45ms' },
  { path: '/api/charts', calls: 3456, revenue: '$103.68', avgTime: '230ms' },
]

export function Dashboard() {
  return (
    <section id="dashboard" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-6" variant="outline">
            Analytics Dashboard
          </Badge>
          <h2 className="text-display-md font-bold mb-6">
            Monitor Your Revenue in Real-Time
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Beautiful analytics dashboard to track payments, usage, and performance.
          </p>
        </div>
        
        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          {/* Metrics Row */}
          <div className="grid md:grid-cols-4 gap-6">
            {metrics.map((metric) => (
              <Card key={metric.label} className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">{metric.label}</span>
                  <div className={`flex items-center gap-1 text-xs ${
                    metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.trend === 'up' ? (
                      <ArrowUp className="w-3 h-3" />
                    ) : (
                      <ArrowDown className="w-3 h-3" />
                    )}
                    {metric.change}
                  </div>
                </div>
                <div className="text-3xl font-bold">{metric.value}</div>
              </Card>
            ))}
          </div>
          
          {/* Main Dashboard Card */}
          <Card className="p-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Recent Transactions */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Activity className="w-5 h-5 text-brand-600" />
                  <h3 className="text-xl font-bold">Recent Transactions</h3>
                </div>
                <div className="space-y-3">
                  {recentTransactions.map((tx, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <div>
                          <div className="font-mono text-sm">{tx.address}</div>
                          <div className="text-xs text-gray-600">{tx.time}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{tx.amount}</div>
                        <div className="text-xs text-gray-600">{tx.chain}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Top Endpoints */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="w-5 h-5 text-brand-600" />
                  <h3 className="text-xl font-bold">Top Endpoints</h3>
                </div>
                <div className="space-y-3">
                  {endpoints.map((endpoint, index) => (
                    <div key={index} className="p-3 rounded-lg bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <code className="text-sm font-mono">{endpoint.path}</code>
                        <div className="text-sm font-bold text-green-600">{endpoint.revenue}</div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <span>{endpoint.calls.toLocaleString()} calls</span>
                        <span>•</span>
                        <span>{endpoint.avgTime} avg</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
          
          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Total Revenue</div>
                  <div className="text-2xl font-bold">$12,345.67</div>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Total Requests</div>
                  <div className="text-2xl font-bold">1.2M</div>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Unique Payers</div>
                  <div className="text-2xl font-bold">3,456</div>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

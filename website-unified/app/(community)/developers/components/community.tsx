'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { MessageCircle, Twitter, Github, Calendar, Mail, CheckCircle } from 'lucide-react'

const communityLinks = [
  {
    icon: MessageCircle,
    title: 'Discord',
    description: 'Join our community of 5,000+ developers',
    link: 'https://discord.gg/universal-crypto-mcp',
    color: 'text-indigo-500',
    members: '5,000+',
  },
  {
    icon: Twitter,
    title: 'Twitter',
    description: 'Follow for updates and announcements',
    link: 'https://twitter.com/universal_mcp',
    color: 'text-blue-400',
    members: '3,500+',
  },
  {
    icon: Github,
    title: 'GitHub',
    description: 'Star, fork, and contribute to the project',
    link: 'https://github.com/nirholas/universal-crypto-mcp',
    color: 'text-gray-800',
    members: '2,500+',
  },
  {
    icon: Calendar,
    title: 'Events',
    description: 'Join our monthly community calls',
    link: '/events',
    color: 'text-green-500',
    members: 'Monthly',
  },
]

const upcomingEvents = [
  {
    date: 'Feb 15, 2026',
    title: 'Community Call #12',
    description: 'Monthly roundup and Q&A',
    link: '#',
  },
  {
    date: 'Feb 22, 2026',
    title: 'Workshop: Building AI Trading Agents',
    description: 'Hands-on tutorial with live coding',
    link: '#',
  },
  {
    date: 'Mar 1, 2026',
    title: 'Hackathon Kickoff',
    description: '$50k prize pool',
    link: '#',
  },
]

export function Community() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    // In production, integrate with email service
    setSubscribed(true)
    setEmail('')
  }
  
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-display-sm font-bold mb-4">Join the Community</h2>
          <p className="text-xl text-gray-600">
            Connect with developers building the future of blockchain AI
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {communityLinks.map((link) => (
            <Link key={link.title} href={link.link}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <link.icon className={`w-8 h-8 ${link.color} mb-2`} />
                  <CardTitle className="text-lg">{link.title}</CardTitle>
                  <CardDescription>{link.description}</CardDescription>
                  <p className="text-sm font-semibold text-brand-600 mt-2">
                    {link.members} members
                  </p>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5" />
                Upcoming Events
              </CardTitle>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.title} className="border-l-4 border-brand-500 pl-4 py-2">
                    <p className="text-sm text-gray-600">{event.date}</p>
                    <p className="font-semibold">{event.title}</p>
                    <p className="text-sm text-gray-600">{event.description}</p>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link href="/events">View All Events</Link>
              </Button>
            </CardHeader>
          </Card>
          
          {/* Newsletter */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 mb-4">
                <Mail className="w-5 h-5" />
                Developer Newsletter
              </CardTitle>
              <CardDescription className="mb-4">
                Get the latest updates, tutorials, and community highlights delivered to your inbox
              </CardDescription>
              
              {subscribed ? (
                <div className="flex items-center gap-2 p-4 bg-green-50 text-green-700 rounded-lg">
                  <CheckCircle className="w-5 h-5" />
                  <p className="font-medium">Thanks for subscribing!</p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <Button type="submit" className="w-full">
                    Subscribe
                  </Button>
                </form>
              )}
              
              <p className="text-xs text-gray-500 mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  )
}

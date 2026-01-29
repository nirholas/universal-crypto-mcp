'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const stats = [
  { value: '380+', label: 'Blockchain Tools', suffix: '' },
  { value: '20', label: 'Supported Chains', suffix: '+' },
  { value: '<5', label: 'Minutes to Deploy', suffix: 'm' },
  { value: '100', label: 'Revenue Ownership', suffix: '%' },
  { value: '0', label: 'Platform Fees', suffix: '' },
  { value: '<100', label: 'Global Latency', suffix: 'ms' },
]

export function Stats() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  
  return (
    <section
      ref={ref}
      className="py-24 px-6 border-y-2 border-gray-200 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-5xl font-bold mb-2">
                {stat.value}
                <span className="text-brand-600">{stat.suffix}</span>
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

'use client'

import { generateOrganizationSchema, generateSoftwareSchema } from '@/lib/seo/structured-data'

export function StructuredData() {
  const organizationSchema = generateOrganizationSchema()
  const softwareSchema = generateSoftwareSchema()
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
    </>
  )
}

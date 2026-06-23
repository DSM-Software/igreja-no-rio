import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'
import path from 'path'

const nextConfig: NextConfig = {
  reactCompiler: false,
  turbopack: {
    root: path.resolve(__dirname),
  },
  async headers() {
    // Advertise agent-discoverable resources via Link headers (RFC 8288).
    // Relation types are IANA-registered: https://www.iana.org/assignments/link-relations/
    const linkHeader = [
      '</sitemap.xml>; rel="sitemap"; type="application/xml"',
      '</privacidade>; rel="privacy-policy"',
      '</quem-somos>; rel="about"',
      '</contato>; rel="help"',
    ].join(', ')

    return [
      {
        source: '/',
        headers: [{ key: 'Link', value: linkHeader }],
      },
    ]
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'igrejanorio.com' },
      { protocol: 'https', hostname: 'www.igrejanorio.com' },
      { protocol: 'https', hostname: '*.amazonaws.com' },
      { protocol: 'https', hostname: '*.igrejanorio.com' },
      { protocol: 'https', hostname: 'igrejanorio.com.br' },
      { protocol: 'https', hostname: '*.igrejanorio.com.br' },
      { protocol: 'https', hostname: '*.r2.cloudflarestorage.com' },
      // MinIO local (desenvolvimento Docker)
      { protocol: 'http', hostname: 'localhost', port: '9000' },
      { protocol: 'http', hostname: 'minio', port: '9000' },
    ],
  },
}

export default withPayload(nextConfig)

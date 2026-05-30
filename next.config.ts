import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig: NextConfig = {
  // standalone output para imagem Docker mínima (~150 MB)
  output: 'standalone',
  experimental: {
    reactCompiler: false,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.amazonaws.com' },
      { protocol: 'https', hostname: '*.r2.cloudflarestorage.com' },
      // MinIO local (desenvolvimento Docker)
      { protocol: 'http', hostname: 'localhost', port: '9000' },
      { protocol: 'http', hostname: 'minio', port: '9000' },
    ],
  },
}

export default withPayload(nextConfig)

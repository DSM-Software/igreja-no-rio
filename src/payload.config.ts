import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'

import { Users } from './collections/Users'
import { Posts } from './collections/Posts'
import { Downloads } from './collections/Downloads'
import { Events } from './collections/Events'
import { Media } from './collections/Media'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const isProduction = process.env.NODE_ENV === 'production'
const defaultDevServerURL = 'http://localhost:3000'

function parseOrigins(value?: string) {
  return (value ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
}

function resolveServerURL() {
  const configuredURL = process.env.PAYLOAD_SERVER_URL ?? process.env.NEXT_PUBLIC_SERVER_URL

  if (configuredURL) {
    return configuredURL
  }

  if (!isProduction) {
    return defaultDevServerURL
  }

  throw new Error('Defina PAYLOAD_SERVER_URL ou NEXT_PUBLIC_SERVER_URL em producao.')
}

function resolveTrustedOrigins(envName: 'PAYLOAD_TRUSTED_ORIGINS' | 'PAYLOAD_CSRF_ORIGINS', fallback: string[]) {
  const configuredOrigins = parseOrigins(process.env[envName])

  if (configuredOrigins.length > 0) {
    return configuredOrigins
  }

  if (isProduction) {
    return fallback
  }

  return Array.from(new Set([...fallback, defaultDevServerURL]))
}

const serverURL = resolveServerURL()
const trustedOrigins = resolveTrustedOrigins('PAYLOAD_TRUSTED_ORIGINS', [serverURL])
const csrfOrigins = resolveTrustedOrigins('PAYLOAD_CSRF_ORIGINS', trustedOrigins)

export default buildConfig({
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '— Igreja no Rio CMS',
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },

  collections: [Users, Posts, Downloads, Events, Media],

  editor: lexicalEditor(),

  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI! },
    prodMigrations: migrations,
  }),

  secret: process.env.PAYLOAD_SECRET!,

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  plugins: [
    s3Storage({
      collections: {
        media: {
          prefix: 'media',
        },
      },
      bucket: process.env.S3_BUCKET!,
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
        },
        region: process.env.S3_REGION ?? 'us-east-1',
        ...(process.env.S3_ENDPOINT ? { endpoint: process.env.S3_ENDPOINT } : {}),
      },
    }),
  ],

  serverURL,

  cors: trustedOrigins,

  csrf: csrfOrigins,
})

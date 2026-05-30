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
import * as migrations from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

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

  serverURL: process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000',

  cors: [process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'],

  csrf: [process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'],
})

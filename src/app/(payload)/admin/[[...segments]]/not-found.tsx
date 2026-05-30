import { NotFoundPage } from '@payloadcms/next/views'
import configPromise from '@payload-config'
import { importMap } from '@/app/(payload)/importMap'

type Args = {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] }>
}

export default function NotFound(props: Args) {
  return NotFoundPage({ config: configPromise, importMap, ...props })
}

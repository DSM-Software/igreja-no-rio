import { RichText } from '@payloadcms/richtext-lexical/react'

interface PostBodyProps {
  content: unknown
}

export default function PostBody({ content }: PostBodyProps) {
  if (!content) return null

  return (
    <div className="post-body">
      <RichText data={content as any} />
    </div>
  )
}

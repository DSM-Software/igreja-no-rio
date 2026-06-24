type LexicalNode = {
  type?: string
  text?: string
  children?: LexicalNode[]
  [key: string]: unknown
}

type LexicalRoot = {
  root?: LexicalNode
} | null | undefined

const BLOCK_TYPES = new Set([
  'paragraph',
  'heading',
  'listitem',
  'quote',
  'code',
  'blockquote',
  'horizontalrule',
])

export function lexicalToText(body: unknown): string {
  const root = (body as LexicalRoot)?.root
  if (!root) return ''

  const parts: string[] = []
  walk(root, parts)

  return parts
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function walk(node: LexicalNode, parts: string[]): void {
  if (typeof node.text === 'string' && node.text.length > 0) {
    parts.push(node.text)
  }

  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      walk(child, parts)
      if (child.type && BLOCK_TYPES.has(child.type)) {
        parts.push(' ')
      }
    }
  }
}

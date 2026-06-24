import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import {
  canReadPublishedOrOwn,
  canMutateOwnOrElevated,
  canEditPostsField,
  resolveContentOwner,
} from '../access/contentAccess'
import { lexicalToText } from '../lib/lexical-to-text'

const editableFieldAccess = {
  read: canEditPostsField,
  update: canEditPostsField,
  create: canEditPostsField,
}

function slugify(s: string) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60)
}

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'date', 'published'],
  },
  access: {
    read: canReadPublishedOrOwn,
    create: ({ req }) => Boolean(req.user),
    update: canMutateOwnOrElevated,
    delete: canMutateOwnOrElevated,
  },
  fields: [
    { name: 'title', type: 'text', required: true, access: editableFieldAccess },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      access: editableFieldAccess,
      admin: {
        position: 'sidebar',
        description: 'Gerado do título; pode editar.',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => value || slugify(data?.title || ''),
        ],
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'Devocional',
      access: editableFieldAccess,
      options: [
        { label: 'Devocional', value: 'Devocional' },
        { label: 'Estudo', value: 'Estudo' },
      ],
    },
    { name: 'serie', type: 'text', label: 'Série (opcional)', access: editableFieldAccess },
    { name: 'serieParte', type: 'number', label: 'Parte nº', min: 1, access: editableFieldAccess },
    { name: 'author', type: 'text', label: 'Autor', required: true, access: editableFieldAccess },
    {
      name: 'date',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      access: editableFieldAccess,
      admin: { date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagem de capa (opcional)',
      access: editableFieldAccess,
    },
    {
      name: 'coverColor',
      type: 'select',
      defaultValue: 'teal',
      access: editableFieldAccess,
      options: [
        { label: 'Turquesa', value: 'teal' },
        { label: 'Marinho', value: 'navy' },
        { label: 'Areia', value: 'sand' },
      ],
      admin: { description: 'Cor usada quando não há imagem de capa.' },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Resumo (chamada)',
      required: true,
      access: editableFieldAccess,
    },
    {
      name: 'body',
      type: 'richText',
      label: 'Corpo do post',
      required: true,
      access: editableFieldAccess,
      admin: {
        description: 'Conteúdo principal do post. Use a barra de ferramentas para formatar o texto.',
      },
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [...defaultFeatures],
      }),
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tags',
      access: editableFieldAccess,
      fields: [{ name: 'tag', type: 'text' }],
    },
    {
      name: 'published',
      type: 'checkbox',
      label: 'Publicado',
      defaultValue: true,
      access: editableFieldAccess,
      admin: {
        position: 'sidebar',
        description: 'Desmarque para deixar como rascunho (oculto no site).',
      },
    },
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Definido automaticamente a partir do usuario que cria o conteudo.',
      },
      hooks: {
        beforeChange: [resolveContentOwner],
      },
    },
    {
      name: 'searchBody',
      type: 'textarea',
      admin: { hidden: true, disabled: true },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            const tags = Array.isArray(siblingData?.tags)
              ? (siblingData.tags as Array<{ tag?: string | null }>)
                  .map((t) => t?.tag ?? '')
                  .filter(Boolean)
                  .join(' ')
              : ''
            const body = lexicalToText(siblingData?.body)
            return [body, tags].filter(Boolean).join(' ').slice(0, 50000)
          },
        ],
      },
    },
  ],
}

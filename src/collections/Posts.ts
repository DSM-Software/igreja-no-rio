import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { canReadPublishedOrOwn, canMutateOwnOrElevated, resolveContentOwner } from '../access/contentAccess'

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
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
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
      options: [
        { label: 'Devocional', value: 'Devocional' },
        { label: 'Estudo', value: 'Estudo' },
      ],
    },
    { name: 'serie', type: 'text', label: 'Série (opcional)' },
    { name: 'serieParte', type: 'number', label: 'Parte nº', min: 1 },
    { name: 'author', type: 'text', label: 'Autor', required: true },
    {
      name: 'date',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagem de capa (opcional)',
    },
    {
      name: 'coverColor',
      type: 'select',
      defaultValue: 'teal',
      options: [
        { label: 'Turquesa', value: 'teal' },
        { label: 'Marinho', value: 'navy' },
        { label: 'Areia', value: 'sand' },
      ],
      admin: { description: 'Cor usada quando não há imagem de capa.' },
    },
    { name: 'excerpt', type: 'textarea', label: 'Resumo (chamada)', required: true },
    {
      name: 'body',
      type: 'richText',
      label: 'Corpo do post',
      required: true,
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
      fields: [{ name: 'tag', type: 'text' }],
    },
    {
      name: 'published',
      type: 'checkbox',
      label: 'Publicado',
      defaultValue: true,
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
  ],
}

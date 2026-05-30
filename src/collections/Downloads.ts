import type { CollectionConfig } from 'payload'
import { canMutateOwnOrElevated } from '../access/contentAccess'

export const Downloads: CollectionConfig = {
  slug: 'downloads',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'kind', 'category', 'date'],
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: canMutateOwnOrElevated,
    delete: canMutateOwnOrElevated,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'kind',
      type: 'select',
      required: true,
      defaultValue: 'audio',
      options: [
        { label: 'Áudio', value: 'audio' },
        { label: 'PDF', value: 'pdf' },
        { label: 'Slides', value: 'slides' },
      ],
    },
    {
      name: 'category',
      type: 'text',
      required: true,
      admin: { description: 'Ex.: Pregações, Estudos, Grupos Caseiros, Devocionais' },
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { date: { pickerAppearance: 'dayOnly' } },
    },
    { name: 'speaker', type: 'text', label: 'Pregador (opcional)' },
    { name: 'desc', type: 'textarea', label: 'Descrição' },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      label: 'Arquivo (PDF / áudio / slides)',
    },
    {
      name: 'externalUrl',
      type: 'text',
      label: 'Ou link externo (YouTube, podcast…)',
      admin: { description: 'Use quando o áudio é grande demais para upload.' },
    },
    {
      name: 'size',
      type: 'text',
      label: 'Tamanho / duração',
      admin: { description: 'Ex.: 38 min · 2,4 MB' },
    },
  ],
}

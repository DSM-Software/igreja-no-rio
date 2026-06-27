import type { CollectionConfig } from 'payload'
import { canMutateOwnOrElevated, resolveContentOwner } from '../access/contentAccess'
import { getSafeExternalURL } from '../lib/utils'

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
      validate: (value: string | null | undefined) => {
        if (!value) return true
        return getSafeExternalURL(value)
          ? true
          : 'Use uma URL absoluta com protocolo http:// ou https://.'
      },
    },
    {
      name: 'size',
      type: 'text',
      label: 'Tamanho / duração',
      admin: { description: 'Ex.: 38 min · 2,4 MB' },
    },
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Definido automaticamente a partir do usuário que cria o conteúdo.',
      },
      hooks: {
        beforeChange: [resolveContentOwner],
      },
    },
  ],
}

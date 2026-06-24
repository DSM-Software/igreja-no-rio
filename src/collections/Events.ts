import type { CollectionConfig } from 'payload'
import { canMutateOwnOrElevated, resolveContentOwner } from '../access/contentAccess'
import { getSafeExternalURL } from '../lib/utils'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'time', 'highlight'],
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
      name: 'date',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'time',
      type: 'text',
      required: true,
      defaultValue: '10:00',
      admin: { description: 'Ex.: 10:00' },
    },
    { name: 'location', type: 'text', required: true },
    {
      name: 'recurring',
      type: 'text',
      label: 'Recorrência (opcional)',
      admin: { description: 'Ex.: Todo domingo' },
    },
    { name: 'desc', type: 'textarea', label: 'Descrição' },
    {
      name: 'registrationUrl',
      type: 'text',
      label: 'Link de inscrição (opcional)',
      admin: { description: 'URL da página de inscrição do evento. Quando preenchido, exibe o botão de inscrição.' },
      validate: (value: string | null | undefined) => {
        if (!value) return true
        return getSafeExternalURL(value)
          ? true
          : 'Use uma URL absoluta com protocolo http:// ou https://.'
      },
    },
    {
      name: 'highlight',
      type: 'checkbox',
      label: 'Destaque na home',
      defaultValue: false,
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

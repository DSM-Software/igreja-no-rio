import type { CollectionConfig } from 'payload'
import { canMutateOwnOrElevated } from '../access/contentAccess'

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
      name: 'highlight',
      type: 'checkbox',
      label: 'Destaque na home',
      defaultValue: false,
    },
  ],
}

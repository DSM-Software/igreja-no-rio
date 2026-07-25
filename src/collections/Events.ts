import type { CollectionConfig } from 'payload'
import { canMutateOwnOrElevated, resolveContentOwner } from '../access/contentAccess'
import { getSafeExternalURL } from '../lib/utils'

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/

const validateTime = (value: string | null | undefined) => {
  if (!value) return true
  return TIME_PATTERN.test(value)
    ? true
    : 'Use o formato 24h HH:MM (ex.: 19:00).'
}

// Compara apenas o dia (YYYY-MM-DD) de timestamps ISO.
const dayPart = (value: string | null | undefined) => (value ?? '').slice(0, 10)

export const Events: CollectionConfig = {
  slug: 'events',
  labels: {
    singular: 'Evento',
    plural: 'Eventos',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'time', 'location', 'highlight'],
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: canMutateOwnOrElevated,
    delete: canMutateOwnOrElevated,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        // Evita término órfão quando o editor desmarca o multi-dia.
        if (data && !data.isMultiDay) {
          data.endDate = null
          data.endTime = null
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', label: 'Título', required: true },
    {
      type: 'row',
      fields: [
        {
          name: 'date',
          type: 'date',
          label: 'Data de início',
          required: true,
          defaultValue: () => new Date().toISOString(),
          admin: { date: { pickerAppearance: 'dayOnly' }, width: '50%' },
        },
        {
          name: 'time',
          type: 'text',
          label: 'Horário de início',
          required: true,
          defaultValue: '10:00',
          validate: validateTime,
          admin: { description: 'Formato 24h. Ex.: 10:00', width: '50%' },
        },
      ],
    },
    {
      name: 'isMultiDay',
      type: 'checkbox',
      label: 'Evento de mais de um dia?',
      defaultValue: false,
      admin: {
        description:
          'Marque para eventos que terminam em outro dia (ex.: acampamentos e retiros).',
      },
    },
    {
      type: 'row',
      admin: { condition: (data) => Boolean(data?.isMultiDay) },
      fields: [
        {
          name: 'endDate',
          type: 'date',
          label: 'Data de término',
          admin: { date: { pickerAppearance: 'dayOnly' }, width: '50%' },
          validate: (
            value: Date | string | null | undefined,
            { data }: { data?: Partial<{ isMultiDay: boolean; date: string }> },
          ) => {
            if (!data?.isMultiDay) return true
            if (!value) return 'Informe a data de término do evento.'
            const endDay = dayPart(
              value instanceof Date ? value.toISOString() : value,
            )
            if (data?.date && endDay < dayPart(data.date)) {
              return 'A data de término deve ser igual ou posterior à data de início.'
            }
            return true
          },
        },
        {
          name: 'endTime',
          type: 'text',
          label: 'Horário de término',
          admin: { description: 'Formato 24h. Ex.: 12:00', width: '50%' },
          validate: (
            value: string | null | undefined,
            {
              data,
            }: {
              data?: Partial<{
                isMultiDay: boolean
                date: string
                time: string
                endDate: string
              }>
            },
          ) => {
            const formatCheck = validateTime(value)
            if (formatCheck !== true) return formatCheck
            if (
              value &&
              data?.isMultiDay &&
              data?.date &&
              data?.endDate &&
              dayPart(data.endDate) === dayPart(data.date) &&
              data?.time &&
              value <= data.time
            ) {
              return 'Para término no mesmo dia, o horário de término deve ser depois do horário de início — ou desmarque "Evento de mais de um dia?".'
            }
            return true
          },
        },
      ],
    },
    { name: 'location', type: 'text', label: 'Local', required: true },
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
      admin: {
        description:
          'Entre os eventos marcados, o banner da home exibe o primeiro por data de início. Eventos já encerrados são ignorados mesmo marcados.',
      },
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

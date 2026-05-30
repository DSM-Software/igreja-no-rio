import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    mimeTypes: [
      'image/*',
      'application/pdf',
      'audio/*',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ],
    imageSizes: [
      { name: 'thumbnail', width: 400 },
      { name: 'card', width: 768 },
      { name: 'hero', width: 1600 },
    ],
    adminThumbnail: 'thumbnail',
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
  },
  fields: [
    { name: 'alt', type: 'text', label: 'Texto alternativo' },
  ],
}

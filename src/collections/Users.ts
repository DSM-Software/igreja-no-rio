import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: { useAsTitle: 'name' },
  access: {
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
    // Admin/editor see the full directory; any other authenticated user only
    // sees their own record. Without this, an `autor` token could enumerate
    // every admin email + role via `GET /api/users`.
    read: ({ req }) => {
      const user = req.user
      if (!user) return false
      if (user.role === 'admin' || user.role === 'editor') return true
      return { id: { equals: user.id } }
    },
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'autor',
      options: [
        { label: 'Administrador', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Autor', value: 'autor' },
      ],
      access: { update: ({ req }) => req.user?.role === 'admin' },
    },
  ],
}

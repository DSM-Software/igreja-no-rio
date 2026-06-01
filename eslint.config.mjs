import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypeScript from 'eslint-config-next/typescript'

export default [
  {
    ignores: [
      'design_reference/**',
      'playwright-report/**',
      'test-results/**',
      '.next/**',
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypeScript,
  { rules: { '@typescript-eslint/no-explicit-any': 'off' } },
]

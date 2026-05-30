import configPromise from '@payload-config'
import { getPayload as _getPayload } from 'payload'

export const getPayload = () => _getPayload({ config: configPromise })

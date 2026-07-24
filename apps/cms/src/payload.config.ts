import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Roles } from './collections/Roles'
import { Personas } from './collections/Personas'
import { Programmes } from './collections/Programmes'
import { Stories } from './collections/Stories'
import { Faqs } from './collections/Faqs'
import { SiteCopy } from './globals/SiteCopy'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  localization: {
    locales: [
      { label: 'English', code: 'en' },
      { label: 'Français', code: 'fr' },
      { label: 'Español', code: 'es' },
      { label: 'العربية', code: 'ar', rtl: true },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  collections: [Users, Media, Roles, Personas, Programmes, Stories, Faqs],
  globals: [SiteCopy],
  /**
   * The embed is served from the intranet on a different origin than this CMS.
   * All campaign content is public-read; writes still require admin auth.
   */
  cors: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : '*',
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [],
})

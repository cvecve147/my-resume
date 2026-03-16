const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://example.com'
const siteName = process.env.NUXT_PUBLIC_SITE_NAME || 'JiaXuan Yu Resume'

const normalizeUrl = (url: string) => url.replace(/\/$/, '')
const normalizedSiteUrl = normalizeUrl(siteUrl)
const siteHost = (() => {
  try {
    return new URL(normalizedSiteUrl).hostname
  } catch {
    return 'example.com'
  }
})()

const isNonProductionHost = siteHost === 'example.com' || siteHost === 'localhost' || siteHost.endsWith('.local')

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  modules: ['@nuxtjs/sitemap', '@nuxtjs/robots'],
  css: ['~/assets/main.css'],
  runtimeConfig: {
    public: {
      siteUrl: normalizedSiteUrl,
      siteName
    }
  },
  site: {
    url: normalizedSiteUrl,
    name: siteName,
    defaultLocale: 'zh-TW'
  },
  nitro: {
    prerender: {
      routes: ['/', '/en']
    }
  },
  sitemap: {
    urls: ['/', '/en', '/llms.txt', '/llms-full.txt', '/resume.json']
  },
  robots: {
    groups: [
      isNonProductionHost
        ? {
            userAgent: '*',
            disallow: ['/']
          }
        : {
            userAgent: '*',
            allow: ['/']
          }
    ],
    sitemap: `${normalizedSiteUrl}/sitemap.xml`
  },
  app: {
    head: {
      viewport: 'width=device-width, initial-scale=1',
      charset: 'utf-8',
      meta: [
        { name: 'theme-color', content: '#09090b' },
        { name: 'format-detection', content: 'telephone=no' }
      ]
    }
  }
})

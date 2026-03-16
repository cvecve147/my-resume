import { resumeProfiles, type ResumeLocale } from '~/data/resume'

const normalizeUrl = (url: string) => url.replace(/\/$/, '')
const getHostname = (url: string) => {
  try {
    return new URL(url).hostname
  } catch {
    return 'example.com'
  }
}

export const useResumeSeo = (locale: ResumeLocale) => {
  const profile = resumeProfiles[locale]
  const siteUrl = normalizeUrl(String(useRuntimeConfig().public.siteUrl || 'https://example.com'))
  const siteName = String(useRuntimeConfig().public.siteName || 'JiaXuan Yu Resume')
  const hostname = getHostname(siteUrl)
  const isIndexable = !(hostname === 'example.com' || hostname === 'localhost' || hostname.endsWith('.local'))
  const pagePath = locale === 'zh' ? '/' : '/en'
  const pageUrl = `${siteUrl}${pagePath}`
  const localeTag = locale === 'zh' ? 'zh_TW' : 'en_US'
  const altLocaleTag = locale === 'zh' ? 'en_US' : 'zh_TW'
  const languageTag = locale === 'zh' ? 'zh-TW' : 'en-US'
  const robotsContent = isIndexable
    ? 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
    : 'noindex, nofollow, noarchive'
  const siteRoot = `${siteUrl}/`
  const imageUrl = `${siteUrl}${profile.heroImage}`

  useSeoMeta({
    title: profile.seoTitle,
    description: profile.seoDescription,
    keywords: profile.seoKeywords.join(', '),
    author: profile.name,
    robots: robotsContent,
    googlebot: robotsContent,
    ogType: 'profile',
    ogSiteName: siteName,
    ogLocale: localeTag,
    ogTitle: profile.seoTitle,
    ogDescription: profile.seoDescription,
    ogUrl: pageUrl,
    ogImage: imageUrl,
    ogImageAlt: `${profile.name} resume profile photo`,
    ogImageWidth: '1200',
    ogImageHeight: '1200',
    twitterCard: 'summary_large_image',
    twitterTitle: profile.seoTitle,
    twitterDescription: profile.seoDescription,
    twitterImage: imageUrl,
    twitterImageAlt: `${profile.name} resume profile photo`
  })

  useHead({
    htmlAttrs: {
      lang: locale === 'zh' ? 'zh-Hant' : 'en'
    },
    meta: [
      { property: 'og:locale:alternate', content: altLocaleTag },
      { name: 'language', content: languageTag }
    ],
    link: [
      { rel: 'canonical', href: pageUrl },
      { rel: 'alternate', hreflang: 'zh-TW', href: `${siteUrl}/` },
      { rel: 'alternate', hreflang: 'en-US', href: `${siteUrl}/en` },
      { rel: 'alternate', hreflang: 'x-default', href: `${siteUrl}/` },
      { rel: 'alternate', type: 'text/plain', href: `${siteUrl}/llms.txt`, title: 'LLMs Index' },
      { rel: 'alternate', type: 'application/json', href: `${siteUrl}/resume.json`, title: 'Resume JSON' }
    ],
    script: [
      {
        key: 'profile-jsonld',
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'WebSite',
              '@id': `${siteRoot}#website`,
              url: siteRoot,
              name: siteName,
              inLanguage: ['zh-TW', 'en-US']
            },
            {
              '@type': 'Person',
              '@id': `${siteRoot}#person`,
              name: profile.name,
              alternateName: profile.nativeName,
              jobTitle: profile.title,
              description: profile.seoDescription,
              image: imageUrl,
              url: siteRoot,
              knowsAbout: profile.expertise,
              alumniOf: profile.alumni,
              sameAs: profile.sameAs
            },
            {
              '@type': 'ProfilePage',
              '@id': `${pageUrl}#webpage`,
              url: pageUrl,
              name: profile.seoTitle,
              inLanguage: languageTag,
              isPartOf: { '@id': `${siteRoot}#website` },
              about: { '@id': `${siteRoot}#person` },
              primaryImageOfPage: { '@type': 'ImageObject', url: imageUrl }
            }
          ]
        })
      }
    ]
  })
}

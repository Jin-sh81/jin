import { createInstance } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { initReactI18next } from 'react-i18next/initReactI18next'
import type { TFunction } from 'i18next'

export const initI18next = async (lng: string, ns: string) => {
  const i18nInstance = createInstance()
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`./locales/${language}/${namespace}.json`)
      )
    )
    .init({
      lng,
      fallbackLng: 'ko',
      supportedLngs: ['ko', 'en'],
      fallbackNS: 'common',
      defaultNS: 'common',
      ns,
    })
  return i18nInstance
}

export async function useTranslation(lng: string, ns: string, options: { keyPrefix?: string } = {}) {
  const i18nextInstance = await initI18next(lng, ns)
  return {
    t: i18nextInstance.getFixedT(lng, ns, options.keyPrefix) as TFunction,
    i18n: i18nextInstance
  }
} 
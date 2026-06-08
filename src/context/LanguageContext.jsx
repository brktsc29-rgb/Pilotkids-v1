import { createContext, useContext, useState } from 'react'
import { translations, LANGUAGES } from '../i18n/translations'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('tr')

  const t      = translations[lang]
  const langMeta = LANGUAGES.find(l => l.code === lang)
  const isRTL  = langMeta?.rtl ?? false

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isRTL, LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}

import { useLanguage } from '../context/LanguageContext'
import LanguageSwitcher from './LanguageSwitcher'

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function Navbar() {
  const { t } = useLanguage()

  const NAV_LINKS = [
    { label: t.nav.home,     target: 'hero' },
    { label: t.nav.aircraft, target: 'aircraft' },
    { label: t.nav.events,   target: 'events' },
    { label: t.nav.about,    target: 'about' },
    { label: t.nav.contact,  target: 'contact' },
  ]

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/30 backdrop-blur-md border-b border-white/10 shadow-xl">
      <div className="flex justify-between items-center px-gutter py-4 max-w-container-max mx-auto">
        <button
          onClick={() => scrollTo('hero')}
          className="font-display-xl text-headline-md text-on-surface uppercase tracking-widest"
        >
          PilotKids
        </button>

        <div className="hidden lg:flex gap-4 xl:gap-6 items-center">
          {NAV_LINKS.map(({ label, target }, i) => (
            <button
              key={target}
              onClick={() => scrollTo(target)}
              className={`font-label-bold text-label-bold transition-colors ${
                i === 0
                  ? 'text-secondary border-b-2 border-secondary pb-1'
                  : 'text-on-surface hover:text-secondary-fixed-dim'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <button
            onClick={() => scrollTo('aircraft')}
            className="bg-on-tertiary-container text-white font-label-bold text-label-bold px-6 py-3 rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg shadow-on-tertiary-container/20"
          >
            {t.nav.cta}
          </button>
        </div>
      </div>
    </nav>
  )
}

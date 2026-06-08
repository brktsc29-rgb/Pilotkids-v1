import { useLanguage } from '../context/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()
  const f = t.footer
  const [line1, line2] = f.headline.split('\n')

  return (
    <footer
      id="contact"
      className="relative w-full overflow-hidden bg-surface-container-lowest border-t border-dashed border-outline-variant"
    >
      <div className="relative z-10 flex flex-col items-center gap-base py-section-gap px-gutter text-center max-w-container-max mx-auto">
        <h2 className="font-headline-lg text-headline-lg text-white uppercase max-w-2xl leading-tight mb-4">
          {line1} <br /> {line2}
        </h2>
        <p className="font-body-md text-on-surface-variant mb-12">
          {f.subtext}
        </p>

        <div className="flex items-center gap-2 mb-12">
          <span className="font-headline-md text-headline-md text-on-surface uppercase tracking-[0.2em]">
            PilotKids
          </span>
        </div>

        <div className="flex gap-8 mb-16">
          <a href="#" aria-label="Web" className="text-on-surface-variant hover:text-white transition-colors">
            <span className="material-symbols-outlined">public</span>
          </a>
          <a href="#" aria-label="YouTube" className="text-on-surface-variant hover:text-white transition-colors">
            <span className="material-symbols-outlined">play_circle</span>
          </a>
          <a href="#" aria-label="Email" className="text-on-surface-variant hover:text-white transition-colors">
            <span className="material-symbols-outlined">alternate_email</span>
          </a>
          <a href="#" aria-label="Language" className="text-on-surface-variant hover:text-white transition-colors">
            <span className="material-symbols-outlined">language</span>
          </a>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-outline-variant to-transparent mb-8" />

        <div className="flex flex-col md:flex-row gap-6 justify-between w-full text-[10px] font-label-bold text-on-surface-variant uppercase tracking-widest">
          <p>{f.copyright}</p>
          <div className="flex gap-8 justify-center">
            <a href="#" className="hover:text-primary transition-colors">{f.privacy}</a>
            <a href="#" className="hover:text-primary transition-colors">{f.terms}</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

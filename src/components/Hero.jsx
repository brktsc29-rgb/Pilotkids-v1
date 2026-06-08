import { useRef, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'

const STATS = [
  { value: '1500+', key: 'kids' },
  { value: '20+',   key: 'cities' },
  { value: '4.9★',  key: 'rating' },
]

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function Hero() {
  const { t } = useLanguage()
  const h = t.hero
  const bgRef = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      if (!bgRef.current) return
      bgRef.current.style.transform = `translateY(${window.scrollY * 0.15}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section id="hero" className="relative h-screen w-full flex flex-col overflow-hidden">

      {/* Animated background — slow cloud drift + scroll parallax */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div ref={bgRef} className="absolute inset-0">
          <div className="w-full h-full hero-bg-drift">
            <img
              src="/images/hero-plane.webp"
              alt="PilotKids hero"
              className="w-full h-full object-cover brightness-[0.62]"
            />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-surface/5 to-surface" />
      </div>

      {/* Lens flare — right-edge warm glow */}
      <div className="hero-lens-flare absolute right-0 top-0 h-full w-48 sm:w-72 z-0 pointer-events-none" />

      {/* ── Main content — vertically centered in flex-1 */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="max-w-container-max mx-auto px-gutter w-full">
          <div className="max-w-xl space-y-4 sm:space-y-5">

            {/* Trust badge */}
            <div className="hero-fade-up">
              <span
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-white/80"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                {h.trustBadge}
              </span>
            </div>

            {/* Star tagline */}
            <div className="hero-fade-up hero-delay-1 flex items-center gap-2 text-on-surface/75">
              <span className="text-secondary text-sm">⭐</span>
              <span className="font-label-bold text-[11px] sm:text-label-bold tracking-widest uppercase">
                {h.tagline}
              </span>
            </div>

            {/* Main title */}
            <h1 className="hero-fade-up hero-delay-2 font-display-xl text-[2.6rem] leading-[1.05] sm:text-[3.5rem] md:text-display-xl text-white uppercase drop-shadow-2xl">
              {h.titleLine1}<br />
              <span className="text-secondary">{h.titleAccent}</span>{' '}{h.titleLine2}
            </h1>

            {/* Description */}
            <p className="hero-fade-up hero-delay-3 font-body-md text-sm sm:text-body-md text-on-surface-variant max-w-sm">
              {h.description}
            </p>

            {/* CTA buttons */}
            <div className="hero-cta-in flex flex-wrap gap-3 pt-1">
              <button
                onClick={() => scrollTo('aircraft')}
                className="hero-cta-primary bg-on-tertiary-container text-white font-label-bold text-label-bold px-7 py-4 rounded-full flex items-center gap-2 transition-all active:scale-95"
              >
                {h.ctaPrimary}
              </button>
              <button
                onClick={() => scrollTo('events')}
                className="glass-panel text-white font-label-bold text-label-bold px-7 py-4 rounded-full border border-white/20 hover:bg-white/10 flex items-center gap-2 transition-all active:scale-95"
              >
                {h.ctaSecondary}
                <span className="material-symbols-outlined">calendar_month</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Social proof stats — pinned to bottom of hero */}
      <div className="relative z-10 pb-6 sm:pb-10 px-gutter">
        <div className="max-w-container-max mx-auto">
          <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-[280px] sm:max-w-xs">
            {STATS.map(({ value, key }) => (
              <div
                key={key}
                className="text-center px-2 sm:px-4 py-3 rounded-2xl"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.15)',
                }}
              >
                <div className="font-headline-md text-[1.1rem] sm:text-xl text-white leading-none">{value}</div>
                <div className="font-label-bold text-[8px] sm:text-[10px] text-white/60 uppercase tracking-wide mt-1">
                  {h.stats[key]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Social links — desktop only */}
      <div className="absolute right-gutter bottom-1/4 hidden md:flex flex-col gap-6 text-on-surface/50 z-10">
        <a href="#" aria-label="Web" className="hover:text-secondary transition-colors">
          <span className="material-symbols-outlined">public</span>
        </a>
        <a href="#" aria-label="Video" className="hover:text-secondary transition-colors">
          <span className="material-symbols-outlined">smart_display</span>
        </a>
        <a href="#" aria-label="Stream" className="hover:text-secondary transition-colors">
          <span className="material-symbols-outlined">stream</span>
        </a>
      </div>
    </section>
  )
}

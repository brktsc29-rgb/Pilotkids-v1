import { useState, useEffect } from 'react'
import { useReveal } from '../hooks/useReveal'
import { useLanguage } from '../context/LanguageContext'

const PLANES = [
  { name: 'RED BARON',     image: '/images/model-red.webp' },
  { name: 'BLACK EAGLE',   image: '/images/model-black.webp' },
  { name: 'PINK PRINCESS', image: '/images/model-pink.webp' },
  { name: 'WHITE CAPTAIN', image: '/images/model-white.webp' },
]

const ANIM_DURATION = 20000

export default function AircraftCarousel() {
  const { t } = useLanguage()
  const ac = t.aircraft

  const [radius, setRadius]           = useState(400)
  const [activeIndex, setActiveIndex] = useState(0)
  const revealRef                     = useReveal()

  useEffect(() => {
    function update() { setRadius(window.innerWidth < 768 ? 280 : 400) }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    const perItem = ANIM_DURATION / PLANES.length
    const id = setInterval(() => {
      const idx = Math.floor((Date.now() % ANIM_DURATION) / perItem) % PLANES.length
      setActiveIndex(idx)
    }, 200)
    return () => clearInterval(id)
  }, [])

  return (
    <section id="aircraft" className="py-section-gap relative bg-surface-container-lowest overflow-hidden">
      <div className="max-w-container-max mx-auto px-gutter">
        <div ref={revealRef} className="reveal text-center mb-16 space-y-4">
          <span className="font-label-bold text-label-bold text-on-tertiary-container uppercase tracking-widest">
            {ac.sectionLabel}
          </span>
          <h2 className="font-headline-lg text-headline-lg text-white uppercase">
            {ac.sectionTitle}
          </h2>
        </div>

        <div className="carousel-perspective mt-16">
          <div className="carousel-spinner">
            {PLANES.map((plane, i) => {
              const angle    = i * (360 / PLANES.length)
              const subtitle = ac.planes[plane.name]?.subtitle ?? ''
              return (
                <div
                  key={plane.name}
                  className="carousel-item"
                  style={{ transform: `rotateY(${angle}deg) translateZ(${radius}px)` }}
                >
                  <div className="carousel-card w-full h-full rounded-3xl p-6 flex flex-col items-center justify-between overflow-hidden cursor-pointer">
                    <img
                      src={plane.image}
                      alt={`${plane.name} pedal plane`}
                      className="w-full h-48 object-contain"
                      loading="lazy"
                    />
                    <div className="text-center">
                      <h3 className="font-headline-md text-headline-md text-white mb-2">{plane.name}</h3>
                      <p className="font-caption text-caption text-on-surface-variant">{subtitle}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex justify-center mt-24 gap-2">
          {PLANES.map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-500 ${
                i === activeIndex ? 'w-6 h-3 bg-on-tertiary-container' : 'w-3 h-3 bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

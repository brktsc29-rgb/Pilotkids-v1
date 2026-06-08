import { useState, useEffect, useRef } from 'react'
import { useReveal } from '../hooks/useReveal'

const PLANES = [
  {
    name: 'RED BARON',
    subtitle: 'Klasik Çift Kanatlı',
    image: '/images/model-red.webp',
    hoverClass: 'hover:bg-on-tertiary-container/10 hover:border-on-tertiary-container/30',
  },
  {
    name: 'BLACK EAGLE',
    subtitle: 'Solo Türk Özel Serisi',
    image: '/images/model-black.webp',
    hoverClass: 'hover:bg-primary/10 hover:border-primary/30',
  },
  {
    name: 'PINK PRINCESS',
    subtitle: 'Zarif Tasarım',
    image: '/images/model-pink.webp',
    hoverClass: 'hover:bg-secondary/10 hover:border-secondary/30',
  },
  {
    name: 'WHITE CAPTAIN',
    subtitle: 'Modern Havacılık',
    image: '/images/model-white.webp',
    hoverClass: 'hover:bg-white/10 hover:border-white/30',
  },
]

const DOT_COUNT = PLANES.length

export default function AircraftCarousel() {
  const [radius, setRadius] = useState(400)
  const [activeIndex, setActiveIndex] = useState(0)
  const spinnerRef = useRef(null)
  const revealRef = useReveal()

  useEffect(() => {
    function update() {
      setRadius(window.innerWidth < 768 ? 280 : 400)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Track which item is closest to front via animation frame
  useEffect(() => {
    let raf
    function tick() {
      const el = spinnerRef.current
      if (el) {
        const style = getComputedStyle(el)
        const matrix = new WebKitCSSMatrix(style.transform)
        const angle = Math.round(Math.atan2(matrix.m13, matrix.m33) * (180 / Math.PI))
        const normalized = (((-angle) % 360) + 360) % 360
        const idx = Math.round(normalized / (360 / DOT_COUNT)) % DOT_COUNT
        setActiveIndex(idx)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <section id="aircraft" className="py-section-gap relative bg-surface-container-lowest overflow-hidden">
      <div className="max-w-container-max mx-auto px-gutter">
        <div ref={revealRef} className="reveal text-center mb-16 space-y-4">
          <span className="font-label-bold text-label-bold text-on-tertiary-container uppercase tracking-widest">
            Uçağını Seç
          </span>
          <h2 className="font-headline-lg text-headline-lg text-white uppercase">
            Kendi Tarzını Seç, Gökyüzüne Hazırlan!
          </h2>
        </div>

        <div className="carousel-perspective mt-16">
          <div className="carousel-spinner" ref={spinnerRef}>
            {PLANES.map((plane, i) => {
              const angle = i * (360 / PLANES.length)
              return (
                <div
                  key={plane.name}
                  className="carousel-item"
                  style={{ transform: `rotateY(${angle}deg) translateZ(${radius}px)` }}
                >
                  <div
                    className={`glass-panel w-full h-full rounded-3xl p-6 flex flex-col items-center justify-between transition-all duration-500 ${plane.hoverClass} overflow-hidden`}
                  >
                    <img
                      src={plane.image}
                      alt={`${plane.name} pedallı uçak`}
                      className="w-full h-48 object-contain animate-float"
                    />
                    <div className="text-center">
                      <h3 className="font-headline-md text-headline-md text-white mb-2">{plane.name}</h3>
                      <p className="font-caption text-caption text-on-surface-variant">{plane.subtitle}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center mt-24 gap-2">
          {PLANES.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all ${
                i === activeIndex ? 'bg-on-tertiary-container animate-pulse' : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

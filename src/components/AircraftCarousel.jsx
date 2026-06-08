import { useState, useEffect } from 'react'
import { useReveal } from '../hooks/useReveal'

const PLANES = [
  {
    name: 'RED BARON',
    subtitle: 'Klasik Çift Kanatlı',
    image: '/images/model-red.webp',
  },
  {
    name: 'BLACK EAGLE',
    subtitle: 'Solo Türk Özel Serisi',
    image: '/images/model-black.webp',
  },
  {
    name: 'PINK PRINCESS',
    subtitle: 'Zarif Tasarım',
    image: '/images/model-pink.webp',
  },
  {
    name: 'WHITE CAPTAIN',
    subtitle: 'Modern Havacılık',
    image: '/images/model-white.webp',
  },
]

const ANIM_DURATION = 20000  // 20s — eşleşmeli: CSS @keyframes rotate-carousel

export default function AircraftCarousel() {
  const [radius, setRadius]           = useState(400)
  const [activeIndex, setActiveIndex] = useState(0)
  const revealRef                     = useReveal()

  // Responsive radius — sadece resize olunca hesap yap
  useEffect(() => {
    function update() {
      setRadius(window.innerWidth < 768 ? 280 : 400)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Dot tracking — CSS animasyon süresiyle senkronize basit interval
  // getComputedStyle/WebKitCSSMatrix'e göre ~200x daha az iş yapıyor
  useEffect(() => {
    const perItem = ANIM_DURATION / PLANES.length  // 5000ms

    const id = setInterval(() => {
      const elapsed  = Date.now() % ANIM_DURATION
      const idx      = Math.floor(elapsed / perItem) % PLANES.length
      setActiveIndex(idx)
    }, 200)

    return () => clearInterval(id)
  }, [])

  return (
    <section
      id="aircraft"
      className="py-section-gap relative bg-surface-container-lowest overflow-hidden"
    >
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
          <div className="carousel-spinner">
            {PLANES.map((plane, i) => {
              const angle = i * (360 / PLANES.length)
              return (
                <div
                  key={plane.name}
                  className="carousel-item"
                  style={{ transform: `rotateY(${angle}deg) translateZ(${radius}px)` }}
                >
                  {/* hover efekti sadece kart içeriğine uygulanıyor */}
                  <div className="carousel-card glass-panel w-full h-full rounded-3xl p-6 flex flex-col items-center justify-between overflow-hidden cursor-pointer">
                    <img
                      src={plane.image}
                      alt={`${plane.name} pedallı uçak`}
                      className="w-full h-48 object-contain animate-float"
                      loading="lazy"
                    />
                    <div className="text-center">
                      <h3 className="font-headline-md text-headline-md text-white mb-2">
                        {plane.name}
                      </h3>
                      <p className="font-caption text-caption text-on-surface-variant">
                        {plane.subtitle}
                      </p>
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
              className={`rounded-full transition-all duration-500 ${
                i === activeIndex
                  ? 'w-6 h-3 bg-on-tertiary-container'
                  : 'w-3 h-3 bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

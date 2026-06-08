import { useReveal } from '../hooks/useReveal'

const SIZES = [
  { age: '3', range: '95-110 cm', image: '/images/gallery-1.png', alt: '3 yaş çocuk pedallı uçakla' },
  { age: '5', range: '110-120 cm', image: '/images/gallery-2.png', alt: '5 yaş çocuk pedallı uçakla' },
  { age: '7', range: '120-140 cm', image: '/images/hero-plane.png', alt: '7 yaş çocuk pedallı uçakla' },
]

export default function SizeComparison() {
  const revealRef = useReveal()

  return (
    <section id="about" className="py-section-gap bg-surface">
      <div className="max-w-container-max mx-auto px-gutter">
        <div ref={revealRef} className="reveal flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-md">
            <h2 className="font-headline-lg text-headline-lg text-white uppercase leading-none mb-4">
              Gerçek Boyut Karşılaştırma
            </h2>
            <p className="font-body-md text-on-surface-variant">
              Her yaşa uygun pedal uçaklarımızla güvenli ve keyifli bir deneyim sunuyoruz.
            </p>
          </div>
          <button className="border border-outline px-6 py-3 rounded-lg font-label-bold text-label-bold hover:bg-white/10 transition-colors flex items-center gap-2">
            TÜM ÖZELLİKLER{' '}
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SIZES.map(({ age, range, image, alt }) => (
            <div key={age} className="glass-panel rounded-2xl overflow-hidden group">
              <div className="p-8 pb-0">
                <div className="flex items-baseline gap-2 text-white">
                  <span className="font-display-xl text-headline-lg leading-none">{age}</span>
                  <span className="font-label-bold text-xl uppercase">YAŞ</span>
                </div>
                <p className="font-caption text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">straighten</span>
                  {range}
                </p>
              </div>
              <div className="p-4 transform group-hover:scale-105 transition-transform duration-500">
                <img
                  src={image}
                  alt={alt}
                  className="w-full h-64 object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

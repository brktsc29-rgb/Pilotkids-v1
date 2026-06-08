import { useReveal } from '../hooks/useReveal'

const STRIPE = {
  background: 'repeating-linear-gradient(black,black 2px,transparent 2px,transparent 6px)',
}

export default function Events() {
  const revealRef = useReveal()

  return (
    <section id="events" className="py-section-gap bg-surface-container-low overflow-hidden">
      <div className="max-w-container-max mx-auto px-gutter">
        <div ref={revealRef} className="reveal flex items-center justify-center gap-4 mb-16">
          <div className="h-px w-24 bg-gradient-to-r from-transparent to-on-tertiary-container" />
          <div className="flex flex-col items-center">
            <span className="material-symbols-outlined text-on-tertiary-container">flight</span>
            <h2 className="font-headline-lg text-headline-lg text-white uppercase text-center">
              YAKLAŞAN ETKİNLİKLER
            </h2>
          </div>
          <div className="h-px w-24 bg-gradient-to-l from-transparent to-on-tertiary-container" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* Çocuk Şenlikleri */}
          <div className="glass-panel ticket-shape h-40 flex overflow-hidden hover:bg-white/5 transition-all cursor-pointer">
            <div className="w-24 bg-on-tertiary-container/20 flex flex-col items-center justify-center border-r border-dashed border-white/20 shrink-0">
              <span className="font-headline-lg text-4xl text-white">23</span>
              <span className="font-label-bold text-xs uppercase text-white/60">NİSAN</span>
            </div>
            <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
              <div>
                <h4 className="font-label-bold text-sm text-white uppercase">Çocuk Şenlikleri</h4>
                <p className="font-caption text-[10px] text-on-surface-variant uppercase mt-1">
                  TBMM Bahçesi, Ankara
                </p>
              </div>
              <span className="material-symbols-outlined text-on-tertiary-container text-lg">
                military_tech
              </span>
            </div>
            <div className="w-8 flex items-center justify-center opacity-20 shrink-0">
              <div className="w-full h-full" style={STRIPE} />
            </div>
          </div>

          {/* TEKNOFEST */}
          <div className="glass-panel ticket-shape h-40 flex overflow-hidden hover:bg-white/5 transition-all cursor-pointer">
            <div className="flex-1 p-0 relative min-w-0">
              <img
                src="/images/gallery-1.png"
                alt="Teknofest etkinlik görseli"
                className="absolute inset-0 w-full h-full object-cover opacity-40"
              />
              <div className="relative p-4 h-full flex flex-col justify-between">
                <div>
                  <h4 className="font-label-bold text-sm text-white uppercase">TEKNOFEST</h4>
                  <p className="font-caption text-[10px] text-white uppercase">
                    2-6 MAYIS | Atatürk Havalimanı
                  </p>
                </div>
                <button className="bg-white/10 backdrop-blur-md px-3 py-1 rounded text-[10px] font-bold text-white uppercase self-start border border-white/20">
                  BİLET AL
                </button>
              </div>
            </div>
            <div className="w-12 bg-black/40 flex items-center justify-center border-l border-dashed border-white/20 shrink-0">
              <div className="h-full w-4 opacity-20" style={STRIPE} />
            </div>
          </div>

          {/* AVM Etkinlikleri */}
          <div className="glass-panel ticket-shape h-40 flex overflow-hidden hover:bg-white/5 transition-all cursor-pointer">
            <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
              <div>
                <h4 className="font-label-bold text-sm text-white uppercase">AVM ETKİNLİKLERİ</h4>
                <p className="font-caption text-[10px] text-on-surface-variant uppercase mt-1">
                  Her Hafta Sonu | Tüm Türkiye
                </p>
              </div>
              <span className="material-symbols-outlined text-secondary text-lg">stars</span>
            </div>
            <div className="w-12 flex items-center justify-center opacity-20 shrink-0">
              <div className="w-full h-full" style={STRIPE} />
            </div>
          </div>

          {/* Festival Alanları */}
          <div className="glass-panel ticket-shape h-40 flex overflow-hidden hover:bg-white/5 transition-all cursor-pointer">
            <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
              <div>
                <h4 className="font-label-bold text-sm text-white uppercase">FESTİVAL ALANLARI</h4>
                <p className="font-caption text-[10px] text-on-surface-variant uppercase mt-1">
                  Yaz Boyunca | Tüm Türkiye
                </p>
              </div>
              <span className="material-symbols-outlined text-white/40">confirmation_number</span>
            </div>
            <div className="w-12 flex items-center justify-center opacity-20 shrink-0">
              <div className="w-full h-full" style={STRIPE} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

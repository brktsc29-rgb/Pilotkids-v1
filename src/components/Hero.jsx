function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function Hero() {
  return (
    <section id="hero" className="relative h-screen w-full flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-plane.webp"
          alt="PilotKids hero – çocuk pedalı uçakla"
          className="w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/20 to-surface" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-container-max mx-auto px-gutter w-full">
        <div className="max-w-3xl space-y-6">
          <div className="flex items-center gap-2 text-on-surface/80">
            <span className="material-symbols-outlined text-sm">star</span>
            <span className="font-label-bold text-label-bold tracking-widest uppercase">
              Her Çocuğun Bir Hayali Var
            </span>
          </div>

          <h1 className="font-display-xl text-headline-lg md:text-display-xl text-white uppercase leading-tight drop-shadow-2xl">
            Bir Çocuğun <br />
            <span className="text-secondary">Hayaline</span> Dokunun.
          </h1>

          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
            Pedallı uçaklarımızla çocuklarınızın hayallerini gerçeğe dönüştürüyoruz.
            Pilotluk heyecanını şimdi yaşayın.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={() => scrollTo('aircraft')}
              className="bg-on-tertiary-container text-white font-label-bold text-label-bold px-8 py-4 rounded-full cta-bloom flex items-center gap-2 group transition-all"
            >
              UÇAĞINI KEŞFET
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                flight_takeoff
              </span>
            </button>
            <button
              onClick={() => scrollTo('events')}
              className="glass-panel text-white font-label-bold text-label-bold px-8 py-4 rounded-full border border-white/20 hover:bg-white/10 flex items-center gap-2 transition-all"
            >
              ETKİNLİK TAKVİMİ
              <span className="material-symbols-outlined">calendar_month</span>
            </button>
          </div>
        </div>
      </div>

{/* Social icons */}
      <div className="absolute right-gutter bottom-1/4 flex flex-col gap-6 text-on-surface/50">
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

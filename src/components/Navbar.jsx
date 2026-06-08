const NAV_LINKS = [
  { label: 'ANA SAYFA',  target: 'hero' },
  { label: 'UÇAKLAR',    target: 'aircraft' },
  { label: 'ETKİNLİKLER', target: 'events' },
  { label: 'HAKKIMIZDA', target: 'about' },
  { label: 'İLETİŞİM',   target: 'contact' },
]

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/30 backdrop-blur-md border-b border-white/10 shadow-xl">
      <div className="flex justify-between items-center px-gutter py-4 max-w-container-max mx-auto">
        <button
          onClick={() => scrollTo('hero')}
          className="font-display-xl text-headline-md text-on-surface uppercase tracking-widest"
        >
          PilotKids
        </button>

        <div className="hidden md:flex gap-8 items-center">
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

        <button
          onClick={() => scrollTo('aircraft')}
          className="bg-on-tertiary-container text-white font-label-bold text-label-bold px-6 py-3 rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg shadow-on-tertiary-container/20"
        >
          UÇAĞINI KEŞFET
        </button>
      </div>
    </nav>
  )
}

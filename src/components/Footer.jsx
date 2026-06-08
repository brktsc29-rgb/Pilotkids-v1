export default function Footer() {
  return (
    <footer
      id="contact"
      className="relative w-full overflow-hidden bg-surface-container-lowest border-t border-dashed border-outline-variant"
    >
      <div className="relative z-10 flex flex-col items-center gap-base py-section-gap px-gutter text-center max-w-container-max mx-auto">
        <h2 className="font-headline-lg text-headline-lg text-white uppercase max-w-2xl leading-tight mb-4">
          HER BÜYÜK PİLOTUN <br /> BİR İLK UÇUŞU VARDIR.
        </h2>
        <p className="font-body-md text-on-surface-variant mb-12">
          Bir sonraki etkinlikte görüşmek üzere!
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
          <a href="#" aria-label="E-posta" className="text-on-surface-variant hover:text-white transition-colors">
            <span className="material-symbols-outlined">alternate_email</span>
          </a>
          <a href="#" aria-label="Dil" className="text-on-surface-variant hover:text-white transition-colors">
            <span className="material-symbols-outlined">language</span>
          </a>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-outline-variant to-transparent mb-8" />

        <div className="flex flex-col md:flex-row gap-6 justify-between w-full text-[10px] font-label-bold text-on-surface-variant uppercase tracking-widest">
          <p>© 2024 PILOTKIDS. TÜM HAKLARI SAKLIDIR.</p>
          <div className="flex gap-8 justify-center">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

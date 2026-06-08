import { useState, useEffect, useRef } from 'react'
import html2canvas from 'html2canvas'
import { useReveal } from '../hooks/useReveal'

const ROUTES = {
  'IST-CDG': {
    origin:   { code: 'IST', name: 'ISTANBUL', nodeId: 'node-IST' },
    dest:     { code: 'CDG', name: 'PARİS',    nodeId: 'node-CDG' },
    path:     'M 500 250 Q 460 220 420 230',
    gate:     'B-12',
    seat:     '01-A',
    label:    'İSTANBUL ➔ PARİS',
    flightNo: 'PK-2024',
  },
  'LHR-JFK': {
    origin:   { code: 'LHR', name: 'LONDRA',   nodeId: 'node-LHR' },
    dest:     { code: 'JFK', name: 'NEW YORK', nodeId: 'node-JFK' },
    path:     'M 410 210 Q 300 200 200 260',
    gate:     'A-04',
    seat:     '05-C',
    label:    'LONDRA ➔ NEW YORK',
    flightNo: 'PK-1969',
  },
  'BER-NRT': {
    origin:   { code: 'BER', name: 'BERLİN', nodeId: 'node-BER' },
    dest:     { code: 'NRT', name: 'TOKYO',  nodeId: 'node-NRT' },
    path:     'M 460 215 Q 650 170 850 280',
    gate:     'G-21',
    seat:     '03-F',
    label:    'BERLİN ➔ TOKYO',
    flightNo: 'PK-3301',
  },
  'FCO-DXB': {
    origin:   { code: 'FCO', name: 'ROMA',  nodeId: 'node-FCO' },
    dest:     { code: 'DXB', name: 'DUBAİ', nodeId: 'node-DXB' },
    path:     'M 465 275 Q 550 295 620 330',
    gate:     'E-09',
    seat:     '02-B',
    label:    'ROMA ➔ DUBAİ',
    flightNo: 'PK-7777',
  },
}

const CITY_NODES = [
  { id: 'node-IST', cx: 500, cy: 250, label: 'IST' },
  { id: 'node-CDG', cx: 420, cy: 230, label: 'CDG' },
  { id: 'node-LHR', cx: 410, cy: 210, label: 'LHR' },
  { id: 'node-JFK', cx: 200, cy: 260, label: 'JFK' },
  { id: 'node-BER', cx: 460, cy: 215, label: 'BER' },
  { id: 'node-NRT', cx: 850, cy: 280, label: 'NRT' },
  { id: 'node-FCO', cx: 465, cy: 275, label: 'FCO' },
  { id: 'node-DXB', cx: 620, cy: 330, label: 'DXB' },
]

const CONTINENTS = [
  'M 75,95 C 130,75 230,78 320,108 C 368,128 385,175 368,235 C 350,288 308,328 258,340 C 208,350 162,322 132,282 C 102,248 82,198 78,152 Z',
  'M 198,328 C 232,308 282,318 312,348 C 342,380 342,428 312,488 C 292,528 262,558 232,548 C 202,538 178,508 168,468 C 158,428 168,378 198,328 Z',
  'M 382,118 C 412,98 462,98 502,108 C 528,118 538,148 520,188 C 504,222 472,242 442,242 C 412,242 390,222 381,192 C 372,164 374,138 382,118 Z',
  'M 418,268 C 458,253 512,253 552,268 C 578,283 582,318 572,378 C 560,438 532,498 492,518 C 462,533 437,523 420,488 C 404,453 404,398 414,348 C 420,308 413,278 418,268 Z',
  'M 498,118 C 568,88 678,78 778,88 C 858,96 918,128 948,178 C 960,208 940,258 900,288 C 860,313 800,323 730,318 C 680,313 645,335 615,335 C 582,333 556,313 540,285 C 520,253 510,218 498,178 Z',
  'M 738,292 C 762,312 792,340 800,368 C 808,393 792,408 772,398 C 752,388 732,368 722,343 C 713,320 720,298 738,292 Z',
  'M 758,368 C 798,353 848,356 888,378 C 918,396 928,428 918,458 C 906,488 878,508 843,513 C 808,516 773,503 755,478 C 736,451 738,418 758,368 Z',
]

function formatDate() {
  return new Date().toLocaleDateString('tr-TR', {
    day: '2-digit', month: 'long', year: 'numeric',
  })
}

export default function RoutePlanner() {
  const [selectedRoute, setSelectedRoute] = useState('IST-CDG')
  const [pilotName, setPilotName]         = useState('AYTUĞ')
  const [passAnim, setPassAnim]           = useState(false)
  const [planePos, setPlanePos]           = useState({ x: 0, y: 0, angle: 0 })
  const [downloading, setDownloading]     = useState(false)
  const [boarded, setBoarded]             = useState(false)

  const revealRef      = useReveal()
  const pathRef        = useRef(null)
  const animRef        = useRef(null)
  const boardingPassRef = useRef(null)

  const route  = ROUTES[selectedRoute]
  const today  = formatDate()

  // JS-based plane animation along SVG path (reliable cross-browser)
  useEffect(() => {
    let progress = 0

    function tick() {
      const path = pathRef.current
      if (!path) { animRef.current = requestAnimationFrame(tick); return }

      const len = path.getTotalLength()
      progress   = (progress + 0.004) % 1
      const p1   = path.getPointAtLength(progress * len)
      const p2   = path.getPointAtLength(Math.min((progress + 0.02) * len, len))
      const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI)

      setPlanePos({ x: p1.x, y: p1.y, angle })
      animRef.current = requestAnimationFrame(tick)
    }

    cancelAnimationFrame(animRef.current)
    progress = 0
    animRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animRef.current)
  }, [selectedRoute])

  function handleRouteChange(e) {
    setSelectedRoute(e.target.value)
    setPassAnim(true)
    setBoarded(false)
    setTimeout(() => setPassAnim(false), 300)
  }

  async function handleDownload() {
    if (!boardingPassRef.current || downloading) return
    setDownloading(true)
    try {
      const canvas = await html2canvas(boardingPassRef.current, {
        scale: 3,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
      })
      const link     = document.createElement('a')
      link.download  = `pilotkids-${route.flightNo}-${pilotName}.png`
      link.href      = canvas.toDataURL('image/png')
      link.click()
    } finally {
      setDownloading(false)
    }
  }

  return (
    <section
      id="route-planner-section"
      className="py-section-gap relative bg-black"
      style={{ overflow: 'hidden' }}
    >
      {/* ── SVG world map background ─────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <svg
          className="w-full h-full"
          viewBox="0 0 1000 600"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="map-grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            </pattern>
            <filter id="node-glow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="line-glow" x="-20%" y="-200%" width="140%" height="500%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Grid */}
          <rect width="1000" height="600" fill="url(#map-grid)" />

          {/* Latitude lines */}
          {[150, 200, 250, 300, 350].map(y => (
            <line key={y} x1="0" y1={y} x2="1000" y2={y}
              stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          ))}

          {/* Continent silhouettes */}
          {CONTINENTS.map((d, i) => (
            <path key={i} d={d}
              fill="rgba(255,255,255,0.07)"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1" />
          ))}

          {/* Inactive city nodes */}
          {CITY_NODES.map(({ id, cx, cy, label }) => {
            const active = id === route.origin.nodeId || id === route.dest.nodeId
            if (active) return null
            return (
              <g key={id}>
                <circle cx={cx} cy={cy} r={3} fill="rgba(255,255,255,0.3)" />
                <text x={cx + 6} y={cy + 4} fontSize="8" fill="rgba(255,255,255,0.3)"
                  fontFamily="Montserrat,sans-serif" fontWeight="700">{label}</text>
              </g>
            )
          })}

          {/* Dashed flight route — SVG strokeDasharray + CSS animation */}
          <path
            ref={pathRef}
            d={route.path}
            fill="none"
            stroke="#ffc640"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="8 5"
            filter="url(#line-glow)"
            style={{ animation: 'dash 2s linear infinite' }}
          />

          {/* Active city nodes with pulse rings */}
          {CITY_NODES.map(({ id, cx, cy, label }) => {
            const active = id === route.origin.nodeId || id === route.dest.nodeId
            if (!active) return null
            return (
              <g key={id} filter="url(#node-glow)">
                <circle cx={cx} cy={cy} r={12} fill="none"
                  stroke="rgba(255,198,64,0.4)" strokeWidth="1.5"
                  style={{ animation: 'pulse-ring 1.8s ease-out infinite' }} />
                <circle cx={cx} cy={cy} r={5} fill="#ffc640" />
                <text x={cx + 8} y={cy + 4} fontSize="9" fill="#ffc640"
                  fontFamily="Montserrat,sans-serif" fontWeight="700">{label}</text>
              </g>
            )
          })}

          {/* JS-animated plane */}
          {planePos.x !== 0 && (
            <g
              transform={`translate(${planePos.x},${planePos.y}) rotate(${planePos.angle})`}
              filter="url(#node-glow)"
            >
              <circle r="5" fill="#ffc640" />
              <polygon points="-8,2 4,0 -8,-2" fill="#ffc640" />
            </g>
          )}
        </svg>
      </div>

      {/* ── Content ──────────────────────────────────────────── */}
      <div
        ref={revealRef}
        className="reveal relative z-10 max-w-container-max mx-auto px-gutter grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
      >
        {/* Left: form */}
        <div className="space-y-8">
          <div>
            <span className="font-label-bold text-label-bold text-on-tertiary-container uppercase tracking-widest">
              İlk Uçuşunu Planla
            </span>
            <h2 className="font-headline-lg text-headline-lg text-white uppercase mt-2">
              Kendi Uçuş Rotanı Belirle!
            </h2>
          </div>

          <div className="space-y-6 max-w-sm">
            <div className="space-y-2">
              <label className="font-label-bold text-label-bold text-white/60 uppercase block">
                Pilot Adı
              </label>
              <input
                type="text"
                value={pilotName}
                onChange={e => setPilotName(e.target.value || 'AYTUĞ')}
                placeholder="AYTUĞ"
                className="w-full bg-surface-container-high border border-white/10 rounded-lg p-4 focus:border-secondary outline-none transition-all text-white font-headline-md uppercase"
              />
            </div>

            <div className="space-y-2">
              <label className="font-label-bold text-label-bold text-white/60 uppercase block">
                Nereye Uçmak İstiyorsun?
              </label>
              <select
                value={selectedRoute}
                onChange={handleRouteChange}
                className="w-full bg-surface-container-high border border-white/10 rounded-lg p-4 focus:border-secondary outline-none transition-all text-white font-label-bold appearance-none cursor-pointer"
              >
                {Object.entries(ROUTES).map(([key, r]) => (
                  <option key={key} value={key}>{r.label}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setBoarded(true)}
              className="w-full bg-on-tertiary-container text-white font-label-bold text-label-bold py-5 rounded-lg flex justify-center items-center gap-2 group hover:brightness-110 active:scale-95 transition-all"
            >
              UÇUŞA HAZIRIM
              <span className="material-symbols-outlined group-hover:rotate-45 transition-transform">flight</span>
            </button>
          </div>
        </div>

        {/* Right: boarding pass */}
        <div className="flex flex-col items-center gap-4">
          {/* Card */}
          <div
            ref={boardingPassRef}
            className={`relative bg-white text-black w-full max-w-md rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${
              passAnim ? 'scale-105' : 'sm:rotate-2 hover:rotate-0'
            }`}
          >
            {/* BOARDED stamp overlay */}
            {boarded && (
              <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                <div
                  className="stamp-in flex flex-col items-center gap-1 px-8 py-4 select-none"
                  style={{
                    border: '5px solid #1e3a8a',
                    outline: '2px solid #1e3a8a',
                    outlineOffset: '4px',
                    color: '#1e3a8a',
                    mixBlendMode: 'multiply',
                    opacity: 0.82,
                  }}
                >
                  <span
                    style={{
                      fontFamily: '"Bebas Neue", cursive',
                      fontSize: '3.2rem',
                      lineHeight: 1,
                      letterSpacing: '0.18em',
                      color: '#1e3a8a',
                    }}
                  >
                    BOARDED
                  </span>
                  <span
                    style={{
                      fontFamily: 'Montserrat, sans-serif',
                      fontSize: '0.55rem',
                      fontWeight: 700,
                      letterSpacing: '0.35em',
                      color: '#1e3a8a',
                    }}
                  >
                    ✦ PILOTKIDS AIRLINES ✦
                  </span>
                  <span
                    style={{
                      fontFamily: 'Montserrat, sans-serif',
                      fontSize: '0.5rem',
                      fontWeight: 600,
                      letterSpacing: '0.2em',
                      color: '#1e3a8a',
                      opacity: 0.7,
                    }}
                  >
                    {route.flightNo} · {today}
                  </span>
                </div>
              </div>
            )}

            {/* Header bar */}
            <div className="bg-on-tertiary-container p-4 flex justify-between items-center text-white">
              <span className="font-label-bold text-[10px] tracking-widest">PILOTKIDS AIRLINES</span>
              <span className="material-symbols-outlined text-sm">flight</span>
            </div>

            <div className="p-6 sm:p-8 space-y-5">
              {/* Captain */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase">Captain</p>
                  <h4 className="font-headline-md text-headline-md tracking-tight uppercase leading-none">
                    {pilotName}
                  </h4>
                  <p className="text-[10px] text-on-tertiary-container font-bold uppercase mt-1">
                    Ready for departure!
                  </p>
                </div>
                <div className="opacity-10">
                  <span className="material-symbols-outlined text-5xl">airplane_ticket</span>
                </div>
              </div>

              <div className="rivet-border" />

              {/* Origin → Destination */}
              <div className="flex justify-between items-center gap-2">
                <div className="text-center flex-1">
                  <div className="font-display-xl text-4xl sm:text-5xl leading-none">{route.origin.code}</div>
                  <p className="text-[10px] font-bold text-gray-500 mt-1">{route.origin.name}</p>
                </div>
                <div className="flex flex-col items-center shrink-0">
                  <span className="material-symbols-outlined text-on-tertiary-container">arrow_forward</span>
                  <span className="text-[8px] font-bold text-gray-400 mt-1">{route.flightNo}</span>
                </div>
                <div className="text-center flex-1">
                  <div className="font-display-xl text-4xl sm:text-5xl leading-none">{route.dest.code}</div>
                  <p className="text-[10px] font-bold text-gray-500 mt-1">{route.dest.name}</p>
                </div>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-4 gap-3 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-[8px] font-bold text-gray-400 uppercase">Gate</p>
                  <p className="font-bold text-sm">{route.gate}</p>
                </div>
                <div>
                  <p className="text-[8px] font-bold text-gray-400 uppercase">Seat</p>
                  <p className="font-bold text-sm">{route.seat}</p>
                </div>
                <div>
                  <p className="text-[8px] font-bold text-gray-400 uppercase">Class</p>
                  <p className="font-bold text-xs">KIDS-PRE</p>
                </div>
                <div>
                  <p className="text-[8px] font-bold text-gray-400 uppercase">Tarih</p>
                  <p className="font-bold text-[10px] leading-tight">{today}</p>
                </div>
              </div>

              {/* Barcode */}
              <div className="pt-2 opacity-70">
                <div className="w-full h-10" style={{
                  background: 'repeating-linear-gradient(90deg,black,black 2px,transparent 2px,transparent 6px)',
                }} />
              </div>
            </div>
          </div>

          {/* Download button */}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 border border-white/20 text-white/70 hover:text-white hover:border-secondary font-label-bold text-label-bold px-6 py-3 rounded-full transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-base">
              {downloading ? 'hourglass_top' : 'download'}
            </span>
            {downloading ? 'İNDİRİLİYOR...' : 'KARTI İNDİR'}
          </button>
        </div>
      </div>
    </section>
  )
}

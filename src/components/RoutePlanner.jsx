import { useState, useRef } from 'react'
import { useReveal } from '../hooks/useReveal'
import { useLanguage } from '../context/LanguageContext'
import { QRCodeSVG } from 'qrcode.react'
import Barcode from './Barcode'
import html2canvas from 'html2canvas'

const SITE_URL = 'https://pilotkids.com.tr'

const ROUTES = {
  'IST-CDG': {
    origin: { code: 'IST', name: 'ISTANBUL', nodeId: 'node-IST' },
    dest:   { code: 'CDG', name: 'PARIS',    nodeId: 'node-CDG' },
    path:   'M 500 250 Q 460 220 420 230',
    gate: 'B-12', seat: '01-A', flightNo: 'PK-2024',
  },
  'LHR-JFK': {
    origin: { code: 'LHR', name: 'LONDON',   nodeId: 'node-LHR' },
    dest:   { code: 'JFK', name: 'NEW YORK', nodeId: 'node-JFK' },
    path:   'M 410 210 Q 300 200 200 260',
    gate: 'A-04', seat: '05-C', flightNo: 'PK-1969',
  },
  'BER-NRT': {
    origin: { code: 'BER', name: 'BERLIN', nodeId: 'node-BER' },
    dest:   { code: 'NRT', name: 'TOKYO',  nodeId: 'node-NRT' },
    path:   'M 460 215 Q 650 180 850 280',
    gate: 'G-21', seat: '03-F', flightNo: 'PK-3301',
  },
  'FCO-DXB': {
    origin: { code: 'FCO', name: 'ROME',  nodeId: 'node-FCO' },
    dest:   { code: 'DXB', name: 'DUBAI', nodeId: 'node-DXB' },
    path:   'M 465 275 Q 550 290 620 330',
    gate: 'E-09', seat: '02-B', flightNo: 'PK-7777',
  },
}

const CITY_NODES = [
  { id: 'node-IST', cx: 500, cy: 250 },
  { id: 'node-CDG', cx: 420, cy: 230 },
  { id: 'node-LHR', cx: 410, cy: 210 },
  { id: 'node-JFK', cx: 200, cy: 260 },
  { id: 'node-BER', cx: 460, cy: 215 },
  { id: 'node-NRT', cx: 850, cy: 280 },
  { id: 'node-FCO', cx: 465, cy: 275 },
  { id: 'node-DXB', cx: 620, cy: 330 },
]

export default function RoutePlanner() {
  const { t, LANGUAGES, lang } = useLanguage()
  const r = t.route

  const [selectedRoute, setSelectedRoute] = useState('IST-CDG')
  const [pilotName, setPilotName]         = useState(r.pilotPlaceholder)
  const [passAnim, setPassAnim]           = useState(false)
  const [boarded, setBoarded]             = useState(false)
  const [downloading, setDownloading]     = useState(false)
  const passRef  = useRef(null)
  const revealRef = useReveal()

  const route    = ROUTES[selectedRoute]
  const langMeta = LANGUAGES.find(l => l.code === lang)
  const dateStr  = new Date().toLocaleDateString(langMeta?.locale || 'tr-TR', {
    day: '2-digit', month: 'short', year: 'numeric',
  })

  function handleRouteChange(e) {
    setSelectedRoute(e.target.value)
    setBoarded(false)
    setPassAnim(true)
    setTimeout(() => setPassAnim(false), 200)
  }

  async function handleDownload() {
    if (!passRef.current) return
    setDownloading(true)
    try {
      const canvas = await html2canvas(passRef.current, { scale: 3, useCORS: true, logging: false })
      const link = document.createElement('a')
      link.download = `boarding-pass-${selectedRoute}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } finally {
      setDownloading(false)
    }
  }

  return (
    <section
      id="route-planner-section"
      className="py-section-gap relative bg-black overflow-hidden"
    >
      {/* SVG world map background */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <svg
          className="w-full h-full"
          viewBox="0 0 1000 600"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="1000" height="600" fill="url(#map-grid)" />

          {CITY_NODES.map(({ id, cx, cy }) => {
            const isActive = id === route.origin.nodeId || id === route.dest.nodeId
            return (
              <g key={id}>
                {isActive && (
                  <circle cx={cx} cy={cy} r={10} fill="transparent" stroke="#ffc640" strokeWidth="1.5" className="pulse" />
                )}
                <circle
                  cx={cx} cy={cy}
                  r={isActive ? 6 : 4}
                  fill={isActive ? '#ffc640' : 'rgba(255,255,255,0.3)'}
                  style={isActive ? { filter: 'drop-shadow(0 0 8px #ffc640)' } : undefined}
                />
              </g>
            )
          })}

          <path
            className="route-line"
            d={route.path}
            fill="none"
            stroke="#ffc640"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* CSS Motion Path plane — remounts on route change via key */}
          <circle
            key={`plane-${selectedRoute}`}
            className="plane-motion"
            style={{ offsetPath: `path('${route.path}')` }}
            fill="#ffc640"
            r="4"
          />
        </svg>
      </div>

      <div
        ref={revealRef}
        className="reveal relative z-10 max-w-container-max mx-auto px-gutter grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
      >
        {/* Left: form */}
        <div className="space-y-8">
          <div>
            <span className="font-label-bold text-label-bold text-on-tertiary-container uppercase tracking-widest">
              {r.sectionLabel}
            </span>
            <h2 className="font-headline-lg text-headline-lg text-white uppercase mt-2">
              {r.sectionTitle}
            </h2>
          </div>

          <div className="space-y-6 max-w-sm">
            <div className="space-y-2">
              <label className="font-label-bold text-label-bold text-white/60 uppercase">
                {r.pilotLabel}
              </label>
              <input
                type="text"
                value={pilotName}
                onChange={e => setPilotName(e.target.value || r.pilotPlaceholder)}
                placeholder={r.pilotPlaceholder}
                className="w-full bg-surface-container-high border border-white/10 rounded-lg p-4 focus:border-secondary outline-none transition-all text-white font-headline-md uppercase"
              />
            </div>

            <div className="space-y-2">
              <label className="font-label-bold text-label-bold text-white/60 uppercase">
                {r.routeLabel}
              </label>
              <select
                value={selectedRoute}
                onChange={handleRouteChange}
                className="w-full bg-surface-container-high border border-white/10 rounded-lg p-4 focus:border-secondary outline-none transition-all text-white font-label-bold appearance-none cursor-pointer"
              >
                {Object.keys(ROUTES).map(key => (
                  <option key={key} value={key}>{r.routes[key]}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setBoarded(true)}
              className="w-full bg-on-tertiary-container text-white font-label-bold text-label-bold py-5 rounded-lg flex justify-center items-center gap-2 group hover:brightness-110 active:scale-95 transition-all"
            >
              {r.ctaButton}
              <span className="material-symbols-outlined group-hover:rotate-45 transition-transform">flight</span>
            </button>
          </div>
        </div>

        {/* Right: boarding pass */}
        <div className="relative flex flex-col items-center gap-4" style={{ perspective: '1000px' }}>
          <div
            ref={passRef}
            className={`relative bg-white text-black w-full max-w-md rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${
              passAnim ? 'scale-105' : 'rotate-2 hover:rotate-0'
            }`}
          >
            {/* BOARDED stamp overlay */}
            {boarded && (
              <div
                className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
                style={{ mixBlendMode: 'multiply' }}
              >
                <div className="stamp-in border-4 border-[#1e3a8a] rounded-lg px-6 py-3 rotate-[-15deg]">
                  <p className="font-headline-lg text-headline-lg text-[#1e3a8a] uppercase tracking-widest leading-none">
                    {r.pass.boarded}
                  </p>
                  <p className="text-[8px] font-bold text-[#1e3a8a] text-center tracking-widest mt-1">
                    {r.pass.boardedSub}
                  </p>
                </div>
              </div>
            )}

            {/* QR code */}
            <div className="absolute top-14 right-4 z-20">
              <QRCodeSVG value={SITE_URL} size={52} bgColor="#ffffff" fgColor="#000000" level="L" />
            </div>

            {/* Header */}
            <div className="bg-on-tertiary-container p-4 flex justify-between items-center text-white">
              <span className="font-label-bold text-[10px]">{r.pass.airline}</span>
              <span className="material-symbols-outlined text-sm">flight</span>
            </div>

            <div className="p-8 space-y-4">
              {/* Captain */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase">{r.pass.captainLabel}</p>
                  <h4 className="font-headline-md text-headline-md tracking-tight uppercase">{pilotName}</h4>
                  <p className="text-[10px] text-on-tertiary-container font-bold uppercase">{r.pass.readyText}</p>
                </div>
                <div className="opacity-10 text-right">
                  <span className="material-symbols-outlined text-6xl">airplane_ticket</span>
                </div>
              </div>

              <div className="rivet-border" />

              {/* Route */}
              <div className="flex justify-between items-center gap-4">
                <div className="text-center flex-1">
                  <h5 className="font-display-xl text-headline-lg m-0">{route.origin.code}</h5>
                  <p className="text-[10px] font-bold text-gray-500">{route.origin.name}</p>
                </div>
                <div className="flex flex-col items-center">
                  <span className="material-symbols-outlined text-on-tertiary-container">arrow_forward</span>
                  <span className="text-[8px] font-bold text-gray-400 mt-1">{route.flightNo}</span>
                </div>
                <div className="text-center flex-1">
                  <h5 className="font-display-xl text-headline-lg m-0">{route.dest.code}</h5>
                  <p className="text-[10px] font-bold text-gray-500">{route.dest.name}</p>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-4 gap-2 pt-3 border-t border-gray-100">
                <div>
                  <p className="text-[8px] font-bold text-gray-400 uppercase">{r.pass.gate}</p>
                  <p className="font-bold text-sm">{route.gate}</p>
                </div>
                <div>
                  <p className="text-[8px] font-bold text-gray-400 uppercase">{r.pass.seat}</p>
                  <p className="font-bold text-sm">{route.seat}</p>
                </div>
                <div>
                  <p className="text-[8px] font-bold text-gray-400 uppercase">{r.pass.classLabel}</p>
                  <p className="font-bold text-xs">{r.pass.classValue}</p>
                </div>
                <div>
                  <p className="text-[8px] font-bold text-gray-400 uppercase">{r.pass.dateLabel}</p>
                  <p className="font-bold text-[10px]">{dateStr}</p>
                </div>
              </div>

              {/* Barcode */}
              <div className="pt-3 opacity-80">
                <Barcode value={`PK-${selectedRoute}-${pilotName}`} />
              </div>
            </div>
          </div>

          {/* Download button */}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 text-white/60 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-40"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            {downloading ? r.downloading : r.downloadBtn}
          </button>
        </div>
      </div>
    </section>
  )
}

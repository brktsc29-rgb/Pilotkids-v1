import { useState, useRef } from 'react'
import html2canvas from 'html2canvas'
import { QRCodeSVG } from 'qrcode.react'
import { useReveal } from '../hooks/useReveal'
import { useLanguage } from '../context/LanguageContext'
import Barcode from './Barcode'

const SITE_URL = 'https://pilotkids.com.tr'

const ROUTES = {
  'IST-CDG': {
    origin:   { code: 'IST', name: 'ISTANBUL', nodeId: 'node-IST' },
    dest:     { code: 'CDG', name: 'PARIS',    nodeId: 'node-CDG' },
    path:     'M 578 225 Q 542 198 507 206',
    gate:     'B-12', seat: '01-A',
    flightNo: 'PK-2024',
  },
  'LHR-JFK': {
    origin:   { code: 'LHR', name: 'LONDON',   nodeId: 'node-LHR' },
    dest:     { code: 'JFK', name: 'NEW YORK', nodeId: 'node-JFK' },
    path:     'M 499 200 Q 390 175 295 226',
    gate:     'A-04', seat: '05-C',
    flightNo: 'PK-1969',
  },
  'BER-NRT': {
    origin:   { code: 'BER', name: 'BERLIN', nodeId: 'node-BER' },
    dest:     { code: 'NRT', name: 'TOKYO',  nodeId: 'node-NRT' },
    path:     'M 537 197 Q 710 155 890 235',
    gate:     'G-21', seat: '03-F',
    flightNo: 'PK-3301',
  },
  'FCO-DXB': {
    origin:   { code: 'FCO', name: 'ROME',  nodeId: 'node-FCO' },
    dest:     { code: 'DXB', name: 'DUBAI', nodeId: 'node-DXB' },
    path:     'M 534 223 Q 592 235 654 257',
    gate:     'E-09', seat: '02-B',
    flightNo: 'PK-7777',
  },
}

// Mercator-projected coordinates (W=1000, H=600)
const CITY_NODES = [
  { id: 'node-IST', cx: 578, cy: 225, label: 'IST' },
  { id: 'node-CDG', cx: 507, cy: 206, label: 'CDG' },
  { id: 'node-LHR', cx: 499, cy: 200, label: 'LHR' },
  { id: 'node-JFK', cx: 295, cy: 226, label: 'JFK' },
  { id: 'node-BER', cx: 537, cy: 197, label: 'BER' },
  { id: 'node-NRT', cx: 890, cy: 235, label: 'NRT' },
  { id: 'node-FCO', cx: 534, cy: 223, label: 'FCO' },
  { id: 'node-DXB', cx: 654, cy: 257, label: 'DXB' },
]

const MAP_W = 1000
const MAP_H = 600
const AR = MAP_W / MAP_H

function routeViewBox(route) {
  const o = CITY_NODES.find(n => n.id === route.origin.nodeId)
  const d = CITY_NODES.find(n => n.id === route.dest.nodeId)
  if (!o || !d) return `0 0 ${MAP_W} ${MAP_H}`

  const cx = (o.cx + d.cx) / 2
  const cy = (o.cy + d.cy) / 2

  const routeSpanX = Math.abs(d.cx - o.cx)
  const routeSpanY = Math.abs(d.cy - o.cy)
  let vbW = Math.max(routeSpanX + 360, 640)
  let vbH = Math.max(routeSpanY + 280, 400)

  // Preserve map aspect ratio so countries don't distort
  if (vbW / vbH > AR) {
    vbH = vbW / AR
  } else {
    vbW = vbH * AR
  }

  // Keep viewBox within map bounds
  let x0 = cx - vbW / 2
  let y0 = cy - vbH / 2
  x0 = Math.max(0, Math.min(x0, MAP_W - vbW))
  y0 = Math.max(0, Math.min(y0, MAP_H - vbH))

  return `${x0} ${y0} ${vbW} ${vbH}`
}

export default function RoutePlanner() {
  const { t, LANGUAGES, lang } = useLanguage()
  const r = t.route

  const [selectedRoute, setSelectedRoute] = useState('IST-CDG')
  const [pilotName, setPilotName]         = useState(r.pilotPlaceholder)
  const [passAnim, setPassAnim]           = useState(false)
  const [boarded, setBoarded]             = useState(false)
  const [downloading, setDownloading]     = useState(false)

  const revealRef       = useReveal()
  const boardingPassRef = useRef(null)

  const route    = ROUTES[selectedRoute]
  const langMeta = LANGUAGES.find(l => l.code === lang)
  const today    = new Date().toLocaleDateString(langMeta?.locale || 'tr-TR', {
    day: '2-digit', month: 'long', year: 'numeric',
  })

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
        scale: 3, backgroundColor: '#ffffff', useCORS: true, logging: false,
      })
      const link    = document.createElement('a')
      link.download = `pilotkids-${route.flightNo}-${pilotName}.png`
      link.href     = canvas.toDataURL('image/png')
      link.click()
    } finally {
      setDownloading(false)
    }
  }

  return (
    <section
      id="route-planner-section"
      className="py-section-gap bg-black overflow-hidden"
    >
      <div
        ref={revealRef}
        className="reveal max-w-container-max mx-auto px-gutter space-y-10"
      >
        {/* Header */}
        <div>
          <span className="font-label-bold text-label-bold text-on-tertiary-container uppercase tracking-widest">
            {r.sectionLabel}
          </span>
          <h2 className="font-headline-lg text-headline-lg text-white uppercase mt-2">
            {r.sectionTitle}
          </h2>
        </div>

        {/* Map card — always visible */}
        <div className="w-full h-52 sm:h-64 md:h-80 rounded-2xl overflow-hidden border border-white/10 bg-[#050a0a]">
          <svg
            className="w-full h-full"
            viewBox={routeViewBox(route)}
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
          >
            <image href="/images/world-map.svg"
              x="0" y="0" width={MAP_W} height={MAP_H} />

            {[150, 200, 250, 300, 350].map(y => (
              <line key={y} x1="0" y1={y} x2={MAP_W} y2={y}
                stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            ))}

            {CITY_NODES.map(({ id, cx, cy, label }) => {
              const active = id === route.origin.nodeId || id === route.dest.nodeId
              if (active) return null
              return (
                <g key={id}>
                  <circle cx={cx} cy={cy} r={3} fill="rgba(255,255,255,0.30)" />
                  <text x={cx + 6} y={cy + 4} fontSize="8"
                    fill="rgba(255,255,255,0.30)"
                    fontFamily="Montserrat,sans-serif" fontWeight="700">
                    {label}
                  </text>
                </g>
              )
            })}

            <path
              d={route.path}
              fill="none"
              stroke="#ffc640"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="8 5"
              opacity="0.9"
              style={{ animation: 'dash 2s linear infinite' }}
            />

            {CITY_NODES.map(({ id, cx, cy, label }) => {
              const active = id === route.origin.nodeId || id === route.dest.nodeId
              if (!active) return null
              return (
                <g key={id}>
                  <circle cx={cx} cy={cy} r={5} fill="none"
                    stroke="rgba(255,198,64,0.6)" strokeWidth="1.5">
                    <animate attributeName="r" from="5" to="22" dur="1.8s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.8" to="0" dur="1.8s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={cx} cy={cy} r={5} fill="#ffc640" />
                  <text x={cx + 8} y={cy + 4} fontSize="9" fill="#ffc640"
                    fontFamily="Montserrat,sans-serif" fontWeight="700">
                    {label}
                  </text>
                </g>
              )
            })}

            <circle
              key={"plane-" + selectedRoute}
              r="5"
              fill="#ffc640"
              className="plane-motion"
              style={{ offsetPath: "path('" + route.path + "')" }}
            />
          </svg>
        </div>

        {/* Form + Boarding pass */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: form */}
          <div className="space-y-6 max-w-sm">
            <div className="space-y-2">
              <label className="font-label-bold text-label-bold text-white/60 uppercase block">
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
              <label className="font-label-bold text-label-bold text-white/60 uppercase block">
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
              <span className="material-symbols-outlined group-hover:rotate-45 transition-transform">
                flight
              </span>
            </button>
          </div>

        {/* Right: boarding pass */}
        <div className="flex flex-col items-center gap-4">
          <div
            ref={boardingPassRef}
            className={"relative bg-white text-black w-full max-w-md rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 " + (passAnim ? 'scale-105' : 'sm:rotate-2 hover:rotate-0')}
          >
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
                  <span style={{ fontFamily: '"Bebas Neue",cursive', fontSize: '3.2rem', lineHeight: 1, letterSpacing: '0.18em', color: '#1e3a8a' }}>
                    {r.pass.boarded}
                  </span>
                  <span style={{ fontFamily: 'Montserrat,sans-serif', fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.35em', color: '#1e3a8a' }}>
                    {r.pass.boardedSub}
                  </span>
                  <span style={{ fontFamily: 'Montserrat,sans-serif', fontSize: '0.5rem', fontWeight: 600, letterSpacing: '0.2em', color: '#1e3a8a', opacity: 0.7 }}>
                    {route.flightNo} · {today}
                  </span>
                </div>
              </div>
            )}

            <div className="bg-on-tertiary-container p-4 flex justify-between items-center text-white">
              <span className="font-label-bold text-[10px] tracking-widest">{r.pass.airline}</span>
              <span className="material-symbols-outlined text-sm">flight</span>
            </div>

            <div className="p-6 sm:p-8 space-y-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase">{r.pass.captainLabel}</p>
                  <h4 className="font-headline-md text-headline-md tracking-tight uppercase leading-none">
                    {pilotName}
                  </h4>
                  <p className="text-[10px] text-on-tertiary-container font-bold uppercase mt-1">
                    {r.pass.readyText}
                  </p>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <QRCodeSVG value={SITE_URL} size={68} bgColor="#ffffff" fgColor="#1e3a8a" level="M" />
                  <span className="text-[7px] font-bold text-gray-400 tracking-wider uppercase">
                    pilotkids.com.tr
                  </span>
                </div>
              </div>

              <div className="rivet-border" />

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

              <div className="grid grid-cols-4 gap-3 pt-4 border-t border-gray-100">
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
                  <p className="font-bold text-[10px] leading-tight">{today}</p>
                </div>
              </div>

              <div className="pt-2">
                <Barcode value={route.flightNo + "-" + selectedRoute} height={52} />
                <p className="text-center font-mono text-[8px] text-gray-400 tracking-widest mt-1 select-none">
                  {route.flightNo} {selectedRoute.replace('-', ' ')}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 border border-white/20 text-white/70 hover:text-white hover:border-secondary font-label-bold text-label-bold px-6 py-3 rounded-full transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-base">
              {downloading ? 'hourglass_top' : 'download'}
            </span>
            {downloading ? r.downloading : r.downloadBtn}
          </button>
        </div>
        </div>{/* end grid */}
      </div>{/* end container */}
    </section>
  )
}

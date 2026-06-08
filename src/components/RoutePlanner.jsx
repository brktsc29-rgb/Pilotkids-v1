import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { toPng } from 'html-to-image'
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
    origin:   { code: 'LHR', name: 'LONDON',      nodeId: 'node-LHR' },
    dest:     { code: 'JFK', name: 'NEW YORK',    nodeId: 'node-JFK' },
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
  'JFK-CDG': {
    origin:   { code: 'JFK', name: 'NEW YORK', nodeId: 'node-JFK' },
    dest:     { code: 'CDG', name: 'PARIS',    nodeId: 'node-CDG' },
    path:     'M 295 226 Q 390 170 507 206',
    gate:     'C-07', seat: '02-A',
    flightNo: 'PK-0001',
  },
  'IST-DXB': {
    origin:   { code: 'IST', name: 'ISTANBUL', nodeId: 'node-IST' },
    dest:     { code: 'DXB', name: 'DUBAI',    nodeId: 'node-DXB' },
    path:     'M 578 225 Q 615 238 654 257',
    gate:     'F-03', seat: '04-D',
    flightNo: 'PK-4500',
  },
  'LAX-NRT': {
    origin:   { code: 'LAX', name: 'LOS ANGELES', nodeId: 'node-LAX' },
    dest:     { code: 'NRT', name: 'TOKYO',        nodeId: 'node-NRT' },
    path:     'M 171 240 Q 520 145 890 235',
    gate:     'H-11', seat: '07-F',
    flightNo: 'PK-8800',
  },
  'FCO-SYD': {
    origin:   { code: 'FCO', name: 'ROME',   nodeId: 'node-FCO' },
    dest:     { code: 'SYD', name: 'SYDNEY', nodeId: 'node-SYD' },
    path:     'M 534 223 Q 728 285 920 361',
    gate:     'D-15', seat: '06-E',
    flightNo: 'PK-6100',
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
  { id: 'node-LAX', cx: 171, cy: 240, label: 'LAX' },
  { id: 'node-SYD', cx: 920, cy: 361, label: 'SYD' },
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
  const spanX = Math.abs(d.cx - o.cx)
  const spanY = Math.abs(d.cy - o.cy)

  // Padding: 30 % of span each side, minimum 90 px H / 70 px V
  const padX = Math.max(90, spanX * 0.3)
  const padY = Math.max(70, spanY * 0.3)
  let vbW = spanX + 2 * padX
  let vbH = spanY + 2 * padY

  // Lock to map aspect ratio (no country distortion)
  if (vbW / vbH > AR) {
    vbH = vbW / AR
  } else {
    vbW = vbH * AR
  }

  // Cap at full-map size — never zoom out beyond the whole map
  if (vbW > MAP_W) {
    vbW = MAP_W
    vbH = MAP_H   // MAP_W / AR === MAP_H since AR = MAP_W / MAP_H
  }

  // Center exactly on the route midpoint.
  // Do NOT clamp position: the SVG renders dark background outside map bounds,
  // so overflow looks fine and keeps both endpoints perfectly centered.
  const x0 = cx - vbW / 2
  const y0 = cy - vbH / 2

  return `${x0.toFixed(1)} ${y0.toFixed(1)} ${vbW.toFixed(1)} ${vbH.toFixed(1)}`
}

export default function RoutePlanner() {
  const { t, LANGUAGES, lang } = useLanguage()
  const r = t.route

  const [selectedRoute, setSelectedRoute] = useState(null)
  const [pilotName, setPilotName]         = useState(r.pilotPlaceholder)
  const [passAnim, setPassAnim]           = useState(false)
  const [boarded, setBoarded]             = useState(false)
  const [downloading, setDownloading]     = useState(false)

  const revealRef       = useReveal()
  const boardingPassRef = useRef(null)

  // Map zoom animation via direct DOM manipulation (no React re-renders per frame)
  const svgRef         = useRef(null)
  const rafRef         = useRef(null)
  const delayRef       = useRef(null)
  const vbRef          = useRef([0, 0, MAP_W, MAP_H])
  const isFirstRender  = useRef(true)

  function runZoom(targetStr) {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    const from = [...vbRef.current]
    const to   = targetStr.split(' ').map(Number)
    const t0   = performance.now()
    const dur  = 750
    function tick(now) {
      const p = Math.min((now - t0) / dur, 1)
      // ease in-out cubic
      const e = p < 0.5 ? 4*p*p*p : 1 - Math.pow(-2*p + 2, 3) / 2
      const vb = from.map((v, i) => v + (to[i] - v) * e)
      vbRef.current = vb
      svgRef.current?.setAttribute('viewBox', vb.join(' '))
      if (p < 1) rafRef.current = requestAnimationFrame(tick)
      else vbRef.current = to
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  // Set initial full-world viewBox before first paint
  useLayoutEffect(() => {
    svgRef.current?.setAttribute('viewBox', `0 0 ${MAP_W} ${MAP_H}`)
    return () => {
      clearTimeout(delayRef.current)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // Zoom when selected route changes; skip on initial mount
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return }
    if (selectedRoute) {
      runZoom(routeViewBox(ROUTES[selectedRoute]))
    } else {
      runZoom(`0 0 ${MAP_W} ${MAP_H}`)
    }
  }, [selectedRoute]) // eslint-disable-line

  const route    = selectedRoute ? ROUTES[selectedRoute] : null
  const langMeta = LANGUAGES.find(l => l.code === lang)
  const today    = new Date().toLocaleDateString(langMeta?.locale || 'tr-TR', {
    day: '2-digit', month: 'long', year: 'numeric',
  })

  function handleRouteChange(e) {
    const val = e.target.value
    setSelectedRoute(val || null)
    setPassAnim(true)
    setBoarded(false)
    setTimeout(() => setPassAnim(false), 300)
  }

  async function handleDownload() {
    if (!boardingPassRef.current || downloading) return
    setDownloading(true)
    try {
      const el = boardingPassRef.current
      const dataUrl = await toPng(el, {
        pixelRatio: 3,
        backgroundColor: '#ffffff',
        // Straighten the card (remove the sm:rotate-2 tilt) for a clean print
        style: { transform: 'none', transition: 'none', boxShadow: 'none' },
        // Embed Google Fonts so the downloaded PNG matches the screen exactly
        includeQueryParams: true,
        cacheBust: false,
      })
      const link    = document.createElement('a')
      link.download = `pilotkids-${route.flightNo}-${pilotName}.png`
      link.href     = dataUrl
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
            ref={svgRef}
            className="w-full h-full"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
          >
            <image href="/images/world-map.svg"
              x="0" y="0" width={MAP_W} height={MAP_H} />

            {[150, 200, 250, 300, 350].map(y => (
              <line key={y} x1="0" y1={y} x2={MAP_W} y2={y}
                stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            ))}

            {/* All city nodes — dim when inactive */}
            {CITY_NODES.map(({ id, cx, cy, label }) => {
              const active = route && (id === route.origin.nodeId || id === route.dest.nodeId)
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

            {/* Route path + active endpoints — only when a route is selected */}
            {route && (
              <>
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

                {CITY_NODES.filter(n => n.id === route.origin.nodeId || n.id === route.dest.nodeId)
                  .map(({ id, cx, cy, label }) => (
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
                ))}

                <circle
                  key={"plane-" + selectedRoute}
                  r="5"
                  fill="#ffc640"
                  className="plane-motion"
                  style={{ offsetPath: "path('" + route.path + "')" }}
                />
              </>
            )}
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
                value={selectedRoute || ''}
                onChange={handleRouteChange}
                className="w-full bg-surface-container-high border border-white/10 rounded-lg p-4 focus:border-secondary outline-none transition-all text-white font-label-bold appearance-none cursor-pointer"
              >
                <option value="" disabled>{r.routeLabel}</option>
                {Object.keys(ROUTES).map(key => (
                  <option key={key} value={key}>{r.routes[key]}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                setBoarded(true)
                setTimeout(() => {
                  boardingPassRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                }, 50)
              }}
              className="w-full bg-on-tertiary-container text-white font-label-bold text-label-bold py-5 rounded-lg flex justify-center items-center gap-2 group hover:brightness-110 active:scale-95 transition-all"
            >
              {r.ctaButton}
              <span className="material-symbols-outlined group-hover:rotate-45 transition-transform">
                flight
              </span>
            </button>
          </div>

        {/* Right: boarding pass or placeholder */}
        <div className="flex flex-col items-center gap-4">
          {!route ? (
            <div className="w-full max-w-md rounded-2xl border border-dashed border-white/15 bg-white/[0.03] flex flex-col items-center justify-center gap-4 py-20 px-8 text-center">
              <span className="material-symbols-outlined text-5xl text-white/20">flight_takeoff</span>
              <p className="font-label-bold text-label-bold text-white/25 uppercase tracking-widest text-sm">
                {r.routeLabel}
              </p>
            </div>
          ) : (
            <>
              <div
                ref={boardingPassRef}
                className={"relative bg-white text-black w-full max-w-md rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 " + (passAnim ? 'scale-105' : 'sm:rotate-2 hover:rotate-0')}
              >
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

                  {/* Route row — stamp scoped here so it never overlaps the QR above */}
                  <div className="relative">
                    {boarded && (
                      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                        <div
                          className="stamp-in flex flex-col items-center gap-1 px-8 py-3 select-none"
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

                    <div className="flex justify-between items-center gap-2">
                      <div className="text-center flex-1">
                        <div className="font-display-xl text-4xl sm:text-5xl leading-none">{route.origin.code}</div>
                        <p className="text-[10px] font-bold text-gray-500 mt-1">{route.origin.name}</p>
                      </div>
                      <div className="flex flex-col items-center shrink-0">
                        {/* Inline SVG arrow — renders correctly everywhere, no font dependency */}
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 12h14M13 6l6 6-6 6" stroke="#eb4141" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="text-[8px] font-bold text-gray-400 mt-1">{route.flightNo}</span>
                      </div>
                      <div className="text-center flex-1">
                        <div className="font-display-xl text-4xl sm:text-5xl leading-none">{route.dest.code}</div>
                        <p className="text-[10px] font-bold text-gray-500 mt-1">{route.dest.name}</p>
                      </div>
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
            </>
          )}
        </div>
        </div>{/* end grid */}
      </div>{/* end container */}
    </section>
  )
}

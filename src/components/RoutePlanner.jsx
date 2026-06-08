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
    path:     'M 500 250 Q 460 220 420 230',
    gate:     'B-12', seat: '01-A',
    flightNo: 'PK-2024',
  },
  'LHR-JFK': {
    origin:   { code: 'LHR', name: 'LONDON',   nodeId: 'node-LHR' },
    dest:     { code: 'JFK', name: 'NEW YORK', nodeId: 'node-JFK' },
    path:     'M 410 210 Q 300 200 200 260',
    gate:     'A-04', seat: '05-C',
    flightNo: 'PK-1969',
  },
  'BER-NRT': {
    origin:   { code: 'BER', name: 'BERLIN', nodeId: 'node-BER' },
    dest:     { code: 'NRT', name: 'TOKYO',  nodeId: 'node-NRT' },
    path:     'M 460 215 Q 650 170 850 280',
    gate:     'G-21', seat: '03-F',
    flightNo: 'PK-3301',
  },
  'FCO-DXB': {
    origin:   { code: 'FCO', name: 'ROME',  nodeId: 'node-FCO' },
    dest:     { code: 'DXB', name: 'DUBAI', nodeId: 'node-DXB' },
    path:     'M 465 275 Q 550 295 620 330',
    gate:     'E-09', seat: '02-B',
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
  // North America
  'M 30 168 L 30 222 L 44 252 L 58 285 L 72 316 L 100 350 L 150 362 L 168 388 L 196 382 L 184 352 L 165 328 L 154 297 L 162 278 L 188 266 L 200 252 L 218 242 L 250 228 L 262 220 L 248 206 L 225 194 L 195 182 L 165 172 L 136 166 L 105 162 L 72 162 L 42 168 Z',
  // South America
  'M 224 372 L 208 358 L 196 368 L 180 390 L 178 420 L 192 460 L 202 510 L 214 548 L 220 590 L 232 592 L 244 572 L 254 548 L 258 518 L 248 480 L 256 450 L 276 432 L 308 440 L 320 446 L 308 428 L 288 408 L 265 385 L 248 370 Z',
  // Europe
  'M 375 162 L 388 148 L 402 140 L 418 138 L 432 145 L 448 140 L 462 136 L 474 142 L 482 150 L 492 150 L 490 162 L 478 172 L 472 182 L 474 195 L 490 202 L 512 212 L 526 228 L 520 242 L 508 250 L 500 258 L 490 264 L 480 272 L 468 278 L 458 292 L 462 302 L 450 302 L 444 285 L 438 278 L 428 270 L 426 258 L 418 252 L 412 262 L 406 270 L 393 272 L 386 260 L 388 248 L 378 245 L 373 254 L 365 255 L 360 245 L 366 230 L 372 222 L 368 212 L 358 206 L 352 198 L 352 188 L 360 178 L 365 170 L 358 164 L 368 158 Z',
  // Africa
  'M 358 282 L 372 265 L 388 256 L 404 256 L 418 262 L 428 258 L 442 266 L 454 280 L 466 285 L 480 288 L 500 300 L 520 315 L 535 335 L 538 358 L 525 380 L 520 402 L 510 422 L 498 445 L 484 470 L 465 492 L 448 504 L 432 502 L 415 488 L 408 468 L 406 448 L 398 428 L 386 405 L 376 380 L 368 355 L 362 328 L 358 302 Z',
  // Asia (main body)
  'M 502 260 L 520 242 L 538 235 L 558 240 L 576 250 L 596 255 L 615 268 L 622 310 L 640 322 L 662 308 L 678 292 L 696 278 L 716 270 L 738 268 L 758 270 L 778 268 L 798 272 L 820 278 L 840 278 L 858 280 L 868 294 L 858 310 L 840 325 L 820 338 L 800 346 L 780 356 L 758 360 L 740 352 L 720 345 L 708 352 L 695 365 L 678 378 L 658 388 L 635 388 L 615 375 L 598 360 L 578 352 L 558 346 L 538 336 L 518 318 L 508 298 L 498 278 Z',
  // India peninsula
  'M 558 346 L 575 355 L 590 370 L 595 390 L 585 415 L 572 430 L 558 418 L 548 400 L 542 378 L 545 360 Z',
  // SE Asia/Indochina
  'M 720 345 L 730 360 L 728 380 L 718 395 L 705 402 L 698 390 L 700 372 L 712 358 Z',
  // Japan
  'M 858 250 L 868 256 L 874 272 L 868 282 L 856 278 L 850 262 Z',
  // Australia
  'M 735 430 L 758 418 L 782 415 L 808 418 L 832 428 L 848 445 L 852 468 L 845 492 L 828 508 L 808 518 L 782 522 L 758 518 L 738 505 L 722 488 L 715 465 L 718 442 Z',
]

const AR = 1000 / 600  // original map aspect ratio

function routeViewBox(route) {
  const o = CITY_NODES.find(n => n.id === route.origin.nodeId)
  const d = CITY_NODES.find(n => n.id === route.dest.nodeId)
  if (!o || !d) return '0 0 1000 600'

  const cx = (o.cx + d.cx) / 2
  const cy = (o.cy + d.cy) / 2

  // Ensure enough context around the route
  const routeSpanX = Math.abs(d.cx - o.cx)
  const routeSpanY = Math.abs(d.cy - o.cy)
  let vbW = Math.max(routeSpanX + 360, 640)
  let vbH = Math.max(routeSpanY + 280, 400)

  // Lock to original 5:3 aspect so continents don't stretch
  if (vbW / vbH > AR) {
    vbH = vbW / AR
  } else {
    vbW = vbH * AR
  }

  return `${cx - vbW / 2} ${cy - vbH / 2} ${vbW} ${vbH}`
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
            <defs>
              <pattern id="map-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none"
                  stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="1000" height="600" fill="url(#map-grid)" />

            {[150, 200, 250, 300, 350].map(y => (
              <line key={y} x1="0" y1={y} x2="1000" y2={y}
                stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            ))}

            {CONTINENTS.map((d, i) => (
              <path key={i} d={d}
                fill="rgba(255,255,255,0.10)"
                stroke="rgba(255,255,255,0.22)"
                strokeWidth="1.2" />
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

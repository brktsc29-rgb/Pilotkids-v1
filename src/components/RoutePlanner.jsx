import { useState, useEffect } from 'react'
import { useReveal } from '../hooks/useReveal'

const ROUTES = {
  'IST-CDG': {
    origin: { code: 'IST', name: 'ISTANBUL', nodeId: 'node-IST' },
    dest:   { code: 'CDG', name: 'PARİS',    nodeId: 'node-CDG' },
    path:   'M 500 250 Q 460 220 420 230',
    gate:   'B-12',
    seat:   '01-A',
    label:  'İSTANBUL ➔ PARİS',
    flightNo: 'PK-2024',
  },
  'LHR-JFK': {
    origin: { code: 'LHR', name: 'LONDRA',    nodeId: 'node-LHR' },
    dest:   { code: 'JFK', name: 'NEW YORK',  nodeId: 'node-JFK' },
    path:   'M 410 210 Q 300 200 200 260',
    gate:   'A-04',
    seat:   '05-C',
    label:  'LONDRA ➔ NEW YORK',
    flightNo: 'PK-1969',
  },
  'BER-NRT': {
    origin: { code: 'BER', name: 'BERLİN', nodeId: 'node-BER' },
    dest:   { code: 'NRT', name: 'TOKYO',   nodeId: 'node-NRT' },
    path:   'M 460 215 Q 650 180 850 280',
    gate:   'G-21',
    seat:   '03-F',
    label:  'BERLİN ➔ TOKYO',
    flightNo: 'PK-3301',
  },
  'FCO-DXB': {
    origin: { code: 'FCO', name: 'ROMA',  nodeId: 'node-FCO' },
    dest:   { code: 'DXB', name: 'DUBAİ', nodeId: 'node-DXB' },
    path:   'M 465 275 Q 550 290 620 330',
    gate:   'E-09',
    seat:   '02-B',
    label:  'ROMA ➔ DUBAİ',
    flightNo: 'PK-7777',
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
  const [selectedRoute, setSelectedRoute] = useState('IST-CDG')
  const [pilotName, setPilotName] = useState('AYTUĞ')
  const [passAnim, setPassAnim] = useState(false)
  const revealRef = useReveal()

  const route = ROUTES[selectedRoute]

  function handleRouteChange(e) {
    setSelectedRoute(e.target.value)
    setPassAnim(true)
    setTimeout(() => setPassAnim(false), 200)
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

          {/* City nodes */}
          {CITY_NODES.map(({ id, cx, cy }) => {
            const isActive = id === route.origin.nodeId || id === route.dest.nodeId
            return (
              <circle
                key={id}
                id={id}
                className="city-node"
                cx={cx}
                cy={cy}
                r={isActive ? 6 : 4}
                fill={isActive ? '#ffc640' : 'rgba(255,255,255,0.3)'}
                style={isActive ? { filter: 'drop-shadow(0 0 8px #ffc640)' } : undefined}
              />
            )
          })}

          {/* Animated flight path */}
          <path
            id="flight-path"
            className="route-line"
            d={route.path}
            fill="none"
            stroke="#ffc640"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Animated plane indicator */}
          <circle fill="#ffc640" r="3">
            <animateMotion
              key={selectedRoute}
              dur="4s"
              repeatCount="indefinite"
              rotate="auto"
              path={route.path}
            />
          </circle>
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
              İlk Uçuşunu Planla
            </span>
            <h2 className="font-headline-lg text-headline-lg text-white uppercase mt-2">
              Kendi Uçuş Rotanı Belirle!
            </h2>
          </div>

          <div className="space-y-6 max-w-sm">
            <div className="space-y-2">
              <label className="font-label-bold text-label-bold text-white/60 uppercase">
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
              <label className="font-label-bold text-label-bold text-white/60 uppercase">
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

            <button className="w-full bg-on-tertiary-container text-white font-label-bold text-label-bold py-5 rounded-lg flex justify-center items-center gap-2 group hover:brightness-110 active:scale-95 transition-all">
              UÇUŞA HAZIRIM{' '}
              <span className="material-symbols-outlined group-hover:rotate-45 transition-transform">
                flight
              </span>
            </button>
          </div>
        </div>

        {/* Right: boarding pass */}
        <div className="relative flex justify-center" style={{ perspective: '1000px' }}>
          <div
            id="boarding-pass"
            className={`bg-white text-black w-full max-w-md rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${
              passAnim ? 'scale-105' : 'rotate-2 hover:rotate-0'
            }`}
          >
            {/* Header */}
            <div className="bg-on-tertiary-container p-4 flex justify-between items-center text-white">
              <span className="font-label-bold text-[10px]">PILOTKIDS AIRLINES</span>
              <span className="material-symbols-outlined text-sm">flight</span>
            </div>

            <div className="p-8 space-y-6">
              {/* Captain */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase">Captain</p>
                  <h4 className="font-headline-md text-headline-md tracking-tight uppercase">
                    {pilotName}
                  </h4>
                  <p className="text-[10px] text-on-tertiary-container font-bold uppercase">
                    Ready for departure!
                  </p>
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
                  <span className="material-symbols-outlined text-on-tertiary-container">
                    arrow_forward
                  </span>
                  <span className="text-[8px] font-bold text-gray-400 mt-1">{route.flightNo}</span>
                </div>
                <div className="text-center flex-1">
                  <h5 className="font-display-xl text-headline-lg m-0">{route.dest.code}</h5>
                  <p className="text-[10px] font-bold text-gray-500">{route.dest.name}</p>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100 mt-4">
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
                  <p className="font-bold text-sm">KIDS-PREMIUM</p>
                </div>
              </div>

              {/* Barcode */}
              <div className="flex justify-center pt-6 opacity-70">
                <div
                  className="w-full h-12"
                  style={{
                    background: 'repeating-linear-gradient(90deg,black,black 2px,transparent 2px,transparent 6px)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

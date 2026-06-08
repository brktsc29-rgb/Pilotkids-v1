function hashSeed(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 16777619) >>> 0
  }
  return h
}

function buildRects(value) {
  let seed = hashSeed(value)
  function lcg() {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
    return seed
  }

  const bars = []
  bars.push({ w: 2, dark: true }, { w: 1, dark: false }, { w: 2, dark: true })
  for (let i = 0; i < 11; i++) {
    for (let j = 0; j < 6; j++) {
      bars.push({ w: (lcg() % 4) + 1, dark: j % 2 === 0 })
    }
  }
  bars.push({ w: 2, dark: true }, { w: 1, dark: false }, { w: 2, dark: true }, { w: 1, dark: false }, { w: 2, dark: true })

  const rects = []
  let x = 0
  for (const b of bars) {
    if (b.dark) rects.push({ x, w: b.w })
    x += b.w
  }
  return { rects, total: x }
}

export default function Barcode({ value }) {
  const { rects, total } = buildRects(value)
  return (
    <svg viewBox={`0 0 ${total} 40`} preserveAspectRatio="none" className="w-full h-10">
      {rects.map((r, i) => (
        <rect key={i} x={r.x} y={0} width={r.w} height={40} fill="black" />
      ))}
    </svg>
  )
}

// Deterministic pseudo-Code-128 barcode renderer.
// Not scannable, but visually indistinguishable from a real barcode.

function hashSeed(str) {
  let h = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h
}

function lcg(seed) {
  let s = seed >>> 0
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0
    return s
  }
}

// Returns array of { width: 1|2|3, black: bool }
function buildBars(value) {
  const rand = lcg(hashSeed(value))
  const next = () => (rand() % 3) + 1   // 1, 2 or 3 units

  const bars = []

  // Left quiet zone (white)
  bars.push({ w: 5, black: false })

  // Start guard: narrow-wide-narrow  (black-white-black)
  bars.push({ w: 1, black: true  })
  bars.push({ w: 1, black: false })
  bars.push({ w: 1, black: true  })
  bars.push({ w: 3, black: false })

  // Data region — 11 "characters" × 6 bars each = 66 bars
  for (let c = 0; c < 11; c++) {
    // Each char: 3 black + 3 white bars (alternating) with varied widths
    bars.push({ w: next(), black: true  })
    bars.push({ w: next(), black: false })
    bars.push({ w: next(), black: true  })
    bars.push({ w: next(), black: false })
    bars.push({ w: next(), black: true  })
    bars.push({ w: next(), black: false })
  }

  // Stop guard: wide-narrow-wide-narrow-narrow-black
  bars.push({ w: 2, black: true  })
  bars.push({ w: 1, black: false })
  bars.push({ w: 2, black: true  })
  bars.push({ w: 1, black: false })
  bars.push({ w: 1, black: true  })
  bars.push({ w: 2, black: true  })

  // Right quiet zone (white)
  bars.push({ w: 5, black: false })

  return bars
}

export default function Barcode({ value = 'PK-0000', height = 48, className = '' }) {
  const bars   = buildBars(value)
  const unit   = 2.4                          // px per unit
  const total  = bars.reduce((s, b) => s + b.w * unit, 0)

  let x = 0
  const rects = bars.map((bar, i) => {
    const rectX = x
    x += bar.w * unit
    if (!bar.black) return null
    return (
      <rect
        key={i}
        x={rectX}
        y={0}
        width={bar.w * unit}
        height={height}
        fill="black"
      />
    )
  })

  return (
    <svg
      className={className}
      width="100%"
      height={height}
      viewBox={`0 0 ${total} ${height}`}
      preserveAspectRatio="none"
      aria-label={`Barkod: ${value}`}
    >
      <rect width={total} height={height} fill="white" />
      {rects}
    </svg>
  )
}

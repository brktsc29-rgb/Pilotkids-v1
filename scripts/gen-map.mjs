// Generates public/images/world-map.svg using world-atlas TopoJSON data.
// Projection: Web Mercator, viewBox 0 0 1000 600
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { feature } from 'topojson-client'

const __dirname = dirname(fileURLToPath(import.meta.url))
const W = 1000
const H = 600

function mercator(lon, lat) {
  const x = ((lon + 180) / 360) * W
  const latRad = (lat * Math.PI) / 180
  const yMerc = Math.log(Math.tan(latRad) + 1 / Math.cos(latRad))
  const y = (1 - yMerc / Math.PI) / 2 * H
  return [x, y]
}

function ringToPath(ring) {
  if (ring.length < 2) return ''
  const pts = ring.map(([lon, lat]) => mercator(lon, lat))
  let d = `M ${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`
  for (let i = 1; i < pts.length; i++) {
    const [px] = pts[i - 1]
    const [x, y] = pts[i]
    // Large horizontal jump = antimeridian crossing — lift pen instead of drawing line
    if (Math.abs(x - px) > W * 0.5) {
      d += ` M ${x.toFixed(1)},${y.toFixed(1)}`
    } else {
      d += ` L ${x.toFixed(1)},${y.toFixed(1)}`
    }
  }
  // Close only if last→first segment doesn't cross the antimeridian
  const [lx] = pts[pts.length - 1]
  const [fx] = pts[0]
  if (Math.abs(fx - lx) <= W * 0.5) d += ' Z'
  return d
}

function geometryToPath(geometry) {
  if (!geometry) return ''
  const rings =
    geometry.type === 'Polygon'      ? geometry.coordinates :
    geometry.type === 'MultiPolygon' ? geometry.coordinates.flat() : []
  return rings
    .map(ring => ring.map(([lon, lat]) => [lon, Math.max(-85, Math.min(85, lat))]))
    .map(ringToPath)
    .filter(Boolean)
    .join(' ')
}

const topoPath = join(__dirname, '../node_modules/world-atlas/countries-110m.json')
const topo     = JSON.parse(readFileSync(topoPath, 'utf8'))
const countries = feature(topo, topo.objects.countries)

let paths = ''
for (const f of countries.features) {
  const d = geometryToPath(f.geometry)
  if (d) paths += `<path d="${d}"/>\n`
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
<style>path{fill:#151c1c;stroke:#2e4040;stroke-width:0.5;}</style>
<rect width="${W}" height="${H}" fill="#050a0a"/>
${paths}</svg>`

const out = join(__dirname, '../public/images/world-map.svg')
writeFileSync(out, svg, 'utf8')
console.log(`Written ${out} (${(svg.length / 1024).toFixed(1)} KB)`)

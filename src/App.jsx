import Navbar from './components/Navbar'
import Hero from './components/Hero'
import AircraftCarousel from './components/AircraftCarousel'
import RoutePlanner from './components/RoutePlanner'
import SizeComparison from './components/SizeComparison'
import Events from './components/Events'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="font-body-md text-body-md">
      <Navbar />
      <main>
        <Hero />
        <AircraftCarousel />
        <RoutePlanner />
        <SizeComparison />
        <Events />
      </main>
      <Footer />
    </div>
  )
}

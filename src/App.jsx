import { useEffect } from 'react'
import { LanguageProvider, useLanguage } from './context/LanguageContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import AircraftCarousel from './components/AircraftCarousel'
import RoutePlanner from './components/RoutePlanner'
import SizeComparison from './components/SizeComparison'
import Events from './components/Events'
import Footer from './components/Footer'

function AppContent() {
  const { isRTL } = useLanguage()

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
    document.documentElement.lang = isRTL ? 'ar' : undefined
  }, [isRTL])

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

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  )
}

import { useEffect } from 'react'
import Index from './pages/Index'
import ErrorBoundary from './components/ErrorBoundary'
import { measurePerformance } from './utils/performance'
import { Toaster } from "@/components/ui/toaster"

function App() {
  useEffect(() => {
    measurePerformance();
  }, []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-felt-green overflow-hidden">
        <div className="max-w-[1920px] mx-auto">
          <Index />
        </div>
        <Toaster />
      </div>
    </ErrorBoundary>
  )
}

export default App
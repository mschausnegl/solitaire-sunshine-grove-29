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
        <div className="w-full max-w-screen-xl mx-auto px-1 sm:px-2 md:px-3 lg:px-4">
          <Index />
        </div>
        <Toaster />
      </div>
    </ErrorBoundary>
  )
}

export default App
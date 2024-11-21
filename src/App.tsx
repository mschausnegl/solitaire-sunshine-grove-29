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
      <div className="fixed inset-0 bg-felt-green overflow-hidden">
        <div className="h-full flex flex-col">
          <Index />
        </div>
        <Toaster />
      </div>
    </ErrorBoundary>
  )
}

export default App
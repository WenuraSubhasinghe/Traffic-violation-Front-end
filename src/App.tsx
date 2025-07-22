import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { Sidebar } from './components/layout/Sidebar'
import { Header } from './components/layout/Header'
import { Dashboard } from './pages/Dashboard'
import { SystemAnalysis } from './pages/SystemAnalysis'
import { AccidentDetection } from './pages/AccidentDetection'
import { AccidentFraudDetection } from './pages/AccidentFraudDetection'
import { LanePathViolation } from './pages/LanePathViolation'
import { TrafficLightViolations } from './pages/TrafficLightViolations'
import { SpeedViolation } from './pages/SpeedViolation'
import { RoadSignViolation } from './pages/RoadSignViolation'
export function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <ThemeProvider>
      <Router>
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
          <div className="flex flex-col flex-1 w-full">
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <main className="h-full overflow-y-auto p-4 md:p-6">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/system-analysis" element={<SystemAnalysis />} />
                <Route
                  path="/accident-detection"
                  element={<AccidentDetection />}
                />
                <Route
                  path="/accident-fraud"
                  element={<AccidentFraudDetection />}
                />
                <Route path="/lane-violation" element={<LanePathViolation />} />
                <Route
                  path="/traffic-light"
                  element={<TrafficLightViolations />}
                />
                <Route path="/speed-violation" element={<SpeedViolation />} />
                <Route path="/road-sign" element={<RoadSignViolation />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  )
}

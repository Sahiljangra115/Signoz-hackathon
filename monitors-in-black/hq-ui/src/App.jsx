import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import { HQProvider } from './state/HQContext'

import Overlays from './components/layout/Overlays'
import Shell from './components/layout/Shell'

import Clearance from './pages/Clearance'
import CommandCenter from './pages/CommandCenter'
import Registry from './pages/Registry'
import CaseFiles from './pages/CaseFiles'
import Roster from './pages/Roster'

export default function App() {
  return (
    <HQProvider>
      <MotionConfig reducedMotion="user">
        <div className="relative min-h-screen bg-void text-ink font-mono overflow-hidden">
          <Overlays />
          
          <Routes>
            <Route path="/" element={<Clearance />} />
            <Route
              path="/command"
              element={
                <Shell>
                  <CommandCenter />
                </Shell>
              }
            />
            <Route
              path="/registry"
              element={
                <Shell>
                  <Registry />
                </Shell>
              }
            />
            <Route
              path="/cases"
              element={
                <Shell>
                  <CaseFiles />
                </Shell>
              }
            />
            <Route
              path="/agents"
              element={
                <Shell>
                  <Roster />
                </Shell>
              }
            />
            <Route path="*" element={<Navigate to="/command" replace />} />
          </Routes>
        </div>
      </MotionConfig>
    </HQProvider>
  )
}

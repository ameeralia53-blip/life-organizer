import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import WeeklyTasks from './pages/WeeklyTasks'
import MindMap from './pages/MindMap'
import FreeNotes from './pages/FreeNotes'
import StudyPlan from './pages/StudyPlan'
import Alarm from './pages/Alarm'
import Archive from './pages/Archive'
import Header from './components/Header'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-purple-100 via-white to-gray-50">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/weekly-tasks" element={<WeeklyTasks />} />
          <Route path="/mind-map" element={<MindMap />} />
          <Route path="/free-notes" element={<FreeNotes />} />
          <Route path="/study-plan" element={<StudyPlan />} />
          <Route path="/alarm" element={<Alarm />} />
          <Route path="/archive" element={<Archive />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
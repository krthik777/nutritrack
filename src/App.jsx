import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Auth from './components/Auth'

function Home() {
  return <h2>Home</h2>
}


function Dashboard() {
  return <h2>Dashboard</h2>
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  )
}

export default App

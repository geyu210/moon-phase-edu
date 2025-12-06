import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import MoonPhase from './pages/MoonPhase';
import EscapeVelocity from './pages/EscapeVelocity';
import './App.css';

function App() {
  return (
    // 使用 HashRouter 是为了兼容静态托管（如 Cloudflare/GitHub Pages），防止刷新 404
    <Router>
      <div className="App bg-slate-900 min-h-screen">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/moon" element={<MoonPhase />} />
          <Route path="/escape" element={<EscapeVelocity />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
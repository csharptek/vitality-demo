import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Stars } from '@react-three/drei'
import GlassAvatar from './GlassAvatar'
import './App.css'

const DOMAINS = [
  { key: 'metabolic', label: 'Metabolic', icon: '⚡' },
  { key: 'hormone', label: 'Hormone', icon: '🔬' },
  { key: 'toxin', label: 'Toxin Load', icon: '🛡️' },
  { key: 'gut', label: 'Gut Health', icon: '🌿' },
]

function getOverallScore(scores) {
  const vals = Object.values(scores)
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
}

function getStatusLabel(score) {
  if (score > 66) return { label: 'Optimal', color: '#00ffaa', bg: 'rgba(0,255,170,0.08)' }
  if (score > 33) return { label: 'Moderate', color: '#ffcc44', bg: 'rgba(255,204,68,0.08)' }
  return { label: 'Critical', color: '#ff4466', bg: 'rgba(255,68,102,0.08)' }
}

export default function App() {
  const [scores, setScores] = useState({
    metabolic: 78,
    hormone: 55,
    toxin: 82,
    gut: 40,
  })

  const overall = getOverallScore(scores)
  const status = getStatusLabel(overall)

  return (
    <div className="app">
      {/* Background grid */}
      <div className="bg-grid" />
      <div className="bg-gradient" />

      {/* Header */}
      <header className="header">
        <div className="header-logo">
          <span className="logo-mark">✦</span>
          <span className="logo-text">Vitality Westport</span>
        </div>
        <div className="header-tag">Bio-Print™ Clinical Platform</div>
      </header>

      {/* Main layout */}
      <main className="main">

        {/* Left panel — domain scores */}
        <aside className="panel panel-left">
          <p className="panel-title">Clinical Domains</p>
          <div className="domains">
            {DOMAINS.map(({ key, label, icon }) => (
              <div key={key} className="domain-card">
                <div className="domain-header">
                  <span className="domain-icon">{icon}</span>
                  <span className="domain-label">{label}</span>
                  <span
                    className="domain-score"
                    style={{ color: getStatusLabel(scores[key]).color }}
                  >
                    {scores[key]}
                  </span>
                </div>
                <div className="slider-track">
                  <div
                    className="slider-fill"
                    style={{
                      width: `${scores[key]}%`,
                      background: getStatusLabel(scores[key]).color,
                      boxShadow: `0 0 8px ${getStatusLabel(scores[key]).color}88`,
                    }}
                  />
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={scores[key]}
                  onChange={(e) =>
                    setScores((s) => ({ ...s, [key]: Number(e.target.value) }))
                  }
                  className="range-input"
                  style={{ '--thumb-color': getStatusLabel(scores[key]).color }}
                />
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="legend">
            <div className="legend-item"><span style={{ color: '#00ffaa' }}>●</span> Optimal (67–100)</div>
            <div className="legend-item"><span style={{ color: '#ffcc44' }}>●</span> Moderate (34–66)</div>
            <div className="legend-item"><span style={{ color: '#ff4466' }}>●</span> Critical (0–33)</div>
          </div>
        </aside>

        {/* Center — 3D Canvas */}
        <section className="canvas-wrap">
          {/* Overall score badge */}
          <div className="score-badge" style={{ borderColor: status.color, background: status.bg }}>
            <span className="score-num" style={{ color: status.color }}>{overall}</span>
            <span className="score-label">Bio-Print Score</span>
            <span className="score-status" style={{ color: status.color }}>{status.label}</span>
          </div>

          <Canvas
            camera={{ position: [0, 0.55, 6.5], fov: 38 }}
            gl={{ antialias: true, alpha: true }}
            style={{ background: 'transparent' }}
          >
            <ambientLight intensity={1.2} color="#dff0ff" />
            <directionalLight position={[4, 6, 4]} intensity={2.2} color="#ffffff" />
            <directionalLight position={[-4, 3, -3]} intensity={1.2} color="#c8e8ff" />
            <pointLight position={[0, 3, 2]} intensity={1.5} color="#ffffff" /><pointLight position={[-3, 2, 2]} intensity={0.8} color="#c8f0ff" /><pointLight position={[3, 2, 2]} intensity={0.8} color="#f0f8ff" />
            <Stars radius={80} depth={40} count={800} factor={2} saturation={0.2} fade />
            <Environment preset="city" />
            <GlassAvatar score={overall} />
            <OrbitControls
              enablePan={false}
              enableZoom={true}
              minDistance={4}
              maxDistance={9}
              minPolarAngle={Math.PI / 3}
              maxPolarAngle={Math.PI / 1.8}
              autoRotate={false}
            />
          </Canvas>

          <p className="canvas-hint">Drag to rotate · Adjust sliders to simulate health scores</p>
        </section>

        {/* Right panel — insights */}
        <aside className="panel panel-right">
          <p className="panel-title">Clinical Insights</p>

          <div className="insight-card" style={{ borderColor: `${getStatusLabel(scores.metabolic).color}44` }}>
            <div className="insight-dot" style={{ background: getStatusLabel(scores.metabolic).color }} />
            <div>
              <p className="insight-name">Metabolic Function</p>
              <p className="insight-desc">
                {scores.metabolic > 66
                  ? 'Glucose regulation and energy pathways are performing optimally.'
                  : scores.metabolic > 33
                  ? 'Mild metabolic dysregulation detected. Lab panel recommended.'
                  : 'Significant metabolic stress. Immediate clinical review advised.'}
              </p>
            </div>
          </div>

          <div className="insight-card" style={{ borderColor: `${getStatusLabel(scores.hormone).color}44` }}>
            <div className="insight-dot" style={{ background: getStatusLabel(scores.hormone).color }} />
            <div>
              <p className="insight-name">Hormonal Balance</p>
              <p className="insight-desc">
                {scores.hormone > 66
                  ? 'Endocrine markers within optimal functional ranges.'
                  : scores.hormone > 33
                  ? 'Subclinical hormonal imbalance. Thyroid and cortisol review suggested.'
                  : 'Hormonal disruption flagged. Comprehensive panel required.'}
              </p>
            </div>
          </div>

          <div className="insight-card" style={{ borderColor: `${getStatusLabel(scores.toxin).color}44` }}>
            <div className="insight-dot" style={{ background: getStatusLabel(scores.toxin).color }} />
            <div>
              <p className="insight-name">Toxin Burden</p>
              <p className="insight-desc">
                {scores.toxin > 66
                  ? 'Detoxification pathways are clear and functioning well.'
                  : scores.toxin > 33
                  ? 'Moderate toxic load. Liver support and detox protocol advised.'
                  : 'High toxic burden detected. Urgent detoxification support needed.'}
              </p>
            </div>
          </div>

          <div className="insight-card" style={{ borderColor: `${getStatusLabel(scores.gut).color}44` }}>
            <div className="insight-dot" style={{ background: getStatusLabel(scores.gut).color }} />
            <div>
              <p className="insight-name">Gut Microbiome</p>
              <p className="insight-desc">
                {scores.gut > 66
                  ? 'Microbiome diversity and intestinal integrity are strong.'
                  : scores.gut > 33
                  ? 'Dysbiosis indicators present. Probiotic and dietary support recommended.'
                  : 'Significant gut dysfunction. Comprehensive GI workup required.'}
              </p>
            </div>
          </div>

          <button className="cta-btn">
            View Full Clinical Report →
          </button>
        </aside>

      </main>
    </div>
  )
}

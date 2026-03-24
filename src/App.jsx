import ParticleBackground from './components/ParticleBackground';
import HeroSection from './components/HeroSection';
import CardGrid from './components/CardGrid';
import Footer from './components/Footer';
import './index.css';

function App() {
  return (
    <div className="relative min-h-screen" style={{ background: 'linear-gradient(135deg, #020010 0%, #0a0025 30%, #07001a 60%, #020010 100%)' }}>
      {/* Ambient glow blobs */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
          filter: 'blur(40px)',
          zIndex: 0,
        }}
      />
      <div
        aria-hidden="true"
        className="fixed bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)',
          zIndex: 0,
        }}
      />
      <div
        aria-hidden="true"
        className="fixed top-1/2 left-0 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)',
          filter: 'blur(40px)',
          zIndex: 0,
        }}
      />

      {/* Particle layer */}
      <ParticleBackground />

      {/* Main content */}
      <main className="relative">
        <HeroSection />
        <CardGrid />
        <Footer />
      </main>
    </div>
  );
}

export default App;

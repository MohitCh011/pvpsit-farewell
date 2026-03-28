import { useState } from 'react';
import ParticleBackground from './components/ParticleBackground';
import HeroSection from './components/HeroSection';
import CardGrid from './components/CardGrid';
import Footer from './components/Footer';
import PhotoViewer from './components/PhotoViewer';
import GalleryViewer from './components/GalleryViewer';
import ClassDetails from './components/ClassDetails';
import BackgroundMusic from './components/BackgroundMusic';
import ScrollToTop from './components/ScrollToTop';
import './index.css';

function App() {
  return (
    <div
      className="flex items-center justify-center min-h-screen text-white"
      style={{
        background: 'linear-gradient(135deg, #020010 0%, #0a0025 50%, #020010 100%)',
        fontFamily: 'sans-serif',
      }}
    >
      <h1 className="text-2xl md:text-4xl font-semibold text-center">
        🚀 Will Launch Tomorrow with Updated Photos
      </h1>
    </div>
  );
}

export default App;

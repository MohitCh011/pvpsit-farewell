import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BOYS_PHOTOS, GIRLS_PHOTOS, PASSWORD_HASHES } from '../galleryConfig';
import { BOYS_VIDEOS, GIRLS_VIDEOS } from '../galleryVideosConfig';

// SHA-256 hash helper using the browser's built-in Web Crypto API
const sha256 = async (text) => {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(x => x.toString(16).padStart(2, '0')).join('');
};

// Stages: 'select' | 'password' | 'mediaSelect' | 'gallery'  (lightbox = gallery + lightboxIdx !== null)
const GalleryViewer = ({ isOpen, onClose }) => {
  const [stage, setStage] = useState('select');
  const [gender, setGender] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [pwd, setPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const [showScroll, setShowScroll] = useState(false);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  const getMediaItems = () => {
    if (gender === 'boys') return mediaType === 'videos' ? BOYS_VIDEOS : BOYS_PHOTOS;
    if (gender === 'girls') return mediaType === 'videos' ? GIRLS_VIDEOS : GIRLS_PHOTOS;
    return [];
  };
  const mediaItems = getMediaItems();
  const isEmpty = mediaItems.length === 0;

  // Reset state when closed
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStage('select');
        setGender(null);
        setMediaType(null);
        setPwd('');
        setError('');
        setLightboxIdx(null);
      }, 350);
    }
  }, [isOpen]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Focus password input
  useEffect(() => {
    if (stage === 'password') setTimeout(() => inputRef.current?.focus(), 300);
  }, [stage]);

  // Always scroll to the top when stage or lightbox changes
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [stage, lightboxIdx]);

  const handleGenderSelect = (g) => {
    setGender(g);
    setStage('password');
    setPwd('');
    setError('');
  };

  const handleMediaTypeSelect = (type) => {
    setMediaType(type);
    setStage('gallery');
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const inputHash = await sha256(pwd);
    if (inputHash === PASSWORD_HASHES[gender]) {
      setStage('mediaSelect');
      setError('');
    } else {
      setError('Wrong password. Try again.');
      setShake(true);
      setPwd('');
      setTimeout(() => setShake(false), 500);
    }
  };

  const genderConfig = {
    boys:  { emoji: '👦', label: 'Boys',  color: '#60a5fa', glow: 'rgba(59,130,246,0.5)',  gradient: 'from-blue-600/30 to-cyan-800/20' },
    girls: { emoji: '👧', label: 'Girls', color: '#f472b6', glow: 'rgba(236,72,153,0.5)', gradient: 'from-pink-600/30 to-rose-800/20' },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="gallery-viewer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-50 flex flex-col"
          style={{ background: 'rgba(2,0,16,0.97)', backdropFilter: 'blur(8px)' }}
        >
          {/* ── HEADER ── */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex-shrink-0 flex items-center justify-between px-5 py-4 border-b"
            style={{ borderColor: 'rgba(139,92,246,0.2)', background: 'linear-gradient(to bottom, rgba(10,0,37,0.9), transparent)' }}
          >
            {/* Back button */}
            <motion.button
              whileHover={{ scale: 1.06, x: -2 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => {
                if (lightboxIdx !== null) { setLightboxIdx(null); return; }
                if (stage === 'select')   { onClose(); return; }
                if (stage === 'password') { setStage('select'); return; }
                if (stage === 'mediaSelect') { setStage('password'); setPwd(''); return; }
                if (stage === 'gallery')  { setStage('mediaSelect'); return; }
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white"
              style={{ background: 'rgba(139,92,246,0.18)', border: '1px solid rgba(139,92,246,0.35)' }}
            >
              ← {lightboxIdx !== null ? 'Gallery' : stage === 'gallery' ? 'Back' : stage === 'mediaSelect' ? 'Back' : stage === 'password' ? 'Choose' : 'Back'}
            </motion.button>

            {/* Title */}
            <div className="text-center">
              <p className="text-sm font-bold"
                style={{ background: 'linear-gradient(135deg,#c084fc,#818cf8,#38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                📸 Photo Gallery
              </p>
              {gender && stage !== 'select' && (
                <p className="text-xs mt-0.5" style={{ color: genderConfig[gender].color }}>
                  {genderConfig[gender].emoji} {genderConfig[gender].label}
                </p>
              )}
            </div>

            {/* Close */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-full text-slate-400 hover:text-white text-lg"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              ✕
            </motion.button>
          </motion.div>

          {/* ── BODY ── scrollable, top-aligned so you can scroll back to photo #1 */}
          <div ref={scrollRef} onScroll={(e) => setShowScroll(e.target.scrollTop > 300)} className="flex-1 overflow-y-auto min-h-0 relative">
            <div className="flex flex-col items-center justify-start p-6">
              <AnimatePresence mode="wait">

                {/* STAGE: SELECT GENDER */}
                {stage === 'select' && (
                  <motion.div
                    key="select"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.35 }}
                    className="text-center w-full max-w-sm"
                  >
                    <motion.div
                      animate={{ rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="text-5xl mb-4"
                    >📸</motion.div>
                    <h2 className="text-2xl font-black mb-2"
                      style={{ background: 'linear-gradient(135deg,#c084fc,#818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      Choose Your Album
                    </h2>
                    <p className="text-slate-400 text-sm mb-8">Select to view — password protected 🔒</p>

                    <div className="grid grid-cols-2 gap-4">
                      {(['boys', 'girls']).map((g) => {
                        const cfg = genderConfig[g];
                        return (
                          <motion.button
                            key={g}
                            whileHover={{ scale: 1.05, y: -4 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleGenderSelect(g)}
                            className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-gradient-to-br ${cfg.gradient}`}
                            style={{ border: `1px solid ${cfg.color}40` }}
                          >
                            <span className="text-5xl">{cfg.emoji}</span>
                            <span className="text-white font-bold text-lg">{cfg.label}</span>
                            <span className="text-xs px-3 py-1 rounded-full"
                              style={{ background: `${cfg.color}20`, color: cfg.color, border: `1px solid ${cfg.color}40` }}>
                              Protected
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* STAGE: PASSWORD */}
                {stage === 'password' && (
                  <motion.div
                    key="password"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.35 }}
                    className="text-center w-full max-w-xs"
                  >
                    <motion.span className="text-5xl block mb-4"
                      animate={{ scale: [1, 1.12, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}>
                      🔐
                    </motion.span>
                    <h2 className="text-xl font-black mb-1 text-white">
                      {genderConfig[gender].emoji} {genderConfig[gender].label}&apos;s Album
                    </h2>
                    <p className="text-slate-400 text-sm mb-7">Enter the secret password</p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                      <motion.div
                        animate={shake ? { x: [-10, 10, -8, 8, -5, 5, 0] } : {}}
                        transition={{ duration: 0.4 }}
                        className="relative"
                      >
                        <input
                          ref={inputRef}
                          type={showPwd ? 'text' : 'password'}
                          value={pwd}
                          onChange={(e) => { setPwd(e.target.value); setError(''); }}
                          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                          placeholder="Enter password..."
                          className="w-full px-5 py-3.5 rounded-xl text-white text-center text-lg tracking-widest outline-none"
                          style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: `1px solid ${error ? '#f87171' : `${genderConfig[gender].color}50`}`,
                            caretColor: genderConfig[gender].color,
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPwd(v => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-sm"
                        >
                          {showPwd ? '🙈' : '👁️'}
                        </button>
                      </motion.div>

                      <AnimatePresence>
                        {error && (
                          <motion.p
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-red-400 text-sm"
                          >
                            ❌ {error}
                          </motion.p>
                        )}
                      </AnimatePresence>

                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        className="w-full py-3 rounded-xl font-bold text-white text-sm"
                        style={{ background: `linear-gradient(135deg, ${genderConfig[gender].color}, #7c3aed)` }}
                      >
                        Unlock Album →
                      </motion.button>
                    </form>
                  </motion.div>
                )}

                {/* STAGE: MEDIA SELECT */}
                {stage === 'mediaSelect' && (
                  <motion.div
                    key="mediaSelect"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.35 }}
                    className="text-center w-full max-w-sm"
                  >
                    <motion.div
                      className="text-5xl mb-4"
                    >🗂️</motion.div>
                    <h2 className="text-2xl font-black mb-2 text-white">
                      What to view?
                    </h2>
                    <p className="text-slate-400 text-sm mb-8">Choose photos or videos from {genderConfig[gender].label}&apos;s Album</p>

                    <div className="grid grid-cols-2 gap-4">
                      <motion.button
                        whileHover={{ scale: 1.05, y: -4 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleMediaTypeSelect('photos')}
                        className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-gradient-to-br from-indigo-600/30 to-purple-800/20`}
                        style={{ border: `1px solid rgba(139,92,246,0.4)` }}
                      >
                        <span className="text-4xl">📸</span>
                        <span className="text-white font-bold text-lg">Photos</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05, y: -4 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleMediaTypeSelect('videos')}
                        className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-gradient-to-br from-teal-600/30 to-emerald-800/20`}
                        style={{ border: `1px solid rgba(16,185,129,0.4)` }}
                      >
                        <span className="text-4xl">🎥</span>
                        <span className="text-white font-bold text-lg">Videos</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* STAGE: GALLERY GRID */}
                {stage === 'gallery' && lightboxIdx === null && (
                  <motion.div
                    key="gallery"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-4xl"
                  >
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-black"
                        style={{ color: genderConfig[gender].color }}>
                        {genderConfig[gender].emoji} {genderConfig[gender].label}&apos;s Album
                      </h2>
                      <p className="text-slate-400 text-sm mt-1">{isEmpty ? `No ${mediaType} yet` : `${mediaItems.length} ${mediaType}`}</p>
                    </div>

                    {isEmpty ? (
                      <div className="flex flex-col items-center justify-center gap-4 py-16 text-slate-500">
                        <span className="text-5xl">🖼️</span>
                        <p className="text-sm text-center">
                          No {mediaType} added yet.<br />
                          Drop {mediaType} in <code className="text-purple-400">public/gallery/{gender}/</code><br />
                          and register them in <code className="text-purple-400">src/galleryConfig.js</code>
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {mediaItems.map((item, i) => (
                          <motion.button
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: Math.min(i * 0.02, 1) }}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setLightboxIdx(i)}
                            className="relative rounded-xl overflow-hidden aspect-square"
                            style={{ border: `1px solid ${genderConfig[gender].color}25` }}
                          >
                            {mediaType === 'videos' ? (
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <video src={item.src} className="w-full h-full object-cover opacity-80" preload="metadata" />
                                <div className="absolute w-10 h-10 rounded-full bg-black/60 flex items-center justify-center text-white border border-white/30 pl-1 z-10 backdrop-blur-sm">
                                  ▶
                                </div>
                              </div>
                            ) : (
                              <img
                                src={item.src}
                                alt={item.caption || `Photo ${i + 1}`}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            )}
                            {item.caption && (
                              <div className="absolute bottom-0 left-0 right-0 px-2 py-1 text-xs text-white text-center"
                                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}>
                                {item.caption}
                              </div>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* STAGE: LIGHTBOX */}
                {stage === 'gallery' && lightboxIdx !== null && (
                  <motion.div
                    key="lightbox"
                    initial={{ opacity: 0, scale: 0.88 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.88 }}
                    transition={{ duration: 0.35 }}
                    className="flex flex-col items-center gap-3 w-full max-w-2xl"
                  >
                    {mediaType === 'videos' ? (
                      <video
                        src={mediaItems[lightboxIdx].src}
                        controls
                        autoPlay
                        className="max-w-full max-h-[72vh] object-contain rounded-xl bg-black/50"
                        style={{ boxShadow: `0 0 60px ${genderConfig[gender].glow}` }}
                      />
                    ) : (
                      <img
                        src={mediaItems[lightboxIdx].src}
                        alt={mediaItems[lightboxIdx].caption || `Photo ${lightboxIdx + 1}`}
                        className="max-w-full max-h-[72vh] object-contain rounded-xl"
                        style={{ boxShadow: `0 0 60px ${genderConfig[gender].glow}` }}
                      />
                    )}
                    {mediaItems[lightboxIdx].caption && (
                      <p className="text-slate-300 text-sm italic">{mediaItems[lightboxIdx].caption}</p>
                    )}
                    <div className="flex gap-3 mt-1">
                      <motion.button
                        disabled={lightboxIdx === 0}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setLightboxIdx(i => i - 1)}
                        className="px-5 py-2 rounded-full text-sm font-semibold disabled:opacity-30 text-white"
                        style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.35)' }}
                      >← Prev</motion.button>
                      <motion.button
                        disabled={lightboxIdx === mediaItems.length - 1}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setLightboxIdx(i => i + 1)}
                        className="px-5 py-2 rounded-full text-sm font-semibold disabled:opacity-30 text-white"
                        style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.35)' }}
                      >Next →</motion.button>
                    </div>
                    <p className="text-slate-500 text-xs">{lightboxIdx + 1} / {mediaItems.length}</p>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>

          {/* Local Scroll To Top for Gallery */}
          <AnimatePresence>
            {showScroll && (
              <motion.button
                key="gallery-scroll-top"
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                onClick={() => scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
                className="absolute bottom-16 right-4 sm:bottom-20 sm:right-5 z-50 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', border: '1px solid rgba(139,92,246,0.4)' }}
              >
                ↑
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GalleryViewer;

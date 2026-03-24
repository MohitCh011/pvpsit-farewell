import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BackgroundMusic = () => {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = 0.35;
    audio.loop = true;

    const startMusic = async () => {
      try {
        await audio.play();
        setPlaying(true);
        setShowHint(false);
        // Remove listener once music starts
        document.removeEventListener('click', startMusic);
        document.removeEventListener('touchstart', startMusic);
      } catch {
        // Still blocked — keep hint visible
      }
    };

    // Try immediate autoplay
    const tryAutoplay = async () => {
      try {
        await audio.play();
        setPlaying(true);
      } catch {
        // Autoplay blocked — listen for first interaction
        setShowHint(true);
        document.addEventListener('click', startMusic, { once: true });
        document.addEventListener('touchstart', startMusic, { once: true });
      }
    };

    const timer = setTimeout(tryAutoplay, 600);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', startMusic);
      document.removeEventListener('touchstart', startMusic);
    };
  }, []);

  // Hide hint after 5 seconds
  useEffect(() => {
    if (showHint) {
      const t = setTimeout(() => setShowHint(false), 5000);
      return () => clearTimeout(t);
    }
  }, [showHint]);

  const toggle = () => {
    const audio = audioRef.current;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play();
      setPlaying(true);
      setShowHint(false);
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/bg-music.mp3" preload="auto" />

      {/* Floating music button */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
        {/* Hint bubble */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="px-3 py-2 rounded-xl text-xs text-white text-right max-w-[160px]"
              style={{
                background: 'rgba(139,92,246,0.25)',
                border: '1px solid rgba(139,92,246,0.4)',
                backdropFilter: 'blur(10px)',
              }}
            >
              🎵 Tap to play the farewell song
            </motion.div>
          )}
        </AnimatePresence>

        {/* Music toggle button */}
        <motion.button
          onClick={toggle}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.92 }}
          aria-label={playing ? 'Pause music' : 'Play music'}
          className="w-12 h-12 rounded-full flex items-center justify-center text-white relative"
          style={{
            background: playing
              ? 'linear-gradient(135deg, #7c3aed, #3b82f6)'
              : 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(139,92,246,0.45)',
            backdropFilter: 'blur(12px)',
            boxShadow: playing
              ? '0 0 20px rgba(139,92,246,0.5)'
              : 'none',
          }}
        >
          {/* Spinning ring when playing */}
          {playing && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full"
              style={{ border: '2px solid rgba(192,132,252,0.6)', borderTopColor: 'transparent' }}
            />
          )}
          <span className="text-lg relative z-10">{playing ? '🎵' : '🔇'}</span>
        </motion.button>
      </div>
    </>
  );
};

export default BackgroundMusic;

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PLAYLIST = [
  { src: '/bg-music.mp3', title: 'Dum Dare' },
  { src: '/mustafa-mustafa.mp3', title: 'Mustafa Mustafa' }
];

const BackgroundMusic = () => {
  const audioRef = useRef(null);
  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [nowPlayingHint, setNowPlayingHint] = useState(null);

  // Set initial volume
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.35;
    }
  }, []);

  // Handle track changing
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = PLAYLIST[trackIndex].src;
    audio.load();

    // Only play if it was already playing
    if (playing) {
      audio.play().catch(err => {
        console.warn("Playback blocked or failed:", err);
        setPlaying(false);
      });
    }
  }, [trackIndex]);

  // Show "Now Playing" floating hint when a song starts
  useEffect(() => {
    if (playing) {
      setNowPlayingHint(`Now Playing: ${PLAYLIST[trackIndex].title}`);
      const t = setTimeout(() => setNowPlayingHint(null), 4500);
      return () => clearTimeout(t);
    }
  }, [trackIndex, playing]);

  // Autoplay attempt
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const startMusic = async () => {
      try {
        await audio.play();
        setPlaying(true);
        setShowHint(false);
        document.removeEventListener('click', startMusic);
        document.removeEventListener('touchstart', startMusic);
      } catch {
        // block
      }
    };

    const tryAutoplay = async () => {
      try {
        await audio.play();
        setPlaying(true);
      } catch {
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

  // Hide hint bubble after 5 seconds
  useEffect(() => {
    if (showHint) {
      const t = setTimeout(() => setShowHint(false), 5000);
      return () => clearTimeout(t);
    }
  }, [showHint]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().catch(err => console.warn(err));
      setPlaying(true);
      setShowHint(false);
    }
  };

  const handleEnded = () => {
    // Advance to next song, loops automatically back to 0
    setTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    setPlaying(true);
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={PLAYLIST[trackIndex].src}
        preload="auto"
        onEnded={handleEnded}
      />

      {/* Floating music button */}
      <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-50 flex flex-col items-end gap-2">
        {/* Hint bubble */}
        <AnimatePresence>
          {(showHint || nowPlayingHint) && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="px-3 py-2 rounded-xl text-xs text-white text-right max-w-[180px] shadow-lg"
              style={{
                background: 'rgba(139,92,246,0.3)',
                border: '1px solid rgba(139,92,246,0.5)',
                backdropFilter: 'blur(10px)',
              }}
            >
              {nowPlayingHint ? `🎵 ${nowPlayingHint}` : '🎵 Tap to play the farewell song'}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Music toggle button */}
        <motion.button
          onClick={toggle}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.92 }}
          aria-label={playing ? 'Pause music' : 'Play music'}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white relative shadow-lg"
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

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

const PhotoViewer = ({ isOpen, onClose }) => {
  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Lock scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="photo-viewer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center"
          style={{ background: 'rgba(2, 0, 16, 0.97)' }}
          onClick={onClose}
        >
          {/* ── TOP DECORATIVE BAND ── */}
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="w-full flex-shrink-0 flex flex-col items-center justify-center py-5 px-4 text-center relative"
            style={{ background: 'linear-gradient(to bottom, rgba(10,0,37,1) 0%, rgba(2,0,16,0.0) 100%)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Floating particles strip */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: Math.random() * 4 + 2,
                    height: Math.random() * 4 + 2,
                    left: `${(i / 12) * 100 + Math.random() * 8}%`,
                    top: `${20 + Math.random() * 60}%`,
                    background: ['#c084fc', '#818cf8', '#38bdf8', '#f472b6'][i % 4],
                  }}
                  animate={{ y: [0, -10, 0], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>

            {/* Back button */}
            <motion.button
              whileHover={{ scale: 1.08, x: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white"
              style={{
                background: 'rgba(139,92,246,0.2)',
                border: '1px solid rgba(139,92,246,0.4)',
                backdropFilter: 'blur(10px)',
              }}
            >
              ← Back
            </motion.button>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl sm:text-3xl font-black"
              style={{
                background: 'linear-gradient(135deg, #c084fc, #818cf8, #38bdf8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              CSE Batch 2022–2026 🎓
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-slate-400 text-xs sm:text-sm mt-1"
            >
              PVPSIT · Together we made history
            </motion.p>
          </motion.div>

          {/* ── PHOTO ── */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, filter: 'blur(10px)' }}
            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
            exit={{ scale: 0.85, opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
            className="flex-1 w-full flex items-center justify-center px-2 py-2 min-h-0"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src="/class-photo.jpg"
              alt="CSE 2022–2026 Batch Group Photo"
              className="max-w-full max-h-full object-contain rounded-xl"
              style={{
                boxShadow: '0 0 60px rgba(139,92,246,0.25), 0 0 120px rgba(59,130,246,0.1)',
                border: '1px solid rgba(139,92,246,0.2)',
              }}
            />
          </motion.div>

          {/* ── BOTTOM DECORATIVE BAND ── */}
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="w-full flex-shrink-0 flex flex-col items-center justify-center py-5 px-4 text-center relative overflow-hidden"
            style={{ background: 'linear-gradient(to top, rgba(10,0,37,1) 0%, rgba(2,0,16,0.0) 100%)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Animated gradient line */}
            <motion.div
              className="absolute top-0 left-0 w-full h-px"
              style={{
                background: 'linear-gradient(90deg, transparent, #7c3aed, #3b82f6, #7c3aed, transparent)',
                backgroundSize: '200% 100%',
              }}
              animate={{ backgroundPosition: ['0% 0%', '200% 0%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="text-slate-400 text-xs sm:text-sm italic"
            >
              &ldquo;Don&apos;t cry because it&apos;s over — smile because it happened.&rdquo;
            </motion.p>

            {/* Batch tags */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-2 mt-3"
            >
              {['CSE 2022–2026', 'PVPSIT', 'Farewell 2026', 'Always Together ❤️'].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    background: 'rgba(139,92,246,0.12)',
                    border: '1px solid rgba(139,92,246,0.25)',
                    color: '#c4b5fd',
                  }}
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PhotoViewer;

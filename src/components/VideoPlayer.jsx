import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FriendsDot = ({ color }) => (
  <span className="mx-0.5 sm:mx-1 text-sm sm:text-base md:text-lg font-black select-none align-middle" style={{ color }}>•</span>
);

const VideoPlayer = ({ isOpen, onClose }) => {
  // Lock body scroll when video is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="memories-video-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4"
          style={{
            // Friends iconic purple wall color
            background: 'radial-gradient(circle, rgba(111,80,158,0.98) 0%, rgba(59,42,88,0.99) 100%)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* HEADER / TITLE (Friends Font Style) */}
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-center mb-6 max-w-lg select-none"
          >
            <p className="text-xs uppercase tracking-[0.25em] text-yellow-300 font-bold mb-2">
              CSE Class of 2026 Farewell
            </p>
            <h2 className="font-serif tracking-widest font-black text-white text-base sm:text-lg md:text-xl leading-tight">
              T<FriendsDot color="#ef4444" />H<FriendsDot color="#3b82f6" />E<FriendsDot color="#eab308" />&nbsp;&nbsp;
              O<FriendsDot color="#ef4444" />N<FriendsDot color="#3b82f6" />E<FriendsDot color="#eab308" />&nbsp;&nbsp;
              W<FriendsDot color="#ef4444" />I<FriendsDot color="#3b82f6" />T<FriendsDot color="#eab308" />H<FriendsDot color="#ef4444" />&nbsp;&nbsp;
              A<FriendsDot color="#3b82f6" />L<FriendsDot color="#eab308" />L<FriendsDot color="#ef4444" />&nbsp;&nbsp;
              T<FriendsDot color="#3b82f6" />H<FriendsDot color="#eab308" />E<FriendsDot color="#ef4444" />&nbsp;&nbsp;
              M<FriendsDot color="#3b82f6" />E<FriendsDot color="#eab308" />M<FriendsDot color="#ef4444" />O<FriendsDot color="#3b82f6" />R<FriendsDot color="#eab308" />I<FriendsDot color="#ef4444" />E<FriendsDot color="#3b82f6" />S
            </h2>
          </motion.div>

          {/* VIDEO FRAME (Friends Yellow Peephole Frame Style) */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="w-full max-w-3xl aspect-video relative"
            style={{
              border: '12px solid #fbbf24', // Yellow peephole frame color
              boxShadow: '0 0 0 3px #1e1b4b, 0 20px 50px rgba(0, 0, 0, 0.6)',
              borderRadius: '16px',
              background: '#000',
            }}
          >
            {/* The Video Element */}
            <video
              src="/memories-video.mp4"
              controls
              autoPlay
              className="w-full h-full object-contain rounded-sm"
              style={{ maxHeight: '75vh' }}
            />
          </motion.div>

          {/* ACTIONS / CLOSE */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-8 flex gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="px-6 py-2.5 rounded-full text-sm font-semibold text-purple-950 transition-colors shadow-lg"
              style={{
                background: '#fbbf24', // Match the yellow frame
                boxShadow: '0 4px 14px rgba(251, 191, 36, 0.4)',
              }}
            >
              ✕ Close Video
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VideoPlayer;

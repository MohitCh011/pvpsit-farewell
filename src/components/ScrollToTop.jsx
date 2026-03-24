import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollUp = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="scroll-top"
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.92 }}
          onClick={scrollUp}
          aria-label="Scroll to top"
          className="fixed bottom-16 right-4 sm:bottom-20 sm:right-5 z-50 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-white shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
            boxShadow: '0 0 18px rgba(124,58,237,0.5)',
            border: '1px solid rgba(139,92,246,0.4)',
          }}
        >
          ↑
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;

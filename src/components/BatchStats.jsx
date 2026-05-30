import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AnimatedCounter = ({ value, duration = 1500, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    let animationFrameId;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [value, duration]);

  return <span>{count.toLocaleString()}{suffix}</span>;
};

const AWARDS = [
  { emoji: '💻', title: 'The Code Guru', desc: 'Always debugging everyone else\'s projects and repositories.' },
  { emoji: '🕵️', title: 'The Silent Hacker', desc: 'Never talks in class, but submits flawless code assignments at 3 AM.' },
  { emoji: '🙋', title: 'The Proxy King', desc: 'Saved half the class from attendance shortage with ninja-level proxies.' },
  { emoji: '☕', title: 'The Cafe Host', desc: 'Spotted in the PVPSIT canteen more often than the CSE classrooms.' },
  { emoji: '🙌', title: 'The Project Carrier', desc: 'The backbone of the team who wrote the actual code for the final project.' },
  { emoji: '💤', title: 'The Backbench Sleeper', desc: 'Averaged 6 hours of sleep during lectures, yet passed with flying colors.' }
];

const BatchStats = ({ isOpen, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="batch-stats"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-50 flex flex-col overflow-hidden"
          style={{ background: 'rgba(2,0,16,0.97)', backdropFilter: 'blur(8px)' }}
        >
          {/* HEADER */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex-shrink-0 px-4 pt-4 pb-3 border-b flex items-center justify-between"
            style={{ borderColor: 'rgba(139,92,246,0.2)', background: 'linear-gradient(to bottom, rgba(10,0,37,0.95), transparent)' }}
          >
            <motion.button
              whileHover={{ scale: 1.06, x: -2 }}
              whileTap={{ scale: 0.94 }}
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white"
              style={{ background: 'rgba(139,92,246,0.18)', border: '1px solid rgba(139,92,246,0.35)' }}
            >
              ← Back
            </motion.button>

            <div className="text-center">
              <p className="text-sm font-black"
                style={{ background: 'linear-gradient(135deg,#fbbf24,#f59e0b,#ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                📊 CSE-1 Batch Stats
              </p>
              <p className="text-xs text-slate-400 mt-0.5">By the numbers · Batch 2022–2026</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-full text-slate-400 hover:text-white"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              ✕
            </motion.button>
          </motion.div>

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin">
            <div className="max-w-4xl mx-auto space-y-8">
              
              {/* NUMERICAL COUNTERS GRID */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: '📅 Days Spent Together', value: 1460, color: '#fbbf24', suffix: '+' },
                  { label: '📚 Lectures Survived', value: 3200, color: '#60a5fa', suffix: '+' },
                  { label: '🧪 Labs Completed', value: 120, color: '#34d399', suffix: '' },
                  { label: '☕ Canteen Teas/Coffees', value: 9500, color: '#f87171', suffix: '+' }
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="p-5 rounded-2xl border flex flex-col items-center justify-center text-center"
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      borderColor: 'rgba(255,255,255,0.05)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                    }}
                  >
                    <span className="text-3xl font-extrabold tracking-tight mb-1" style={{ color: stat.color }}>
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{stat.label}</span>
                  </motion.div>
                ))}
              </div>

              {/* BATCH DYNAMICS BAR */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="p-6 rounded-2xl border"
                style={{
                  background: 'rgba(139,92,246,0.03)',
                  borderColor: 'rgba(139,92,246,0.15)'
                }}
              >
                <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-1.5">⚡ Batch Synergy Status</h3>
                <div className="space-y-4">
                  {[
                    { name: 'Coding Energy', pct: 92, gradient: 'from-blue-500 to-indigo-500' },
                    { name: 'Exam Night Preparation Pace', pct: 98, gradient: 'from-amber-500 to-orange-500' },
                    { name: 'Attendance Attendance Rates', pct: 75, gradient: 'from-emerald-500 to-teal-500' }
                  ].map((bar, i) => (
                    <div key={bar.name} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-400">
                        <span>{bar.name}</span>
                        <span>{bar.pct}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${bar.pct}%` }}
                          transition={{ duration: 1.5, delay: 0.6 + i * 0.1, ease: 'easeOut' }}
                          className={`h-full rounded-full bg-gradient-to-r ${bar.gradient}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* CLASS SUPERLATIVES SECTION */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white text-center">🏆 CSE-1 Batch Superlatives</h3>
                <p className="text-xs text-slate-400 text-center max-w-md mx-auto -mt-2">Unofficially elected legends who defined our 4-year classroom experience.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                  {AWARDS.map((award, i) => (
                    <motion.div
                      key={award.title}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 + i * 0.08 }}
                      className="p-5 rounded-2xl border text-left flex gap-4 transition-colors"
                      style={{
                        background: 'rgba(255,255,255,0.02)',
                        borderColor: 'rgba(255,255,255,0.05)',
                      }}
                      whileHover={{
                        background: 'rgba(245,158,11,0.05)',
                        borderColor: 'rgba(245,158,11,0.2)'
                      }}
                    >
                      <span className="text-3xl select-none flex items-center justify-center p-2 rounded-xl bg-white/5 h-fit">{award.emoji}</span>
                      <div>
                        <h4 className="text-sm font-bold text-white mb-1">{award.title}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">{award.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BatchStats;

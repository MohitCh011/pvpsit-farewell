import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';


import STUDENTS from '../../students.json';

const ClassDetails = ({ isOpen, onClose }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [search, setSearch] = useState('');
  const [showScroll, setShowScroll] = useState(false);
  const [activeStudent, setActiveStudent] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const scrollRef = useRef(null);

  // Fetch students from backend
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/students');
      if (!res.ok) throw new Error('Failed to fetch from backend');
      const data = await res.json();
      setStudents(data);
      setIsOffline(false);
    } catch (err) {
      console.warn('Backend offline, using fallback static data:', err);
      setStudents(STUDENTS);
      setIsOffline(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStudents();
    }
  }, [isOpen]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return students;
    return students.filter(s =>
      s.name.toLowerCase().includes(q) || s.htno.toLowerCase().includes(q)
    );
  }, [search, students]);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);



  const showToast = (msg, isError = false) => {
    setToastMessage({ text: msg, isError });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="class-details"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-50 flex flex-col"
          style={{ background: 'rgba(2,0,16,0.97)', backdropFilter: 'blur(8px)' }}
        >
          {/* HEADER */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex-shrink-0 px-4 pt-4 pb-3 border-b"
            style={{ borderColor: 'rgba(139,92,246,0.2)', background: 'linear-gradient(to bottom, rgba(10,0,37,0.95), transparent)' }}
          >
            {/* Top row */}
            <div className="flex items-center justify-between mb-3">
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
                <div className="flex items-center justify-center gap-1.5 text-sm font-black text-white">
                  <span>📋</span>
                  <span style={{ background: 'linear-gradient(135deg,#c084fc,#818cf8,#38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    CSE-1 Class Roll
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">PVPSIT · Batch 2022–2026</p>
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
            </div>

            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name or hall ticket..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white outline-none"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(139,92,246,0.3)',
                  caretColor: '#c084fc',
                }}
              />
              {search && (
                <button onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-sm">
                  ✕
                </button>
              )}
            </div>

            {/* Count */}
            <p className="text-center text-xs text-slate-500 mt-2">
              {filtered.length} of {students.length} students
            </p>
          </motion.div>

          {/* TABLE */}
          <div ref={scrollRef} onScroll={(e) => setShowScroll(e.target.scrollTop > 300)} className="flex-1 overflow-y-auto px-3 py-3 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="max-w-2xl mx-auto"
            >


              {/* Table header */}
              <div className="grid grid-cols-12 gap-2 px-3 py-2 mb-2 rounded-lg sticky top-0 text-xs font-bold uppercase tracking-wider"
                style={{ background: 'rgba(139,92,246,0.15)', color: '#c084fc' }}>
                <div className="col-span-1">#</div>
                <div className="col-span-4">Hall Ticket</div>
                <div className="col-span-7">Student Name</div>
              </div>

              {/* Rows */}
              <div className="space-y-1">
                {loading ? (
                  <div className="text-center text-slate-500 py-12 text-sm flex flex-col items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500"></div>
                    Loading class roster...
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="text-center text-slate-500 py-12 text-sm">No students found</div>
                ) : (
                  filtered.map((s, i) => {
                    const isLateral = s.htno.startsWith('23505');
                    return (
                      <motion.div
                        key={s.htno}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: Math.min(i * 0.015, 0.5) }}
                        className="grid grid-cols-12 gap-2 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer"
                        onClick={() => setActiveStudent(s)}
                        style={{
                          background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'transparent',
                          border: '1px solid transparent',
                        }}
                        whileHover={{
                          background: 'rgba(139,92,246,0.08)',
                          borderColor: 'rgba(139,92,246,0.2)',
                        }}
                      >
                        <div className="col-span-1 text-slate-500 text-xs flex items-center">{s.sno}</div>
                        <div className="col-span-4 font-mono text-xs flex items-center"
                          style={{ color: isLateral ? '#fbbf24' : '#60a5fa' }}>
                          {s.htno}
                          {isLateral && (
                            <span className="ml-1 text-xs px-1 rounded" style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24', fontSize: '9px' }}>LE</span>
                          )}
                        </div>
                        <div className="col-span-7 text-white font-medium flex items-center text-xs sm:text-sm leading-tight">{s.name}</div>
                      </motion.div>
                    );
                  })
                )}
              </div>

              {/* Footer note */}
              <div className="text-center mt-6 mb-2 space-y-1">
                <p className="text-slate-600 text-xs">
                  <span className="text-blue-400 font-mono text-xs">22501A05xx</span> — Regular &nbsp;|&nbsp;
                  <span className="text-yellow-400 font-mono text-xs">23505A05xx</span> — Lateral Entry
                </p>
                <p className="text-slate-600 text-xs">🎓 CSE-1 · PVPSIT · Batch 2022–2026</p>
              </div>
            </motion.div>
          </div>

          {/* Local Scroll To Top for Class Details */}
          <AnimatePresence>
            {showScroll && (
              <motion.button
                key="class-scroll-top"
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



          {/* Toast Notification */}
          <AnimatePresence>
            {toastMessage && (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.9 }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 shadow-xl border"
                style={{
                  background: toastMessage.isError ? 'rgba(220,38,38,0.95)' : 'rgba(139,92,246,0.95)',
                  borderColor: toastMessage.isError ? 'rgba(220,38,38,0.4)' : 'rgba(167,139,250,0.4)',
                  color: '#fff',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
                }}
              >
                <span>{toastMessage.isError ? '❌' : '✨'}</span>
                <span>{toastMessage.text}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Student Profile Modal */}
          <AnimatePresence>
            {activeStudent && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                onClick={() => setActiveStudent(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="w-full max-w-sm rounded-3xl p-6 border text-center relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #090126 0%, #15003c 100%)',
                    borderColor: 'rgba(168, 85, 247, 0.3)',
                    boxShadow: '0 10px 40px rgba(168, 85, 247, 0.15)'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Close button */}
                  <button
                    onClick={() => setActiveStudent(null)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors"
                  >
                    ✕
                  </button>

                  {/* Profile Glow Ring */}
                  <div className="mx-auto w-40 h-40 rounded-full p-1 mb-4 flex items-center justify-center bg-gradient-to-tr from-purple-500 via-pink-500 to-blue-500 shadow-lg shadow-purple-500/20 relative">
                    <div className="w-full h-full rounded-full bg-[#0a0025] overflow-hidden flex items-center justify-center relative">
                      {activeStudent.photoUrl ? (
                        <img
                          src={activeStudent.photoUrl}
                          alt={activeStudent.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://placehold.co/300x300/15003c/a855f7?text=${encodeURIComponent(activeStudent.name.split(' ')[0] || '🎓')}`;
                          }}
                        />
                      ) : (
                        <span className="text-6xl select-none">🎓</span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1 tracking-wide">{activeStudent.name}</h3>
                  
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="font-mono text-sm font-semibold" style={{ color: activeStudent.htno.startsWith('23505') ? '#fbbf24' : '#60a5fa' }}>
                      {activeStudent.htno}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full select-none font-bold" 
                          style={{ 
                            background: activeStudent.htno.startsWith('23505') ? 'rgba(251,191,36,0.15)' : 'rgba(96,165,250,0.15)', 
                            color: activeStudent.htno.startsWith('23505') ? '#fbbf24' : '#60a5fa' 
                          }}>
                      {activeStudent.htno.startsWith('23505') ? 'Lateral Entry' : 'Regular'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mb-6 italic">
                    CSE-1 · Batch 2022–2026
                  </p>

                  <button
                    onClick={() => setActiveStudent(null)}
                    className="w-full py-2.5 rounded-xl font-bold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      background: 'linear-gradient(135deg, #7c3aed, #db2777)',
                    }}
                  >
                    Close Profile
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ClassDetails;

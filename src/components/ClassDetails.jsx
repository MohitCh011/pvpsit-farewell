import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STUDENTS = [
  { sno: 1,  htno: '22501A0501', name: 'AAKASH KODALI' },
  { sno: 2,  htno: '22501A0502', name: 'ABDUL AZEEZ' },
  { sno: 3,  htno: '22501A0503', name: 'ABDUL JABBAR' },
  { sno: 4,  htno: '22501A0504', name: 'ADAPA HEMESH' },
  { sno: 5,  htno: '22501A0505', name: 'AKURI NAIMISHA' },
  { sno: 6,  htno: '22501A0506', name: 'ALA SRUTHI SREE' },
  { sno: 7,  htno: '22501A0507', name: 'ALLAMSETTI HARSHINI' },
  { sno: 8,  htno: '22501A0508', name: 'ALURI MEENAKSHI' },
  { sno: 9,  htno: '22501A0509', name: 'ALURI SINDHU' },
  { sno: 10, htno: '22501A0510', name: 'AMRUTHALURI NAGA PAVAN KUMAR' },
  { sno: 11, htno: '22501A0511', name: 'ANANDA SATYA SAI SREEKAR PULA' },
  { sno: 12, htno: '22501A0512', name: 'ANJUSRI KANDI' },
  { sno: 13, htno: '22501A0513', name: 'ANKEM GREESHWANTH' },
  { sno: 14, htno: '22501A0514', name: 'ANNE GRISHMANTH RAM CHOWDARY' },
  { sno: 15, htno: '22501A0515', name: 'APPANA HARINI' },
  { sno: 16, htno: '22501A0516', name: 'AVVARI SAI ANIL KUMAR' },
  { sno: 17, htno: '22501A0517', name: 'BALLA NAVYA SRI' },
  { sno: 18, htno: '22501A0518', name: 'BANDAPU BHUVANESWARA RAO' },
  { sno: 19, htno: '22501A0519', name: 'BANOTHU PRAVEEN NAYAK' },
  { sno: 20, htno: '22501A0520', name: 'BATHULA KIRAN KUMAR' },
  { sno: 21, htno: '22501A0521', name: 'BATTU NAGA ROOPA SRI' },
  { sno: 22, htno: '22501A0522', name: 'BEZWADA RAJ DEEP' },
  { sno: 23, htno: '22501A0523', name: 'BHUKYA JAYANTHI' },
  { sno: 24, htno: '22501A0524', name: 'BHUKYA SOWMYA' },
  { sno: 25, htno: '22501A0525', name: 'BOODALA AKHIL' },
  { sno: 26, htno: '22501A0526', name: 'BORRA SAI SRIKAR' },
  { sno: 27, htno: '22501A0527', name: 'BUDDAVARAPU GOWTHAMI PRIYA' },
  { sno: 28, htno: '22501A0528', name: 'BURRA TOOJITHA THANU SRI' },
  { sno: 29, htno: '22501A0529', name: 'CHALLAPALLI SATYA VENKATA HEMANTH' },
  { sno: 30, htno: '22501A0530', name: 'CHANDALURI MOHIT' },
  { sno: 31, htno: '22501A0531', name: 'CHANDHANA CHANDRA SHEKAR' },
  { sno: 32, htno: '22501A0532', name: 'CHINNI PUNITA SAI DHEERAJ' },
  { sno: 33, htno: '22501A0533', name: 'CHINTHALAPATI SRI VENKATA SAI SUBRAHMANYAM' },
  { sno: 34, htno: '22501A0534', name: 'CHITTA SAI LAKSHMI MEGHANA' },
  { sno: 35, htno: '22501A0535', name: 'CHODAPANEEDI SAI NISANTH' },
  { sno: 36, htno: '22501A0536', name: 'DALLI DELISHA' },
  { sno: 37, htno: '22501A0537', name: 'DANGUDUBIYYAPU AKASH' },
  { sno: 38, htno: '22501A0538', name: 'DASARI LIKHITHA SRI' },
  { sno: 39, htno: '22501A0539', name: 'DASARI NEERAJA' },
  { sno: 40, htno: '22501A0540', name: 'DEVANABOINA RENUKA VENKATA PADMA' },
  { sno: 41, htno: '22501A0541', name: 'DIRISALA BHARGAVI' },
  { sno: 42, htno: '22501A0542', name: 'EDA DURGA SRI LAHARI' },
  { sno: 43, htno: '22501A0543', name: 'EDE LAASYA' },
  { sno: 44, htno: '22501A0544', name: 'EERUGULA SHELIAN GLADIS' },
  { sno: 45, htno: '22501A0545', name: 'ERIGINABOYINA HARI KRISHNA' },
  { sno: 46, htno: '22501A0546', name: 'GALETI LAKSHMI PRIYANKA' },
  { sno: 47, htno: '22501A0547', name: 'GANDHAM LOKESH' },
  { sno: 48, htno: '22501A0548', name: 'GANDU NEHA PRIYA' },
  { sno: 49, htno: '22501A0549', name: 'GARAPATI GOWTHAM CHOWDARY' },
  { sno: 50, htno: '22501A0550', name: 'GARIKA SUBHASH' },
  { sno: 51, htno: '22501A0552', name: 'GARIKAPATI SIVA SANKARA VARA PRASAD SIDDU' },
  { sno: 52, htno: '22501A0553', name: 'GAYAM SRAVANI' },
  { sno: 53, htno: '22501A0554', name: 'GONA CHARL RAJ' },
  { sno: 54, htno: '22501A0555', name: 'GOPISETTI ABHIRAM' },
  { sno: 55, htno: '22501A0556', name: 'GOPISETTY HARSHINI' },
  { sno: 56, htno: '22501A0557', name: 'GOVVALA VENKATA SAI RAM' },
  { sno: 57, htno: '22501A0558', name: 'GUBBALA DEVI PRIYA ANJALI' },
  { sno: 58, htno: '22501A0559', name: 'GUDDANTI SAI PRANITH' },
  { sno: 59, htno: '22501A0560', name: 'GULUGULURI TEJASWINI' },
  { sno: 60, htno: '22501A0561', name: 'GUMPELLA SAI SETHU SAI' },
  { sno: 61, htno: '22501A0562', name: 'GUNTI RANI' },
  { sno: 62, htno: '22501A0563', name: 'GURRAM VEERA VENKATA LALITH KRISHNA' },
  { sno: 63, htno: '22501A0564', name: 'HUNAINA HAFSA' },
  { sno: 64, htno: '22501A0565', name: 'ILLATURI SAKETH' },
  { sno: 65, htno: '22501A0566', name: 'INDURI NITHYANANDA REDDY' },
  // Lateral entries
  { sno: 66, htno: '23505A0501', name: 'ADAPALA MRUDULA' },
  { sno: 67, htno: '23505A0502', name: 'CHORAGUDI SRUTHI' },
  { sno: 68, htno: '23505A0503', name: 'CHUNDURU KESAVA HARSHITHA' },
  { sno: 69, htno: '23505A0504', name: 'KOPPULA SANDEEP' },
  { sno: 70, htno: '23505A0505', name: 'KUMBHAGIRI RAKESH' },
  { sno: 71, htno: '23505A0506', name: 'MAREPALLI SIVANI' },
];

const ClassDetails = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('');
  const [showScroll, setShowScroll] = useState(false);
  const scrollRef = useRef(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return STUDENTS;
    return STUDENTS.filter(s =>
      s.name.toLowerCase().includes(q) || s.htno.toLowerCase().includes(q)
    );
  }, [search]);

  // Lock scroll
  useState(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

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
                <p className="text-sm font-black"
                  style={{ background: 'linear-gradient(135deg,#c084fc,#818cf8,#38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  📋 CSE-1 Class Roll
                </p>
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
              {filtered.length} of {STUDENTS.length} students
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
                {filtered.length === 0 ? (
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
                        className="grid grid-cols-12 gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors"
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ClassDetails;

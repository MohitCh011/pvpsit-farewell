import { motion } from 'framer-motion';

const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.25, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  return (
    <section className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 pt-8 pb-16">
      {/* Top badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-8"
      >
        <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium"
          style={{
            background: 'rgba(139, 92, 246, 0.15)',
            border: '1px solid rgba(139, 92, 246, 0.35)',
            color: '#c4b5fd',
          }}>
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse inline-block" />
          PVPSIT · Farewell 2026
        </span>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Main title */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-none flex flex-wrap justify-center items-center gap-2 sm:gap-4"
        >
          <span className="gradient-text">CSE 2022–2026</span>
          <span className="text-4xl sm:text-6xl -mt-1 sm:mt-0">🎓</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl md:text-2xl font-light max-w-2xl mx-auto leading-relaxed"
          style={{ color: 'rgba(203, 213, 225, 0.85)' }}
        >
          We came as strangers,&nbsp;
          <span className="font-medium" style={{ color: '#c084fc' }}>
            we leave as memories
          </span>
          &nbsp;❤️
        </motion.p>

        {/* Decorative divider */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-4 pt-2"
        >
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-purple-500 opacity-60" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            className="text-2xl"
          >
            ✨
          </motion.div>
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-blue-500 opacity-60" />
        </motion.div>

        {/* Stats row */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-6 pt-4"
        >
          {[
            { value: '4', label: 'Years' },
            { value: '∞', label: 'Memories' },
            { value: '1', label: 'Family' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-bold gradient-text">{value}</p>
              <p className="text-sm text-slate-400 mt-1">{label}</p>
            </div>
          ))}
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          variants={itemVariants}
          className="pt-8 flex flex-col items-center gap-2 text-slate-500 text-sm"
        >
          <span>Explore your memories</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="text-lg"
          >
            ↓
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;

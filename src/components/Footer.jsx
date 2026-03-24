import { motion } from 'framer-motion';

const Footer = () => (
  <motion.footer
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 1 }}
    className="relative z-10 py-10 text-center px-4"
  >
    {/* Divider */}
    <div className="flex items-center justify-center gap-4 mb-6">
      <div className="h-px flex-1 max-w-xs bg-gradient-to-r from-transparent to-purple-600/40" />
      <span className="text-purple-400 text-lg">✦</span>
      <div className="h-px flex-1 max-w-xs bg-gradient-to-l from-transparent to-purple-600/40" />
    </div>

    {/* Quote */}
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2, duration: 0.8 }}
      className="text-slate-400 text-sm italic mb-4 max-w-md mx-auto"
    >
      &ldquo;Don&apos;t cry because it&apos;s over, smile because it happened.&rdquo;
    </motion.p>

    {/* Credit */}
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.4, duration: 0.8 }}
      className="text-slate-500 text-sm"
    >
      Made with{' '}
      <motion.span
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 1.2, repeat: Infinity }}
        className="inline-block text-pink-500"
      >
        ❤️
      </motion.span>
      {' '}by{' '}
      <span className="font-semibold gradient-text">Mohit</span>
      {' '}|{' '}
      <span className="text-purple-400">PVPSIT CSE</span>
    </motion.p>

    {/* Batch tag */}
    <motion.p
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.6, duration: 0.8 }}
      className="text-slate-600 text-xs mt-3"
    >
      CSE 2022–2026 · Always in our hearts 🎓
    </motion.p>
  </motion.footer>
);

export default Footer;

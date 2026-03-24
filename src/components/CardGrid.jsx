import { motion } from 'framer-motion';

const cards = [
  {
    id: 'memories-video',
    emoji: '🎥',
    title: 'Memories Video',
    description: 'Relive every laugh, every tear, every milestone of our incredible journey.',
    button: 'Watch Now',
    gradient: 'from-violet-600/30 to-purple-800/20',
    glow: 'rgba(139, 92, 246, 0.4)',
    accentColor: '#c084fc',
    href: '#',
  },
  {
    id: 'photo-gallery',
    emoji: '📸',
    title: 'Photo Gallery',
    description: 'Every candid shot, every posed photo — all our batch moments captured forever.',
    button: 'View Photos',
    gradient: 'from-blue-600/30 to-cyan-800/20',
    glow: 'rgba(59, 130, 246, 0.4)',
    accentColor: '#60a5fa',
    href: '#',
    isGallery: true,
  },


  {
    id: 'class-details',
    emoji: '📋',
    title: 'Class Details',
    description: 'The full CSE-1 roll — 71 batchmates who shared every lecture, lab, and memory.',
    button: 'View Roll',
    gradient: 'from-amber-600/30 to-orange-800/20',
    glow: 'rgba(245, 158, 11, 0.4)',
    accentColor: '#fbbf24',
    href: '#',
    isClassDetails: true,
  },
  {
    id: 'group-photo',
    emoji: '🤝',
    title: 'Group Photo',
    description: 'Our entire CSE batch, together in one frame — a moment frozen in time forever.',
    button: 'View Photo',
    gradient: 'from-red-600/30 to-fuchsia-800/20',
    glow: 'rgba(239, 68, 68, 0.4)',
    accentColor: '#f87171',
    href: '/class-photo.jpg',
    isPhoto: true,
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const Card = ({ card, index, onOpenPhoto, onOpenGallery, onOpenClassDetails }) => (
  <motion.article
    id={card.id}
    custom={index}
    variants={cardVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
    whileHover={{ y: -8, scale: 1.03 }}
    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    className={`glass-card p-6 sm:p-7 flex flex-col gap-4 cursor-pointer bg-gradient-to-br ${card.gradient}`}
    style={{ '--glow-color': card.glow }}
  >
    {/* Emoji + Title */}
    <div className="flex items-start gap-3">
      <motion.span
        animate={{ rotate: [0, -8, 8, 0] }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
        className="text-4xl select-none"
        role="img"
        aria-label={card.title}
      >
        {card.emoji}
      </motion.span>
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-white">{card.title}</h2>
        <div
          className="h-0.5 mt-1 w-10 rounded-full"
          style={{ background: card.accentColor }}
        />
      </div>
    </div>

    {/* Description */}
    <p className="text-sm sm:text-base leading-relaxed flex-1" style={{ color: 'rgba(203, 213, 225, 0.75)' }}>
      {card.description}
    </p>

    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className="glow-btn relative z-10 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white select-none"
      aria-label={`${card.button} - ${card.title}`}
      onClick={
        card.isPhoto ? onOpenPhoto
          : card.isGallery ? onOpenGallery
            : card.isClassDetails ? onOpenClassDetails
              : undefined
      }
    >
      <span className="relative z-10">{card.button}</span>
      <motion.span
        animate={{ x: [0, 4, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="relative z-10 text-xs"
      >
        →
      </motion.span>
    </motion.button>
  </motion.article>
);

const CardGrid = ({ onOpenPhoto, onOpenGallery, onOpenClassDetails }) => (
  <section className="relative z-10 px-4 sm:px-8 pb-24 max-w-3xl mx-auto">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="text-center mb-12"
    >
      <h2 className="text-3xl sm:text-4xl font-bold gradient-text mb-3">Your Memory Capsule</h2>
      <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
        Four years compressed into four moments. Click to relive them.
      </p>
    </motion.div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
      {cards.map((card, i) => (
        <Card key={card.id} card={card} index={i} onOpenPhoto={onOpenPhoto} onOpenGallery={onOpenGallery} onOpenClassDetails={onOpenClassDetails} />
      ))}
    </div>
  </section>
);

export default CardGrid;

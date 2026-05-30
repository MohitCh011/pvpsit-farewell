import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const THEMES = [
  { id: 'purple', name: 'Purple Glow', gradient: 'from-fuchsia-600/20 to-purple-800/10', border: 'rgba(168,85,247,0.4)', glow: 'rgba(168,85,247,0.15)', badgeColor: '#c084fc' },
  { id: 'sunset', name: 'Sunset Aura', gradient: 'from-amber-600/20 to-rose-800/10', border: 'rgba(244,63,94,0.4)', glow: 'rgba(244,63,94,0.15)', badgeColor: '#fb7185' },
  { id: 'emerald', name: 'Emerald Breeze', gradient: 'from-emerald-600/20 to-teal-800/10', border: 'rgba(16,185,129,0.4)', glow: 'rgba(16,185,129,0.15)', badgeColor: '#34d399' },
  { id: 'cyan', name: 'Electric Cyan', gradient: 'from-cyan-600/20 to-blue-800/10', border: 'rgba(6,182,212,0.4)', glow: 'rgba(6,182,212,0.15)', badgeColor: '#22d3ee' }
];

const MemoryWall = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [writeOpen, setWriteOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('purple');
  const [submitting, setSubmitting] = useState(false);

  // Fetch messages from backend
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/messages');
      if (!res.ok) throw new Error('Failed to fetch messages');
      const data = await res.json();
      setMessages(data);
      setIsOffline(false);
    } catch (err) {
      console.warn('Backend offline, using local storage/fallback for messages:', err);
      // Retrieve from localStorage if offline
      const stored = localStorage.getItem('offline_messages');
      if (stored) {
        setMessages(JSON.parse(stored));
      } else {
        // Default initial fallbacks
        setMessages([
          { id: '1', name: 'Harish K', message: 'Remember the lab sessions where we spent 90% of our time debugging semicolons and 10% coding? Best days ever! 💻', theme: 'purple', timestamp: Date.now() - 3600000 },
          { id: '2', name: 'Naimisha A', message: 'CSE-1 batch was something else. From proxy attendances to mass bunks, we lived it all. Cheers to 2022-2026! 🥂🎓', theme: 'sunset', timestamp: Date.now() - 7200000 }
        ]);
      }
      setIsOffline(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
    }
  }, [isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const showToast = (text, isError = false) => {
    setToastMessage({ text, isError });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCreateMessage = async (e) => {
    e.preventDefault();
    if (!formName.trim() || !formMessage.trim()) {
      showToast('Name and message are required!', true);
      return;
    }

    setSubmitting(true);
    const payload = {
      name: formName.trim(),
      message: formMessage.trim(),
      theme: selectedTheme
    };

    try {
      if (isOffline) {
        // Save locally in offline mode
        const newMsg = {
          id: Date.now().toString(),
          ...payload,
          timestamp: Date.now()
        };
        const updated = [newMsg, ...messages];
        setMessages(updated);
        localStorage.setItem('offline_messages', JSON.stringify(updated));
        showToast('Note added locally (Offline mode)');
        setWriteOpen(false);
        setFormName('');
        setFormMessage('');
      } else {
        const res = await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Failed to post message');
        const newMsg = await res.json();
        setMessages([newMsg, ...messages]);
        showToast('Successfully left a memory note!');
        setWriteOpen(false);
        setFormName('');
        setFormMessage('');
      }
    } catch (err) {
      console.error(err);
      showToast(`Error saving message: ${err.message}`, true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMessage = async (id, name) => {
    try {
      if (isOffline) {
        const updated = messages.filter(m => m.id !== id);
        setMessages(updated);
        localStorage.setItem('offline_messages', JSON.stringify(updated));
        showToast(`Removed note from ${name} (Offline mode)`);
      } else {
        const res = await fetch(`/api/messages/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete message');
        setMessages(messages.filter(m => m.id !== id));
        showToast(`Deleted note from ${name}`);
      }
    } catch (err) {
      console.error(err);
      showToast(`Failed to delete message: ${err.message}`, true);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="memory-wall"
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
                style={{ background: 'linear-gradient(135deg,#c084fc,#818cf8,#38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                💬 CSE-1 Digital Yearbook
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Leave a memory or farewell message</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setWriteOpen(true)}
              className="px-4 py-2 rounded-full text-xs font-semibold text-white flex items-center gap-1.5"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #db2777)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              <span>✍️ Write Note</span>
            </motion.button>
          </motion.div>

          {/* MAIN CHAT AREA */}
          <div className="flex-1 overflow-y-auto px-4 py-6 relative scrollbar-thin">
            <div className="max-w-4xl mx-auto">
              
              {/* Warning Banner */}
              {isOffline && (
                <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 px-4 py-2.5 rounded-xl text-xs flex items-center justify-between mb-6">
                  <span>⚠️ Backend server offline. Messages are saving locally to your device.</span>
                  <button onClick={fetchMessages} className="underline hover:text-white font-bold ml-2">Connect Server</button>
                </div>
              )}

              {/* Roster display */}
              {loading ? (
                <div className="text-center text-slate-500 py-24 text-sm flex flex-col items-center gap-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
                  Loading yearbook memories...
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-slate-500 py-24 text-sm">
                  <p className="text-4xl mb-3">📭</p>
                  <p className="text-base font-semibold text-slate-400">Yearbook is empty</p>
                  <p className="text-xs text-slate-600 mt-1">Be the first one to leave a nostalgic note!</p>
                </div>
              ) : (
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
                >
                  <AnimatePresence mode="popLayout">
                    {messages.map((msg) => {
                      const theme = THEMES.find(t => t.id === msg.theme) || THEMES[0];
                      return (
                        <motion.div
                          key={msg.id}
                          layout
                          initial={{ opacity: 0, scale: 0.9, y: 15 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8, y: -15 }}
                          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                          className={`p-5 rounded-2xl border flex flex-col justify-between relative bg-gradient-to-br ${theme.gradient}`}
                          style={{
                            borderColor: theme.border,
                            boxShadow: `0 8px 30px -5px ${theme.glow}`,
                          }}
                        >
                          {/* Close/Delete Action */}
                          <button
                            onClick={() => handleDeleteMessage(msg.id, msg.name)}
                            className="absolute top-3 right-3 text-slate-500 hover:text-red-400 text-xs w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors"
                            title="Delete note"
                          >
                            ✕
                          </button>

                          {/* Message Body */}
                          <div className="mb-4">
                            <span className="text-2xl opacity-20 block absolute top-2 left-3 select-none">“</span>
                            <p className="text-sm text-slate-200 leading-relaxed relative z-10 break-words pt-2 italic">
                              {msg.message}
                            </p>
                          </div>

                          {/* Signature & Time */}
                          <div className="flex items-center justify-between border-t pt-3 mt-auto" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-white tracking-wide">{msg.name}</span>
                              <span className="text-[10px] text-slate-500">
                                {new Date(msg.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <span
                              className="text-[9px] font-bold px-2 py-0.5 rounded-full select-none"
                              style={{ background: `${theme.badgeColor}20`, color: theme.badgeColor }}
                            >
                              {theme.name.split(' ')[0]}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </div>

          {/* WRITE NOTE DRAWER/MODAL */}
          <AnimatePresence>
            {writeOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0.94, y: 15 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.94, y: 15 }}
                  className="w-full max-w-md rounded-2xl p-6 border shadow-2xl relative text-left"
                  style={{
                    background: '#090126',
                    borderColor: 'rgba(139,92,246,0.35)',
                    boxShadow: '0 0 35px rgba(139,92,246,0.25)'
                  }}
                >
                  <button
                    onClick={() => setWriteOpen(false)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors"
                  >
                    ✕
                  </button>

                  <h3 className="text-lg font-bold text-white mb-1">Sign the Yearbook</h3>
                  <p className="text-xs text-slate-400 mb-4">Leave a funny quote, class memory, or generic farewell note.</p>

                  <form onSubmit={handleCreateMessage} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-purple-300 mb-1.5">Your Name / Nickname</label>
                      <input
                        type="text"
                        value={formName}
                        onChange={e => setFormName(e.target.value)}
                        placeholder="e.g., Harish K, CSE Student"
                        maxLength={30}
                        required
                        className="w-full px-3 py-2 rounded-xl text-sm bg-white/5 text-white outline-none border border-white/10 focus:border-purple-500/50 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-purple-300 mb-1.5">Your Message</label>
                      <textarea
                        value={formMessage}
                        onChange={e => setFormMessage(e.target.value)}
                        placeholder="Type your memories, best wishes, or confessions here..."
                        maxLength={240}
                        required
                        rows={4}
                        className="w-full px-3 py-2 rounded-xl text-sm bg-white/5 text-white outline-none border border-white/10 focus:border-purple-500/50 transition-colors resize-none scrollbar-thin"
                      />
                      <p className="text-[10px] text-slate-500 text-right mt-1">{formMessage.length}/240 characters</p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-purple-300 mb-2">Card Aura Style</label>
                      <div className="grid grid-cols-4 gap-2">
                        {THEMES.map(theme => (
                          <button
                            key={theme.id}
                            type="button"
                            onClick={() => setSelectedTheme(theme.id)}
                            className="p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5"
                            style={{
                              background: selectedTheme === theme.id ? 'rgba(255,255,255,0.06)' : 'transparent',
                              borderColor: selectedTheme === theme.id ? theme.badgeColor : 'rgba(255,255,255,0.08)',
                            }}
                          >
                            <span className="w-4 h-4 rounded-full bg-gradient-to-br" style={{ background: `linear-gradient(135deg, ${theme.badgeColor}, transparent)` }}></span>
                            <span className="text-[9px] text-slate-400 font-medium whitespace-nowrap">{theme.name.split(' ')[0]}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setWriteOpen(false)}
                        className="px-4 py-2 text-sm font-semibold rounded-xl text-slate-400 hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-5 py-2 rounded-xl text-sm font-bold text-white flex items-center justify-center transition-transform hover:scale-[1.03]"
                        style={{
                          background: 'linear-gradient(135deg, #7c3aed, #db2777)',
                          opacity: submitting ? 0.6 : 1
                        }}
                      >
                        {submitting ? 'Posting...' : 'Post Message 🚀'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toast Alert */}
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MemoryWall;

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BsSun, BsMoon, BsSend, BsRocket } from 'react-icons/bs';
import { FiLoader } from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => uuidv4());
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('https://dsa-agent.onrender.com/api/chat', {
        question: input,
        sessionId
      });
      
      setMessages(prev => [...prev, { role: 'bot', text: res.data.answer }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: 'Sorry, something went wrong. Please try again.' 
      }]);
    }
    setLoading(false);
  };

  return (
    <div className={`${darkMode ? 'dark' : ''} h-screen transition-colors duration-300`}>
      <div className="h-full bg-theme relative overflow-hidden">
        
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <motion.div
            animate={{
              background: [
                'radial-gradient(circle at 20% 50%, var(--primary) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 50%, var(--primary) 0%, transparent 50%)',
                'radial-gradient(circle at 20% 50%, var(--primary) 0%, transparent 50%)',
              ],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="w-full h-full"
          />
        </div>

        {/* Header */}
        <motion.header 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="bg-card shadow-lg relative z-10"
        >
          <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-bold bg-gradient-to-r from-sky-500 to-blue-600 dark:from-sky-400 dark:to-blue-400 bg-clip-text text-transparent"
            >
              DSA Assistant
            </motion.h1>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-primary/10 transition-colors"
              style={{ color: 'var(--primary)' }}
            >
              {darkMode ? <BsSun size={24} /> : <BsMoon size={24} />}
            </motion.button>
          </div>
        </motion.header>

        <AnimatePresence mode="wait">
          {showWelcome ? (
            // Welcome Screen
            <motion.div
              key="welcome"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center h-[calc(100vh-80px)] px-4 relative z-10"
            >
              <div className="max-w-2xl w-full">
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-card rounded-3xl shadow-2xl p-8 md:p-12 text-center"
                >
                  {/* Animated Icon */}
                  <motion.div
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="inline-block mb-6"
                  >
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center">
                      <BsRocket className="text-white text-4xl" />
                    </div>
                  </motion.div>

                  {/* Welcome Title */}
                  <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl md:text-5xl font-bold text-theme mb-4"
                  >
                    Welcome to DSA Agent! 👋
                  </motion.h2>

                  {/* Description */}
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg text-secondary mb-6 leading-relaxed"
                  >
                    Your intelligent assistant for <span className="font-semibold" style={{ color: 'var(--primary)' }}>Data Structures & Algorithms</span>. 
                    Ask questions, solve problems, and master DSA concepts with ease!
                  </motion.p>

                  {/* Features */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="grid md:grid-cols-3 gap-4 mb-8"
                  >
                    {[
                      { icon: '🧠', text: 'Smart Answers' },
                      { icon: '⚡', text: 'Instant Response' },
                      { icon: '📚', text: 'DSA Focused' }
                    ].map((feature, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="bg-theme rounded-xl p-4 shadow-md"
                      >
                        <div className="text-3xl mb-2">{feature.icon}</div>
                        <div className="text-sm font-medium text-theme">{feature.text}</div>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* CTA Button */}
                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowWelcome(false)}
                    className="bg-primary text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all"
                  >
                    Start Asking Questions 🚀
                  </motion.button>

                  {/* Footer Note */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-xs text-secondary mt-6"
                  >
                    Created by <span className="font-semibold">Abhijeet Singh Rawat</span> using RAG, Pinecone & LangChain
                  </motion.p>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            // Chat Screen
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col px-4 py-6 relative z-10"
            >
              {/* Messages */}
              <div className="flex-1 overflow-y-auto scrollbar-hide space-y-4 mb-4">
                <AnimatePresence>
                  {messages.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center mt-20"
                    >
                      <h2 className="text-2xl font-bold text-theme mb-2">
                        Let's get started! 💡
                      </h2>
                      <p className="text-secondary">
                        Type your DSA question below...
                      </p>
                    </motion.div>
                  )}
                  
                  {messages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: msg.role === 'user' ? 50 : -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-md ${
                          msg.role === 'user'
                            ? 'bg-primary text-white'
                            : 'bg-card text-theme'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-card px-4 py-3 rounded-2xl shadow-md">
                      <FiLoader className="animate-spin" style={{ color: 'var(--primary)' }} size={20} />
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <motion.form
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                onSubmit={sendMessage}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about DSA..."
                  className="flex-1 px-4 py-3 rounded-full bg-card text-theme border-2 border-transparent focus:outline-none transition-all shadow-md"
                  style={{ 
                    '--tw-ring-color': 'var(--primary)',
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'transparent'}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="px-6 py-3 rounded-full bg-primary text-white font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <BsSend size={20} />
                </motion.button>
              </motion.form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;

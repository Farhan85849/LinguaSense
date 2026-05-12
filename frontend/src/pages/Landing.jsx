import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Brain, Zap, Shield, Globe, BarChart3, ChevronDown, Star, Check, ArrowRight, Sparkles } from 'lucide-react'
import { useState, useRef } from 'react'

const features = [
  { icon: Globe, title: 'Multilingual Detection', desc: 'Detect English, Urdu, Roman Urdu, Hindi, Arabic, French and more with high accuracy.', color: 'from-indigo-500 to-purple-500' },
  { icon: Zap, title: 'Real-Time Analysis', desc: 'Instant word-level language tagging as you type. Zero latency AI processing.', color: 'from-cyan-500 to-blue-500' },
  { icon: Brain, title: 'Code-Mixed Detection', desc: 'Specialized in Roman Urdu and code-switched text common in South Asian social media.', color: 'from-purple-500 to-pink-500' },
  { icon: Shield, title: 'Toxicity Detection', desc: 'Identify offensive language and toxic content with word-level highlighting.', color: 'from-red-500 to-orange-500' },
  { icon: BarChart3, title: 'Sentiment Analysis', desc: 'Understand emotional tone — positive, negative, or neutral across languages.', color: 'from-green-500 to-teal-500' },
  { icon: Sparkles, title: 'Analytics Dashboard', desc: 'Track your analysis history, language trends, and sentiment patterns over time.', color: 'from-yellow-500 to-orange-500' },
]

const pricing = [
  { name: 'Free', price: '0', features: ['100 analyses/month', 'Basic language detection', 'Sentiment analysis', 'History (7 days)'], cta: 'Get Started', highlight: false },
  { name: 'Pro', price: '9', features: ['Unlimited analyses', 'Word-level detection', 'Toxicity detection', 'Export CSV/PDF', 'History (unlimited)', 'Priority support'], cta: 'Start Free Trial', highlight: true },
  { name: 'Enterprise', price: '29', features: ['Everything in Pro', 'API access', 'Custom models', 'Team dashboard', 'SLA guarantee', 'Dedicated support'], cta: 'Contact Sales', highlight: false },
]

const testimonials = [
  { name: 'Ayesha Khan', role: 'NLP Researcher, LUMS', text: 'LinguaSense is the only tool that accurately detects Roman Urdu in code-mixed social media text. Incredible accuracy!', rating: 5 },
  { name: 'Ahmed Raza', role: 'Software Engineer, Karachi', text: 'Finally a tool that understands how we actually write in Pakistan. The word-level detection is mind-blowing.', rating: 5 },
  { name: 'Sara Malik', role: 'Data Scientist, Lahore', text: 'Used it for my FYP on social media analysis. The toxicity detection saved me weeks of manual labeling.', rating: 5 },
]

const faqs = [
  { q: 'What is Roman Urdu?', a: 'Roman Urdu is Urdu written using Latin/English script, commonly used in Pakistani social media, WhatsApp, and SMS messages.' },
  { q: 'How accurate is the language detection?', a: 'Our models achieve 90%+ accuracy on standard languages and 85%+ on code-mixed Roman Urdu text using TF-IDF and ML classifiers.' },
  { q: 'Can it detect mixed language in a single sentence?', a: 'Yes! Our word-level detection identifies the language of each individual word, perfect for code-switched text.' },
  { q: 'Is my data private?', a: 'All analyses are tied to your account only. We never share or sell your data. You can delete your history anytime.' },
]

function FloatingOrb({ className }) {
  return <div className={`absolute rounded-full blur-3xl opacity-20 pointer-events-none ${className}`} />
}

export default function Landing() {
  const [openFaq, setOpenFaq] = useState(null)
  const heroRef = useRef(null)

  const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }

  return (
    <div className="min-h-screen bg-[#030712] overflow-x-hidden">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <Brain size={16} className="text-white" />
            </div>
            <span className="font-bold text-white">LinguaSense <span className="gradient-text">AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-slate-400 hover:text-white transition-colors px-4 py-2">Sign In</Link>
            <Link to="/signup" className="text-sm gradient-bg text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity">
              Get Started
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        <FloatingOrb className="w-96 h-96 bg-indigo-600 top-20 -left-48" />
        <FloatingOrb className="w-80 h-80 bg-purple-600 top-40 -right-40" />
        <FloatingOrb className="w-64 h-64 bg-cyan-600 bottom-20 left-1/3" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-indigo-400 mb-8 glow-sm"
          >
            <Sparkles size={14} />
            <span>AI-Powered Roman Urdu & Code-Mixed Detection</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}
            className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight"
          >
            Understand Every
            <br />
            <span className="gradient-text text-glow">Language You Write</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Smart multilingual AI that detects Roman Urdu, code-mixed text, sentiment, and toxicity — built for South Asian digital communication.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/signup"
              className="inline-flex items-center gap-2 gradient-bg text-white px-8 py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-all glow pulse-glow"
            >
              Start Analyzing Free <ArrowRight size={20} />
            </Link>
            <Link to="/login"
              className="inline-flex items-center gap-2 glass text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all"
            >
              Sign In
            </Link>
          </motion.div>

          {/* Demo preview */}
          <motion.div
            initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-20 glass-card rounded-2xl p-6 glow max-w-3xl mx-auto"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-2 text-xs text-slate-500">LinguaSense AI Workspace</span>
            </div>
            <div className="text-left space-y-3">
              <p className="text-slate-400 text-sm">Input: <span className="text-white">"Kal assignment submit karna hai, deadline is tomorrow"</span></p>
              <div className="flex flex-wrap gap-2">
                {[['Kal','Roman Urdu','indigo'],['assignment','English','cyan'],['submit','English','cyan'],['karna','Roman Urdu','indigo'],['hai','Roman Urdu','indigo'],['deadline','English','cyan'],['is','English','cyan'],['tomorrow','English','cyan']].map(([word, lang, color]) => (
                  <span key={word} className={`px-2 py-1 rounded-lg text-xs font-medium bg-${color}-500/20 text-${color}-400 border border-${color}-500/30`}>
                    {word} <span className="opacity-60">· {lang}</span>
                  </span>
                ))}
              </div>
              <div className="flex gap-4 pt-2 border-t border-white/5">
                <span className="text-xs text-slate-400">🌐 Code-Mixed</span>
                <span className="text-xs text-green-400">😊 Positive</span>
                <span className="text-xs text-slate-400">🛡 Toxicity: 0%</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-32 relative">
        <FloatingOrb className="w-96 h-96 bg-purple-600 top-0 right-0" />
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center mb-16"
          >
            <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">Features</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Everything You Need</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Powerful AI tools designed for multilingual text analysis in South Asian languages.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.1 } } }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="glass-card rounded-2xl p-6 cursor-default"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4`}>
                  <f.icon size={22} className="text-white" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32 relative">
        <FloatingOrb className="w-80 h-80 bg-cyan-600 bottom-0 left-0" />
        <div className="max-w-6xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">Pricing</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Simple, Transparent Pricing</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricing.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.15 } } }}
                whileHover={{ y: -8 }}
                className={`rounded-2xl p-8 relative ${plan.highlight ? 'glow-border' : 'glass-card'}`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-bg text-white text-xs font-bold px-4 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="text-white font-bold text-xl mb-2">{plan.name}</h3>
                <div className="flex items-end gap-1 mb-6">
                  <span className="text-4xl font-black text-white">${plan.price}</span>
                  <span className="text-slate-400 mb-1">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                      <Check size={15} className="text-indigo-400 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Link to="/signup"
                  className={`block text-center py-3 rounded-xl font-semibold text-sm transition-all ${
                    plan.highlight ? 'gradient-bg text-white hover:opacity-90 glow-sm' : 'glass text-white hover:bg-white/10'
                  }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">Testimonials</p>
            <h2 className="text-4xl font-black text-white">Loved by Researchers & Developers</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.1 } } }}
                className="glass-card rounded-2xl p-6"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => <Star key={j} size={14} className="text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-slate-500 text-xs">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-32">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">FAQ</p>
            <h2 className="text-4xl font-black text-white">Frequently Asked Questions</h2>
          </motion.div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: i * 0.1 } } }}
                className="glass-card rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="text-white font-medium">{faq.q}</span>
                  <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={18} className="text-slate-400" />
                  </motion.div>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: openFaq === i ? 'auto' : 0, opacity: openFaq === i ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="glass-card rounded-3xl p-16 glow-border"
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Start Analyzing <span className="gradient-text">Today</span>
            </h2>
            <p className="text-slate-400 text-lg mb-8">Join thousands of researchers and developers using LinguaSense AI.</p>
            <Link to="/signup"
              className="inline-flex items-center gap-2 gradient-bg text-white px-10 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all glow"
            >
              Get Started Free <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md gradient-bg flex items-center justify-center">
              <Brain size={12} className="text-white" />
            </div>
            <span className="text-slate-400 text-sm">LinguaSense AI © 2024</span>
          </div>
          <p className="text-slate-600 text-xs">Smart Multilingual Language Detection for Roman Urdu & Code-Mixed Text</p>
        </div>
      </footer>
    </div>
  )
}

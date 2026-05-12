import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Zap, AlertTriangle, Smile, Globe, Code2, Trash2, Copy, Loader2 } from 'lucide-react'
import api from '../../lib/api'
import toast from 'react-hot-toast'

const COLORS = ['#6366f1', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b']
const SAMPLE_TEXTS = [
  "Kal assignment submit karna hai, deadline is tomorrow morning",
  "Yaar yeh project bahut difficult hai, I need help",
  "Aaj bahut tired hoon, let's meet tomorrow for chai",
  "Main office ja raha hoon, meeting at 3pm hai",
]

function WordTag({ word, language }) {
  const colors = {
    'English': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    'Roman Urdu': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    'Urdu': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'Hindi': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    'Arabic': 'bg-green-500/20 text-green-400 border-green-500/30',
    'Unknown': 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  }
  const cls = colors[language] || colors['Unknown']
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-sm font-medium border ${cls} mr-2 mb-2`}
    >
      {word}
      <span className="text-xs opacity-60 font-normal">· {language}</span>
    </motion.span>
  )
}

function ScoreBar({ label, value, color }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-400">{label}</span>
        <span className="text-white font-medium">{(value * 100).toFixed(0)}%</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }} animate={{ width: `${value * 100}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  )
}

export default function Workspace() {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef(null)

  const analyze = useCallback(async (inputText) => {
    if (!inputText.trim() || inputText.trim().length < 3) { setResult(null); return }
    setLoading(true)
    try {
      const { data } = await api.post('/analysis/analyze', { text: inputText })
      setResult(data)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Analysis failed')
    } finally {
      setLoading(false)
    }
  }, [])

  const handleChange = (e) => {
    const val = e.target.value
    setText(val)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => analyze(val), 600)
  }

  const handleSample = (sample) => {
    setText(sample)
    analyze(sample)
  }

  const sentimentConfig = {
    Positive: { color: 'text-green-400', bg: 'bg-green-500/20', icon: '😊' },
    Negative: { color: 'text-red-400', bg: 'bg-red-500/20', icon: '😞' },
    Neutral: { color: 'text-yellow-400', bg: 'bg-yellow-500/20', icon: '😐' },
  }

  const langDistData = result ? Object.entries(result.language_distribution).map(([name, value]) => ({ name, value })) : []

  return (
    <div className="p-8 max-w-7xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-black text-white mb-1">AI <span className="gradient-text">Workspace</span></h1>
        <p className="text-slate-400">Real-time multilingual text analysis with word-level detection</p>
      </motion.div>

      {/* Sample texts */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-xs text-slate-500 self-center">Try:</span>
        {SAMPLE_TEXTS.map((s, i) => (
          <button key={i} onClick={() => handleSample(s)}
            className="text-xs px-3 py-1.5 glass rounded-lg text-slate-400 hover:text-white hover:border-indigo-500/50 transition-all truncate max-w-xs">
            {s.substring(0, 40)}...
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Input */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold flex items-center gap-2"><Zap size={16} className="text-indigo-400" /> Input Text</h3>
            <div className="flex gap-2">
              {text && (
                <>
                  <button onClick={() => { navigator.clipboard.writeText(text); toast.success('Copied!') }}
                    className="p-1.5 text-slate-500 hover:text-white transition-colors"><Copy size={14} /></button>
                  <button onClick={() => { setText(''); setResult(null) }}
                    className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                </>
              )}
              {loading && <Loader2 size={16} className="text-indigo-400 animate-spin" />}
            </div>
          </div>
          <textarea
            value={text}
            onChange={handleChange}
            placeholder="Type or paste text here... Roman Urdu, English, mixed — anything!"
            className="w-full h-48 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors text-sm resize-none leading-relaxed"
          />
          <div className="flex justify-between mt-2">
            <span className="text-xs text-slate-600">{text.length} characters · {text.trim() ? text.trim().split(/\s+/).length : 0} words</span>
            <span className="text-xs text-slate-600">Auto-analyzes as you type</span>
          </div>
        </motion.div>

        {/* Results */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {!result && !loading && (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="glass-card rounded-2xl p-12 text-center">
                <Brain size={40} className="text-slate-600 mx-auto mb-3" />
                <p className="text-slate-500">Start typing to see AI analysis</p>
              </motion.div>
            )}

            {result && (
              <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {/* Language + Sentiment */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-card rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe size={14} className="text-indigo-400" />
                      <span className="text-xs text-slate-400">Detected Language</span>
                    </div>
                    <p className="text-white font-bold text-lg">{result.detected_language}</p>
                    <p className="text-xs text-slate-500 mt-1">Confidence: {(result.confidence * 100).toFixed(0)}%</p>
                    {result.is_code_mixed && (
                      <span className="inline-flex items-center gap-1 mt-2 text-xs px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded-full">
                        <Code2 size={10} /> Code-Mixed
                      </span>
                    )}
                  </div>
                  <div className={`glass-card rounded-2xl p-4 ${sentimentConfig[result.sentiment]?.bg || 'bg-slate-500/20'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Smile size={14} className="text-slate-400" />
                      <span className="text-xs text-slate-400">Sentiment</span>
                    </div>
                    <p className={`font-bold text-lg ${sentimentConfig[result.sentiment]?.color || 'text-white'}`}>
                      {sentimentConfig[result.sentiment]?.icon} {result.sentiment}
                    </p>
                    <ScoreBar label="" value={result.sentiment_score} color={result.sentiment === 'Positive' ? 'bg-green-500' : result.sentiment === 'Negative' ? 'bg-red-500' : 'bg-yellow-500'} />
                  </div>
                </div>

                {/* Toxicity */}
                <div className={`glass-card rounded-2xl p-4 ${result.toxicity_score > 0.3 ? 'border-red-500/30' : ''}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle size={14} className={result.toxicity_score > 0.3 ? 'text-red-400' : 'text-slate-400'} />
                    <span className="text-sm text-white font-medium">Toxicity Analysis</span>
                    <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${result.toxicity_score > 0.3 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                      {result.toxicity_score > 0.3 ? 'Toxic' : 'Clean'}
                    </span>
                  </div>
                  <ScoreBar label="Toxicity Score" value={result.toxicity_score} color={result.toxicity_score > 0.3 ? 'bg-red-500' : 'bg-green-500'} />
                  {result.toxic_words.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {result.toxic_words.map(w => (
                        <span key={w} className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded-lg border border-red-500/30">{w}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Language Distribution */}
                {langDistData.length > 1 && (
                  <div className="glass-card rounded-2xl p-4">
                    <h4 className="text-sm text-white font-medium mb-3">Language Distribution</h4>
                    <div className="flex items-center gap-4">
                      <ResponsiveContainer width="50%" height={100}>
                        <PieChart>
                          <Pie data={langDistData} cx="50%" cy="50%" innerRadius={25} outerRadius={45} paddingAngle={2} dataKey="value">
                            {langDistData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                          </Pie>
                          <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 8, color: '#f1f5f9', fontSize: 11 }} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="flex-1 space-y-1.5">
                        {langDistData.map((d, i) => (
                          <div key={d.name} className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                            <span className="text-xs text-slate-300 flex-1">{d.name}</span>
                            <span className="text-xs text-slate-500">{d.value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Word-level analysis */}
      <AnimatePresence>
        {result?.word_analysis?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mt-6 glass-card rounded-2xl p-6"
          >
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <Code2 size={16} className="text-indigo-400" /> Word-Level Language Detection
            </h3>
            <div className="flex flex-wrap">
              {result.word_analysis.map((w, i) => <WordTag key={i} word={w.word} language={w.language} />)}
            </div>
            {result.translation_suggestion && (
              <p className="mt-4 text-xs text-slate-500 border-t border-white/5 pt-3">
                💡 {result.translation_suggestion}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Brain, Zap, TrendingUp, Shield, Clock, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../lib/api'

const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']

function StatCard({ icon: Icon, label, value, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className="glass-card rounded-2xl p-6"
    >
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-4`}>
        <Icon size={18} className="text-white" />
      </div>
      <p className="text-slate-400 text-sm mb-1">{label}</p>
      <p className="text-2xl font-black text-white">{value}</p>
    </motion.div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/analysis/dashboard')
      .then(r => setStats(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const sentimentData = stats ? Object.entries(stats.sentiment_breakdown).map(([name, value]) => ({ name, value })) : []
  const langData = stats ? Object.entries(stats.language_breakdown).map(([name, value]) => ({ name, value })) : []

  const getSentimentColor = (s) => ({ Positive: 'text-green-400', Negative: 'text-red-400', Neutral: 'text-yellow-400' }[s] || 'text-slate-400')
  const getSentimentBg = (s) => ({ Positive: 'bg-green-500/20', Negative: 'bg-red-500/20', Neutral: 'bg-yellow-500/20' }[s] || 'bg-slate-500/20')

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-black text-white mb-1">
          Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
        </h1>
        <p className="text-slate-400">Here's your language analysis overview</p>
      </motion.div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card rounded-2xl p-6 animate-pulse">
              <div className="w-10 h-10 bg-white/10 rounded-xl mb-4" />
              <div className="h-3 bg-white/10 rounded w-2/3 mb-2" />
              <div className="h-6 bg-white/10 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Brain} label="Total Analyses" value={stats?.total_analyses ?? 0} color="bg-indigo-500/30" delay={0} />
          <StatCard icon={Zap} label="Top Language" value={stats?.most_used_language ?? 'N/A'} color="bg-purple-500/30" delay={0.1} />
          <StatCard icon={TrendingUp} label="Avg Toxicity" value={`${((stats?.avg_toxicity ?? 0) * 100).toFixed(0)}%`} color="bg-cyan-500/30" delay={0.2} />
          <StatCard icon={Shield} label="Sentiments" value={Object.keys(stats?.sentiment_breakdown ?? {}).length} color="bg-green-500/30" delay={0.3} />
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-6">
          <h3 className="text-white font-bold mb-4">Language Distribution</h3>
          {langData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={langData}>
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 8, color: '#f1f5f9' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {langData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-slate-500 text-sm">No data yet. Start analyzing!</div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-2xl p-6">
          <h3 className="text-white font-bold mb-4">Sentiment Breakdown</h3>
          {sentimentData.length > 0 ? (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="60%" height={200}>
                <PieChart>
                  <Pie data={sentimentData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {sentimentData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 8, color: '#f1f5f9' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {sentimentData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-slate-300 text-sm">{d.name}</span>
                    <span className="text-slate-500 text-xs ml-auto">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-slate-500 text-sm">No data yet. Start analyzing!</div>
          )}
        </motion.div>
      </div>

      {/* Recent Analyses */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold">Recent Analyses</h3>
          <Link to="/history" className="text-indigo-400 text-sm hover:text-indigo-300 flex items-center gap-1 transition-colors">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        {stats?.recent_analyses?.length > 0 ? (
          <div className="space-y-3">
            {stats.recent_analyses.map((a) => (
              <div key={a.id} className="flex items-center gap-4 p-3 bg-white/3 rounded-xl hover:bg-white/5 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate">{a.input_text}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{new Date(a.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded-lg">{a.detected_language}</span>
                  <span className={`text-xs px-2 py-1 rounded-lg ${getSentimentBg(a.sentiment)} ${getSentimentColor(a.sentiment)}`}>{a.sentiment}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock size={32} className="text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 text-sm mb-4">No analyses yet</p>
            <Link to="/workspace" className="inline-flex items-center gap-2 gradient-bg text-white px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
              Start Analyzing <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  )
}

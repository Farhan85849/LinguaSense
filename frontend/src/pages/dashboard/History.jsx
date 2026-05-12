import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Download, Trash2, Clock, ChevronLeft, ChevronRight } from 'lucide-react'
import api from '../../lib/api'
import toast from 'react-hot-toast'

const SENTIMENT_STYLES = {
  Positive: 'bg-green-500/20 text-green-400',
  Negative: 'bg-red-500/20 text-red-400',
  Neutral: 'bg-yellow-500/20 text-yellow-400',
}

export default function History() {
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const limit = 10

  const fetchHistory = useCallback(async (q = '') => {
    setLoading(true)
    try {
      const { data } = await api.get('/analysis/history', { params: { skip: page * limit, limit, search: q || undefined } })
      setAnalyses(data)
    } catch { toast.error('Failed to load history') }
    finally { setLoading(false) }
  }, [page])

  useEffect(() => { fetchHistory(search) }, [page])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(0)
    fetchHistory(search)
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/analysis/history/${id}`)
      setAnalyses(prev => prev.filter(a => a.id !== id))
      toast.success('Deleted')
    } catch { toast.error('Delete failed') }
  }

  const handleExportCSV = async () => {
    try {
      const res = await api.get('/analysis/export/csv', { responseType: 'blob' })
      const url = URL.createObjectURL(res.data)
      const a = document.createElement('a')
      a.href = url; a.download = 'linguasense_history.csv'; a.click()
      URL.revokeObjectURL(url)
      toast.success('CSV exported!')
    } catch { toast.error('Export failed') }
  }

  return (
    <div className="p-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-black text-white mb-1">Analysis <span className="gradient-text">History</span></h1>
        <p className="text-slate-400">Browse and search your previous analyses</p>
      </motion.div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search analyses..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
          />
        </form>
        <button onClick={handleExportCSV}
          className="flex items-center gap-2 glass px-4 py-2.5 rounded-xl text-sm text-slate-300 hover:text-white hover:border-indigo-500/50 transition-all">
          <Download size={15} /> Export CSV
        </button>
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : analyses.length === 0 ? (
          <div className="p-16 text-center">
            <Clock size={40} className="text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No analyses found</p>
            <p className="text-slate-600 text-sm mt-1">
              {search ? 'Try a different search term' : 'Start analyzing text in the Workspace'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left text-xs text-slate-500 font-medium px-6 py-3">Text</th>
                    <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">Language</th>
                    <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">Sentiment</th>
                    <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">Toxicity</th>
                    <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">Date</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {analyses.map((a, i) => (
                      <motion.tr
                        key={a.id}
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="border-b border-white/5 hover:bg-white/3 transition-colors"
                      >
                        <td className="px-6 py-4 max-w-xs">
                          <p className="text-white text-sm truncate">{a.input_text}</p>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-xs px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded-lg whitespace-nowrap">{a.detected_language}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`text-xs px-2 py-1 rounded-lg ${SENTIMENT_STYLES[a.sentiment] || 'bg-slate-500/20 text-slate-400'}`}>{a.sentiment}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`text-xs font-medium ${a.toxicity_score > 0.3 ? 'text-red-400' : 'text-green-400'}`}>
                            {(a.toxicity_score * 100).toFixed(0)}%
                          </span>
                        </td>
                        <td className="px-4 py-4 text-xs text-slate-500 whitespace-nowrap">
                          {new Date(a.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4">
                          <button onClick={() => handleDelete(a.id)}
                            className="p-1.5 text-slate-600 hover:text-red-400 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
              <span className="text-xs text-slate-500">Page {page + 1}</span>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                  className="p-1.5 glass rounded-lg text-slate-400 hover:text-white disabled:opacity-30 transition-all">
                  <ChevronLeft size={16} />
                </button>
                <button onClick={() => setPage(p => p + 1)} disabled={analyses.length < limit}
                  className="p-1.5 glass rounded-lg text-slate-400 hover:text-white disabled:opacity-30 transition-all">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}

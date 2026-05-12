import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Brain, Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
    toast.success('Reset instructions sent (demo mode)')
  }

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl top-0 left-0 pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center glow-sm">
              <Brain size={20} className="text-white" />
            </div>
            <span className="font-bold text-white text-xl">LinguaSense <span className="gradient-text">AI</span></span>
          </Link>
          <h1 className="text-3xl font-black text-white mb-2">Reset Password</h1>
          <p className="text-slate-400">Enter your email to receive reset instructions</p>
        </div>

        <div className="glass-card rounded-2xl p-8">
          {sent ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
              <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">Check Your Email</h3>
              <p className="text-slate-400 text-sm mb-6">We've sent reset instructions to <span className="text-white">{email}</span></p>
              <Link to="/login" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors">
                Back to Sign In
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                  />
                </div>
              </div>
              <button type="submit" className="w-full gradient-bg text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity glow-sm">
                Send Reset Link
              </button>
              <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                <ArrowLeft size={14} /> Back to Sign In
              </Link>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  )
}

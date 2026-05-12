import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Lock, Save, Loader2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import api from '../../lib/api'
import toast from 'react-hot-toast'

export default function Settings() {
  const { user, updateUser } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [password, setPassword] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault()
    if (password && password !== confirmPass) return toast.error('Passwords do not match')
    if (password && password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    try {
      const payload = { name }
      if (password) payload.password = password
      const { data } = await api.put('/auth/profile', payload)
      updateUser(data)
      setPassword(''); setConfirmPass('')
      toast.success('Profile updated!')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-black text-white mb-1">Account <span className="gradient-text">Settings</span></h1>
        <p className="text-slate-400">Manage your profile and security</p>
      </motion.div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <User size={16} className="text-indigo-400" /> Profile Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-400 mb-2 block">Full Name</label>
              <input
                value={name} onChange={e => setName(e.target.value)} required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-2 block">Email Address</label>
              <input
                value={user?.email} disabled
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-500 text-sm cursor-not-allowed"
              />
              <p className="text-xs text-slate-600 mt-1">Email cannot be changed</p>
            </div>
          </div>
        </motion.div>

        {/* Password */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-6">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Lock size={16} className="text-indigo-400" /> Change Password
          </h3>
          <div className="space-y-4">
            {[
              { label: 'New Password', value: password, setter: setPassword, placeholder: 'Leave blank to keep current' },
              { label: 'Confirm Password', value: confirmPass, setter: setConfirmPass, placeholder: 'Repeat new password' },
            ].map(({ label, value, setter, placeholder }) => (
              <div key={label}>
                <label className="text-sm text-slate-400 mb-2 block">{label}</label>
                <input
                  type="password" value={value} onChange={e => setter(e.target.value)} placeholder={placeholder}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Account Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-6">
          <h3 className="text-white font-bold mb-4">Account Details</h3>
          <div className="space-y-3">
            {[
              { label: 'Member Since', value: user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A' },
              { label: 'Account ID', value: `#${user?.id}` },
              { label: 'Plan', value: 'Free' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-2 border-b border-white/5 last:border-0">
                <span className="text-slate-400 text-sm">{label}</span>
                <span className="text-white text-sm font-medium">{value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <button
          type="submit" disabled={loading}
          className="flex items-center gap-2 gradient-bg text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 glow-sm"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save Changes
        </button>
      </form>
    </div>
  )
}

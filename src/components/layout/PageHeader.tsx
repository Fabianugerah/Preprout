import { useState, useRef, useEffect } from 'react'
import { Bell, ChevronDown, LogOut, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store'
import toast from 'react-hot-toast'

interface PageHeaderProps {
  rightContent?: React.ReactNode
}

export default function PageHeader({ rightContent }: PageHeaderProps) {
  const user = useAuthStore((s) => s.user)
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleLogout = () => {
    clearAuth()
    toast.success('Logged out successfully')
    navigate('/login')
    setDropdownOpen(false)
  }

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const displayName = (user?.name ?? user?.email ?? 'Admin').toString()
  const initial = displayName.charAt(0).toUpperCase()

  return (
    <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0">
      <div />
      <div className="flex items-center gap-4">
        {/* Bell */}
        <button className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center relative hover:bg-slate-50 transition-all">
          <Bell size={16} className="text-slate-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full" />
        </button>

        {/* Profile dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-2 hover:bg-slate-50 rounded-xl px-2 py-1.5 transition-all"
          >
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center shrink-0 overflow-hidden">
              <img
                src="/assets/avatar.png"
                alt={displayName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const t = e.target as HTMLImageElement
                  t.style.display = 'none'
                  t.nextElementSibling?.classList.remove('hidden')
                }}
              />
              <span className="hidden text-sm font-bold text-primary-700">{initial}</span>
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-semibold text-slate-800 leading-tight">{displayName}</p>
              <p className="text-xs text-slate-400">Admin</p>
            </div>
            <ChevronDown
              size={14}
              className={`text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-xl border border-slate-200 shadow-lg py-1 z-50">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-700 truncate">{displayName}</p>
                <p className="text-xs text-slate-400">Admin</p>
              </div>
              <button
                onClick={() => { }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-all"
              >
                <User size={14} className="text-slate-400" />
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-all"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Optional right slot (e.g. Publish button) */}
        {rightContent}
      </div>
    </div>
  )
}
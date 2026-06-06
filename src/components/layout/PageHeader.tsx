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

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const displayName = (user?.name ?? user?.email ?? 'Alex Wando').toString()

  return (
    <div className="bg-white border-b border-slate-100 h-20 px-8 flex items-center justify-between shrink-0">
      {/* Sisi Kiri (Kosong karena Breadcrumb ditaruh di dalam body halaman) */}
      <div />

      {/* Sisi Kanan (Aksi & Profil) */}
      <div className="flex items-center gap-5">
        {/* Bell Notification Button */}
        <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center relative hover:bg-slate-50 transition-all shadow-sm shadow-slate-100/50">
          <Bell size={18} className="text-slate-600" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-[#22C55E] rounded-full ring-2 ring-white" />
        </button>

        {/* Profile Dropdown Trigger */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-3 hover:bg-slate-50/80 rounded-xl py-1 px-1.5 transition-all text-left"
          >
            {/* Avatar container */}
            <div className="w-10 h-10 rounded-full bg-[#FFEDD5] flex items-center justify-center shrink-0 overflow-hidden border border-orange-100">
              <img
                src="https://ui-avatars.com/api/?name=Alex+Wando&background=FFEDD5&color=C2410C"
                alt={displayName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback jika avatar gagal dimuat
                  const t = e.target as HTMLImageElement
                  t.src = "/assets/avatar.png"
                }}
              />
            </div>

            {/* Nama & Role */}
            <div className="hidden sm:flex flex-col justify-center">
              <p className="text-sm font-bold text-slate-800 leading-none tracking-tight">
                {displayName}
              </p>
              <p className="text-[11px] font-medium text-slate-400 mt-1 leading-none">
                Admin
              </p>
            </div>

            <ChevronDown
              size={15}
              className={`text-slate-400 ml-1 transition-transform duration-200 ${
                dropdownOpen ? 'rotate-180 text-slate-600' : ''
              }`}
            />
          </button>

          {/* Dropdown Menu Overlay */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-slate-200 shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-700 truncate">{displayName}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Admin</p>
              </div>
              <button
                onClick={() => {}}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-all"
              >
                <User size={14} className="text-slate-400" />
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Jika ada tombol aksi tambahan di sebelah kanan profil */}
        {rightContent}
      </div>
    </div>
  )
}
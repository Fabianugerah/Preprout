import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, LogOut, BookOpen, ChevronRight } from 'lucide-react'
import { useAuthStore } from '@/store'
import { cn } from '@/utils'
import toast from 'react-hot-toast'

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, clearAuth } = useAuthStore()

  const handleLogout = () => {
    clearAuth()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const navItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
  ]

  return (
    <div className="min-h-screen flex bg-surface-muted">
      {/* ── Sidebar ── */}
      <aside className="w-60 shrink-0 bg-white border-r border-surface-border flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-surface-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center">
              <BookOpen size={15} className="text-white" />
            </div>
            <span className="font-bold text-slate-900 text-lg tracking-tight">
              Preproute
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group',
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                )}
              >
                <item.icon
                  size={18}
                  className={cn(
                    'shrink-0',
                    isActive ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-600',
                  )}
                />
                {item.label}
                {isActive && (
                  <ChevronRight size={14} className="ml-auto text-primary-400" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* User info + logout */}
        <div className="p-3 border-t border-surface-border">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-primary-700">
                {(user?.name ?? user?.email ?? 'U')
                  .toString()
                  .charAt(0)
                  .toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-700 truncate">
                {user?.name ?? user?.email ?? 'Admin'}
              </p>
              <p className="text-[11px] text-slate-400">Admin</p>
            </div>
            <button
              onClick={handleLogout}
              className="btn-icon text-slate-400 hover:text-red-500 hover:bg-red-50"
              title="Logout"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
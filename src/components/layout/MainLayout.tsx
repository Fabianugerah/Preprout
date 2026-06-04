import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, LogOut, BookOpen, ChevronRight, PenSquare, BarChart2 } from 'lucide-react'
import { useAuthStore } from '@/store'
import { cn } from '@/utils'
import toast from 'react-hot-toast'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, clearAuth } = useAuthStore()

  const handleLogout = () => {
    clearAuth()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/tests', label: 'Test Creation', icon: PenSquare },
    { path: '/tracking', label: 'Test Tracking', icon: BarChart2 },
  ]

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-white border-r border-slate-200 flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center">
              <BookOpen size={15} className="text-white" />
            </div>
            <span className="font-bold text-slate-900 text-lg tracking-tight">
              Prep<span className="text-primary-600">route</span>
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map((item) => {
            const isActive =
              item.path === '/tests'
                ? location.pathname.startsWith('/tests')
                : location.pathname === item.path

            return (
              <Link
                key={item.path}
                to={item.path === '/tracking' ? '/dashboard' : item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
                  isActive
                    ? 'bg-primary-50 text-primary-700 border border-primary-100'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                )}
              >
                <item.icon
                  size={17}
                  className={cn(
                    isActive
                      ? 'text-primary-600'
                      : 'text-slate-400 group-hover:text-slate-600',
                  )}
                />
                {item.label}
                {isActive && (
                  <ChevronRight size={13} className="ml-auto text-primary-400" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* User info + logout */}
        <div className="p-3 border-t border-slate-200">
          <div className="flex items-center gap-3 px-3 py-2">
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
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
              title="Logout"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 overflow-y-auto">{children}</main>
    </div>
  )
}
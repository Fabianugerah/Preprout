import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  PenSquare,
  BarChart2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useUIStore } from '@/store'
import { cn } from '@/utils'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/tests/new', label: 'Test Creation', icon: PenSquare },
  { path: '/tracking', label: 'Test Tracking', icon: BarChart2 },
]

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const { sidebarCollapsed, toggleSidebar } = useUIStore()

  return (
    <div className="min-h-screen flex bg-slate-50 max-w-[1440px] mx-auto">
      {/* ── Sidebar ── */}
      <aside
        className={cn(
          'shrink-0 bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out relative',
          sidebarCollapsed ? 'w-[64px]' : 'w-[220px]',
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center border-b border-slate-200 overflow-hidden px-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src="/assets/icon_preprout.png"
              alt="Preproute"
              className="w-8 h-8 shrink-0 object-contain"
              onError={(e) => {
                const t = e.target as HTMLImageElement
                t.style.display = 'none'
                t.nextElementSibling?.classList.remove('hidden')
              }}
            />
            <div className="w-8 h-8 rounded-xl bg-primary-600 items-center justify-center hidden shrink-0">
              <span className="text-white text-xs font-bold">P</span>
            </div>
            {!sidebarCollapsed && (
              <span className="font-bold text-slate-900 text-base tracking-tight whitespace-nowrap overflow-hidden">
                Prep<span className="text-primary-600">route</span>
              </span>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-hidden">
          {navItems.map((item) => {
            const isActive =
              item.path === '/tests/new'
                ? location.pathname.startsWith('/tests/new')
                : location.pathname === item.path

            return (
              <Link
                key={item.path}
                to={item.path === '/tracking' ? '/dashboard' : item.path}
                title={sidebarCollapsed ? item.label : undefined}
                className={cn(
                  'flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-sm font-medium transition-all group',
                  sidebarCollapsed ? 'justify-center' : '',
                  isActive
                    ? 'bg-primary-50 text-primary-700 border border-primary-100'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900',
                )}
              >
                <item.icon
                  size={18}
                  className={cn(
                    'shrink-0',
                    isActive ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-600',
                  )}
                />
                {!sidebarCollapsed && (
                  <span className="whitespace-nowrap overflow-hidden truncate">
                    {item.label}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Toggle button */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-20 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm hover:bg-slate-50 transition-all z-10"
        >
          {sidebarCollapsed ? (
            <ChevronRight size={12} className="text-slate-500" />
          ) : (
            <ChevronLeft size={12} className="text-slate-500" />
          )}
        </button>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 min-w-0 overflow-y-auto">{children}</main>
    </div>
  )
}
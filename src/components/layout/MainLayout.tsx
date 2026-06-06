import { Link, useLocation } from 'react-router-dom'
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
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* ── Sidebar ── */}
      <aside
        className={cn(
          'shrink-0 bg-white border-r border-slate-200/80 flex flex-col transition-all duration-300 ease-in-out relative z-20',
          sidebarCollapsed ? 'w-[72px]' : 'w-[240px]',
        )}
      >
        {/* Logo Section */}
        <div className="h-20 flex items-center px-6 border-b border-slate-100/50">
          <div className="flex items-center gap-2.5 min-w-0 w-full">
            <img
              src="/assets/icon_preprout.png"
              alt="Preproute"
              className={cn(
                'h-8 object-contain transition-all',
                sidebarCollapsed ? 'mx-auto' : ''
              )}
              onError={(e) => {
                const t = e.target as HTMLImageElement
                t.style.display = 'none'
              }}
            />
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-6 space-y-1.5">
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
                  'flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all group',
                  sidebarCollapsed ? 'justify-center px-0' : '',
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900',
                )}
              >
                <item.icon
                  size={18}
                  className={cn(
                    'shrink-0 transition-colors',
                    isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600',
                  )}
                />
                {!sidebarCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Floating Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-[26px] w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm hover:bg-slate-50 transition-all text-slate-400 hover:text-slate-600"
        >
          {sidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>

      {/* ── Main Content Area ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {children}
      </div>
    </div>
  )
}
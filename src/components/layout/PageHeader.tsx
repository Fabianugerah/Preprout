import { Bell, ChevronDown } from 'lucide-react'
import { useAuthStore } from '@/store'

interface PageHeaderProps {
  rightContent?: React.ReactNode
}

export default function PageHeader({ rightContent }: PageHeaderProps) {
  const user = useAuthStore((s) => s.user)

  return (
    <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0">
      <div />
      <div className="flex items-center gap-4">
        {/* Bell */}
        <div className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center relative cursor-pointer hover:bg-slate-50">
          <Bell size={16} className="text-slate-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full" />
        </div>

        {/* User */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-sm font-bold text-primary-700">
              {(user?.name ?? user?.email ?? 'A')
                .toString()
                .charAt(0)
                .toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 leading-tight">
              {user?.name ?? user?.email ?? 'Admin'}
            </p>
            <p className="text-xs text-slate-400">Admin</p>
          </div>
          <ChevronDown size={14} className="text-slate-400" />
        </div>

        {/* Optional right slot (e.g. Publish button) */}
        {rightContent}
      </div>
    </div>
  )
}
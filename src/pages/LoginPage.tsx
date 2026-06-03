import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { authApi } from '@/api'
import { useAuthStore } from '@/store'
import { loginSchema, type LoginSchema } from '@/lib/schemas'
import { getErrorMessage } from '@/utils'

export default function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginSchema) => {
    setIsLoading(true)
    try {
      const res = await authApi.login(data)
      const { token, user } = res.data.data
      setAuth(token, user)
      toast.success('Login successful!')
      navigate('/dashboard')
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-[#EEF2FF]">

      {/* ── Kiri: Ilustrasi ── */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative p-12">

        {/* Dekorasi + simbol */}
        <span className="absolute top-[28%] left-[22%] text-slate-400 text-xl select-none">+</span>
        <span className="absolute top-[52%] left-[38%] text-slate-400 text-xl select-none">+</span>
        <span className="absolute top-[35%] right-[30%] text-slate-300 text-sm select-none">○</span>

        {/* Ilustrasi karakter hourglass */}
        <svg
          viewBox="0 0 320 380"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-72 h-auto drop-shadow-sm"
        >
          {/* Meja */}
          <rect x="60" y="270" width="200" height="12" rx="3" fill="#64748b" />
          <rect x="80" y="282" width="8" height="60" rx="2" fill="#475569" />
          <rect x="232" y="282" width="8" height="60" rx="2" fill="#475569" />
          <rect x="72" y="338" width="24" height="8" rx="2" fill="#3b82f6" />
          <rect x="224" y="338" width="24" height="8" rx="2" fill="#3b82f6" />

          {/* Laptop */}
          <rect x="95" y="220" width="110" height="52" rx="4" fill="#e2e8f0" />
          <rect x="99" y="224" width="102" height="44" rx="3" fill="#cbd5e1" />
          <rect x="85" y="272" width="130" height="6" rx="3" fill="#94a3b8" />

          {/* Body hourglass */}
          <path d="M148 60 L172 60 L185 130 L160 150 L135 130 Z" fill="#bfdbfe" stroke="#93c5fd" strokeWidth="2"/>
          <path d="M135 130 L160 150 L185 130 L185 220 L135 220 Z" fill="#dbeafe" stroke="#93c5fd" strokeWidth="2"/>

          {/* Cap atas dan bawah */}
          <rect x="138" y="48" width="44" height="14" rx="4" fill="#60a5fa" />
          <rect x="138" y="220" width="44" height="14" rx="4" fill="#60a5fa" />

          {/* Wajah */}
          <circle cx="154" cy="168" r="3" fill="#1e40af" />
          <circle cx="166" cy="168" r="3" fill="#1e40af" />
          <path d="M154 178 Q160 183 166 178" stroke="#1e40af" strokeWidth="2" strokeLinecap="round" fill="none"/>

          {/* Tangan kiri (ke laptop) */}
          <path d="M135 185 Q110 200 105 240" stroke="#93c5fd" strokeWidth="8" strokeLinecap="round" fill="none"/>
          {/* Tangan kanan */}
          <path d="M185 185 Q200 195 195 235" stroke="#93c5fd" strokeWidth="8" strokeLinecap="round" fill="none"/>
        </svg>

        {/* Brand text kiri bawah */}
        <div className="absolute bottom-10 left-12">
          <p className="text-xs text-slate-400 font-medium">Preproute Admin</p>
          <p className="text-xs text-slate-300">Test Management Platform</p>
        </div>
      </div>

      {/* ── Kanan: Form Card ── */}
      <div className="w-full lg:w-[520px] flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-lg border border-slate-100 px-10 py-12">

          {/* Logo */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                    stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-primary-600 tracking-tight">
                Prep<span className="text-slate-800">Route</span>
              </span>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 mb-1">Login</h1>
            <p className="text-sm text-slate-500">
              Use your company provided Login credentials
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* User ID */}
            <div>
              <label className="form-label">User ID</label>
              <input
                {...register('userId')}
                type="text"
                placeholder="Enter User ID"
                autoComplete="username"
                className={`form-input ${errors.userId ? 'form-input-error' : ''}`}
              />
              {errors.userId && (
                <p className="form-error">{errors.userId.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter Password"
                  autoComplete="current-password"
                  className={`form-input pr-11 ${errors.password ? 'form-input-error' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="form-error">{errors.password.message}</p>
              )}
            </div>

            {/* Forgot password */}
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full btn-lg mt-2"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Login'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
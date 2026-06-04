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
      const resolvedToken = typeof token === 'string' ? token : 'dummy-token'
      setAuth(resolvedToken, user)
      toast.success('Login successful!')
      navigate('/dashboard')
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    // ── Frame 1171277994 (Main Root Container) ──
    <div className="min-h-screen w-full flex bg-primary font-sans overflow-hidden">

      {/* ── Component 380/TEST TUBE MAN (Bagian Kiri) ── */}
      <div className="hidden lg:flex flex-1 items-center justify-center gap-[10px]">
        <img
          src="/assets/login.png"
          alt="Test Tube Man Illustration"
          className="w-full max-w-[467px] object-contain"
        />
      </div>

      {/* ── Frame 1171277880 (Container Sisi Kanan) ── */}
      <div className="w-full lg:w-[50%] flex items-center justify-center px-[20px] gap-[10px]">

        {/* Frame 1171277681 (Card with blue border & specific padding) */}
        <div className="w-full max-w-[710px] lg:h-[988px] bg-white border-[0.5px] border-[#60A5FA] rounded-[8px] 
                        flex flex-col justify-center
                        p-8 lg:px-[100px] lg:py-[200px] gap-[10px]">

          {/* Frame 1171277878 (Inner Content Wrapper) */}
          <div className="flex flex-col gap-10">

            {/* Frame 1171277511 (Top Section: Logo & Titles) */}
            <div className="flex flex-col gap-[30px]">

              {/* Frame 1171277511 -> preproute lofo */}
              <div className="flex items-center">
                <img
                  src="/assets/icon_preprout.png"
                  alt="PrepRoute Logo"
                  className="h-10 object-contain"
                />
              </div>

              <div className="flex flex-col gap-[20px]">
                {/* Frame 1171277506 */}
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Login</h1>
                {/* Frame 1171277504 */}
                <p className="text-sm text-slate-400">
                  Use your company provided Login credentials
                </p>
              </div>
            </div>

            {/* Frame 1171277509 (Bottom Section: Interaction) */}
            <div className="w-full">

              {/* buttons -> Frame 1171276580 (Form) */}
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[30px]">

                {/* Input User ID */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">User ID</label>
                  <input
                    {...register('userId')}
                    type="text"
                    placeholder="Enter User ID"
                    className={`w-full px-4 py-3 rounded-lg border text-sm focus:outline-none focus:ring-1 focus:ring-[#5284F8] focus:border-[#5284F8] transition-all placeholder:text-slate-300 ${errors.userId ? 'border-red-500' : 'border-slate-200'
                      }`}
                  />
                  {errors.userId && (
                    <p className="text-xs text-red-500">{errors.userId.message}</p>
                  )}
                </div>

                {/* Input Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Password</label>
                  <div className="relative">
                    <input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter Password"
                      className={`w-full px-4 py-3 rounded-lg border text-sm focus:outline-none focus:ring-1 focus:ring-[#5284F8] focus:border-[#5284F8] transition-all pr-11 placeholder:text-slate-300 ${errors.password ? 'border-red-500' : 'border-slate-200'
                        }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-500">{errors.password.message}</p>
                  )}
                </div>

                {/* Action Link */}
                <div className="">
                  <button type="button" className="text-sm text-[#2F66F6] font-medium">
                    Forgot password?
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#5284F8] hover:bg-[#3d6de0] text-white font-medium py-3 rounded-lg transition-all text-sm disabled:opacity-70"
                >
                  {isLoading ? 'Signing in...' : 'Login'}
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
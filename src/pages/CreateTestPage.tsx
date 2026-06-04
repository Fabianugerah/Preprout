import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronDown, ChevronUp, Bell } from 'lucide-react'
import toast from 'react-hot-toast'
import { subjectsApi, topicsApi, subTopicsApi, testsApi } from '@/api'
import { useAuthStore } from '@/store'
import { useTestCreationStore } from '@/store'
import { testSchema, type TestSchema } from '@/lib/schemas'
import { getErrorMessage } from '@/utils'
import type { Subject, Topic, SubTopic } from '@/types'

const TEST_TYPES = ['Chapter Wise', 'PYQ', 'Mock Test']
const TYPE_VALUES: Record<string, string> = {
  'Chapter Wise': 'practice',
  'PYQ': 'pyq',
  'Mock Test': 'mock',
}

function NumberStepper({
  value,
  onChange,
  min,
}: {
  value: number
  onChange: (v: number) => void
  min?: number
}) {
  return (
    <div className="flex items-center justify-between border border-slate-200 rounded-lg px-3 py-2 bg-white w-28">
      <span className="text-sm font-medium text-slate-700">
        {value > 0 ? `+${value}` : value}
      </span>
      <div className="flex flex-col gap-0.5">
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="text-slate-400 hover:text-slate-600 leading-none"
        >
          <ChevronUp size={13} />
        </button>
        <button
          type="button"
          onClick={() => onChange(min !== undefined ? Math.max(min, value - 1) : value - 1)}
          className="text-slate-400 hover:text-slate-600 leading-none"
        >
          <ChevronDown size={13} />
        </button>
      </div>
    </div>
  )
}

export default function CreateTestPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id
  const user = useAuthStore((s) => s.user)
  const { setCurrentTest, setCurrentTestId } = useTestCreationStore()

  const [activeTab, setActiveTab] = useState('Chapter Wise')
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [subTopics, setSubTopics] = useState<SubTopic[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TestSchema>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      name: '',
      type: 'practice',
      subject: '',
      topics: [],
      sub_topics: [],
      difficulty: 'easy',
      correct_marks: 5,
      wrong_marks: -1,
      unattempt_marks: 0,
      total_time: 0,
      total_marks: 0,
      total_questions: 0,
    },
  })

  const watchSubject = watch('subject')
  const watchTopics = watch('topics')
  const watchCorrect = watch('correct_marks')
  const watchQuestions = watch('total_questions')

  // Auto-calculate total marks
  useEffect(() => {
    const total = (Number(watchCorrect) || 0) * (Number(watchQuestions) || 0)
    setValue('total_marks', total)
  }, [watchCorrect, watchQuestions, setValue])

  // Fetch subjects
  useEffect(() => {
    subjectsApi.getAll().then((res) => {
      setSubjects(res.data.data ?? [])
    })
  }, [])

  // Fetch topics when subject changes
  useEffect(() => {
    if (!watchSubject) return
    setTopics([])
    setSubTopics([])
    setValue('topics', [])
    setValue('sub_topics', [])
    topicsApi.getBySubject(watchSubject).then((res) => {
      setTopics(res.data.data ?? [])
    })
  }, [watchSubject, setValue])

  // Fetch sub-topics when topics change
  useEffect(() => {
    if (!watchTopics?.length) return
    subTopicsApi.getByTopicIds(watchTopics).then((res) => {
      setSubTopics(res.data.data ?? [])
    })
  }, [watchTopics])

  // Load existing test if edit mode
  useEffect(() => {
    if (!isEdit || !id) return
    testsApi.getById(id).then((res) => {
      const t = res.data.data
      setValue('name', t.name)
      setValue('type', t.type ?? 'practice')
      setValue('subject', t.subject_id ?? t.subject ?? '')
      setValue('difficulty', t.difficulty ?? 'easy')
      setValue('correct_marks', t.correct_marks ?? 5)
      setValue('wrong_marks', t.wrong_marks ?? -1)
      setValue('unattempt_marks', t.unattempt_marks ?? 0)
      setValue('total_time', t.total_time ?? 0)
      setValue('total_marks', t.total_marks ?? 0)
      setValue('total_questions', t.total_questions ?? 0)
    })
  }, [isEdit, id, setValue])

  const onSubmit = async (data: TestSchema) => {
    setIsSubmitting(true)
    try {
      let testId = id
      if (isEdit && id) {
        const res = await testsApi.update(id, {
          ...data,
          status: 'draft',
        })
        setCurrentTest(res.data.data)
        testId = id
      } else {
        const res = await testsApi.create({
          ...data,
          sub_topics: data.sub_topics ?? [],
          status: null,
        })
        setCurrentTest(res.data.data)
        testId = res.data.data.id
        setCurrentTestId(testId)
      }
      toast.success(isEdit ? 'Test updated!' : 'Test created!')
      navigate(`/tests/${testId}/questions`)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ── Header ── */}
      <div className="border-b border-slate-200 px-8 py-3 flex items-center justify-between bg-white">
        <div /> {/* spacer */}
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center relative cursor-pointer hover:bg-slate-50">
            <Bell size={17} className="text-slate-500" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full" />
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-sm font-bold text-primary-700">
                {(user?.name ?? user?.email ?? 'A').toString().charAt(0).toUpperCase()}
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
        </div>
      </div>

      <div className="px-8 py-6">
        {/* ── Breadcrumb ── */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <span
            className="hover:text-primary-600 cursor-pointer"
            onClick={() => navigate('/dashboard')}
          >
            Test Creation
          </span>
          <span>/</span>
          <span className="hover:text-primary-600 cursor-pointer">Create Test</span>
          <span>/</span>
          <span className="text-slate-800 font-medium">{activeTab}</span>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 mb-8 border border-slate-200 rounded-xl p-1 w-fit">
          {TEST_TYPES.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveTab(tab)
                setValue('type', TYPE_VALUES[tab])
              }}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-white text-primary-600 font-semibold shadow-sm border border-slate-200'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Row 1: Subject + Name of Test */}
          <div className="grid grid-cols-2 gap-8 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Subject
              </label>
              <div className="relative">
                <select
                  {...register('subject')}
                  className="w-full appearance-none border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 bg-white outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 cursor-pointer"
                >
                  <option value="">Choose from Drop-down</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
              {errors.subject && (
                <p className="text-xs text-red-500 mt-1">{errors.subject.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Name of Test
              </label>
              <input
                {...register('name')}
                placeholder="Enter name of Test"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 bg-white outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 placeholder:text-slate-400"
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
              )}
            </div>
          </div>

          {/* Row 2: Topic + Sub Topic */}
          <div className="grid grid-cols-2 gap-8 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Topic
              </label>
              <Controller
                control={control}
                name="topics"
                render={({ field }) => (
                  <div className="relative">
                    <select
                      value={field.value?.[0] ?? ''}
                      onChange={(e) => {
                        field.onChange(e.target.value ? [e.target.value] : [])
                      }}
                      disabled={!watchSubject}
                      className="w-full appearance-none border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 bg-white outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 cursor-pointer disabled:bg-slate-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Choose from Drop-down</option>
                      {topics.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                  </div>
                )}
              />
              {errors.topics && (
                <p className="text-xs text-red-500 mt-1">{errors.topics.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Sub Topic
              </label>
              <Controller
                control={control}
                name="sub_topics"
                render={({ field }) => (
                  <div className="relative">
                    <select
                      value={field.value?.[0] ?? ''}
                      onChange={(e) => {
                        field.onChange(e.target.value ? [e.target.value] : [])
                      }}
                      disabled={!watchTopics?.length}
                      className="w-full appearance-none border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 bg-white outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 cursor-pointer disabled:bg-slate-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Choose from Drop-down</option>
                      {subTopics.map((st) => (
                        <option key={st.id} value={st.id}>
                          {st.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                  </div>
                )}
              />
            </div>
          </div>

          {/* Row 3: Duration + Difficulty */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Duration (Minutes)
              </label>
              <input
                {...register('total_time')}
                type="number"
                placeholder="Enter the time"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 bg-white outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 placeholder:text-slate-400"
              />
              {errors.total_time && (
                <p className="text-xs text-red-500 mt-1">{errors.total_time.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Test Difficulty Level
              </label>
              <Controller
                control={control}
                name="difficulty"
                render={({ field }) => (
                  <div className="flex items-center gap-8 pt-2">
                    {['easy', 'medium', 'hard'].map((level) => (
                      <label
                        key={level}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <div
                          onClick={() => field.onChange(level)}
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${
                            field.value === level
                              ? 'border-primary-600'
                              : 'border-slate-300'
                          }`}
                        >
                          {field.value === level && (
                            <div className="w-2.5 h-2.5 rounded-full bg-primary-600" />
                          )}
                        </div>
                        <span className="text-sm text-slate-700 capitalize">
                          {level === 'hard' ? 'Difficult' : level.charAt(0).toUpperCase() + level.slice(1)}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              />
            </div>
          </div>

          {/* ── Marking Scheme ── */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">
              Marking Scheme:
            </h3>
            <div className="flex items-end gap-6 flex-wrap">
              {/* Wrong Answer */}
              <div>
                <p className="text-xs text-slate-500 mb-2">Wrong Answer</p>
                <Controller
                  control={control}
                  name="wrong_marks"
                  render={({ field }) => (
                    <NumberStepper
                      value={Number(field.value)}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>

              {/* Unattempted */}
              <div>
                <p className="text-xs text-slate-500 mb-2">Unattempted</p>
                <Controller
                  control={control}
                  name="unattempt_marks"
                  render={({ field }) => (
                    <NumberStepper
                      value={Number(field.value)}
                      onChange={field.onChange}
                      min={0}
                    />
                  )}
                />
              </div>

              {/* Correct Answer */}
              <div>
                <p className="text-xs text-slate-500 mb-2">Correct Answer</p>
                <Controller
                  control={control}
                  name="correct_marks"
                  render={({ field }) => (
                    <NumberStepper
                      value={Number(field.value)}
                      onChange={field.onChange}
                      min={0}
                    />
                  )}
                />
              </div>

              {/* No of Questions */}
              <div className="flex-1 min-w-[160px]">
                <p className="text-xs text-slate-500 mb-2">No of Questions</p>
                <input
                  {...register('total_questions')}
                  type="number"
                  placeholder="Ex:250 Marks"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 placeholder:text-slate-300"
                />
                {errors.total_questions && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.total_questions.message}
                  </p>
                )}
              </div>

              {/* Total Marks — auto calculated */}
              <div className="flex-1 min-w-[160px]">
                <p className="text-xs text-slate-400 mb-2">Total Marks</p>
                <input
                  {...register('total_marks')}
                  type="number"
                  placeholder="Ex:250 Marks"
                  readOnly
                  className="w-full border border-slate-100 rounded-lg px-3 py-2 text-sm text-slate-400 bg-slate-50 outline-none cursor-not-allowed placeholder:text-slate-300"
                />
              </div>
            </div>
          </div>

          {/* ── Footer Buttons ── */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-8 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-10 py-2.5 rounded-xl text-sm font-semibold bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? 'Saving...' : 'Next'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
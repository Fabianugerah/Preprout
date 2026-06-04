import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'
import { topicsApi, subTopicsApi, testsApi } from '@/api'
import { testSchema, type TestSchema } from '@/lib/schemas'
import { getErrorMessage } from '@/utils'
import type { Test, Subject, Topic, SubTopic } from '@/types'

const TEST_TYPES = ['Chapter Wise', 'PYQ', 'Mock Test']
const TYPE_VALUES: Record<string, string> = {
  'Chapter Wise': 'practice',
  'PYQ': 'pyq',
  'Mock Test': 'mock',
}

function NumberStepper({ value, onChange, min }: {
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
        <button type="button" onClick={() => onChange(value + 1)}
          className="text-slate-400 hover:text-slate-600 leading-none">
          <ChevronDown size={13} className="rotate-180" />
        </button>
        <button type="button"
          onClick={() => onChange(min !== undefined ? Math.max(min, value - 1) : value - 1)}
          className="text-slate-400 hover:text-slate-600 leading-none">
          <ChevronDown size={13} />
        </button>
      </div>
    </div>
  )
}

interface Props {
  test: Test
  subjects: Subject[]
  onClose: () => void
  onSave: (updated: Test) => void
}

export default function EditTestModal({ test, subjects, onClose, onSave }: Props) {
  const [activeTab, setActiveTab] = useState('Chapter Wise')
  const [topics, setTopics] = useState<Topic[]>([])
  const [subTopics, setSubTopics] = useState<SubTopic[]>([])
  const [isSaving, setIsSaving] = useState(false)

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } =
    useForm<TestSchema>({
      resolver: zodResolver(testSchema),
      defaultValues: {
        name: test.name,
        type: test.type ?? 'practice',
        subject: test.subject_id ?? test.subject ?? '',
        topics: test.topic_ids ?? [],
        sub_topics: test.sub_topic_ids ?? [],
        difficulty: test.difficulty ?? 'easy',
        correct_marks: test.correct_marks ?? 5,
        wrong_marks: test.wrong_marks ?? -1,
        unattempt_marks: test.unattempt_marks ?? 0,
        total_time: test.total_time ?? 0,
        total_marks: test.total_marks ?? 0,
        total_questions: test.total_questions ?? 0,
      },
    })

  const watchSubject = watch('subject')
  const watchTopics = watch('topics')
  const watchCorrect = watch('correct_marks')
  const watchQuestions = watch('total_questions')

  useEffect(() => {
    setValue('total_marks', (Number(watchCorrect) || 0) * (Number(watchQuestions) || 0))
  }, [watchCorrect, watchQuestions, setValue])

  useEffect(() => {
    if (!watchSubject) return
    topicsApi.getBySubject(watchSubject).then(res => setTopics(res.data.data ?? []))
  }, [watchSubject])

  useEffect(() => {
    if (!watchTopics?.length) return
    subTopicsApi.getByTopicIds(watchTopics).then(res => setSubTopics(res.data.data ?? []))
  }, [watchTopics])

  const onSubmit = async (data: TestSchema) => {
    setIsSaving(true)
    try {
      const res = await testsApi.update(test.id, { ...data, status: test.status })
      toast.success('Test updated!')
      onSave(res.data.data)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 sticky top-0 bg-white z-10">
          <h2 className="text-base font-semibold text-slate-800">Edit Test creation</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
            <X size={18} />
          </button>
        </div>

        <div className="px-8 py-6">
          {/* Tabs */}
          <div className="flex gap-1 mb-6 border border-slate-200 rounded-xl p-1 w-fit">
            {TEST_TYPES.map(tab => (
              <button key={tab} type="button"
                onClick={() => { setActiveTab(tab); setValue('type', TYPE_VALUES[tab]) }}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-white text-primary-600 font-semibold shadow-sm border border-slate-200'
                    : 'text-slate-500 hover:text-slate-700'
                }`}>
                {tab}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Subject + Name */}
            <div className="grid grid-cols-2 gap-6 mb-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                <div className="relative">
                  <select {...register('subject')}
                    className="w-full appearance-none border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 bg-white outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100">
                    <option value="">Choose from Drop-down</option>
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Name of Test</label>
                <input {...register('name')} placeholder="Enter name of Test"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 placeholder:text-slate-400" />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
              </div>
            </div>

            {/* Topic + Sub Topic */}
            <div className="grid grid-cols-2 gap-6 mb-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Topic</label>
                <Controller control={control} name="topics" render={({ field }) => (
                  <div className="relative">
                    <select value={field.value?.[0] ?? ''}
                      onChange={e => field.onChange(e.target.value ? [e.target.value] : [])}
                      disabled={!watchSubject}
                      className="w-full appearance-none border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 bg-white outline-none focus:border-primary-400 disabled:bg-slate-50">
                      <option value="">Choose from Drop-down</option>
                      {topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                )} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Sub Topic</label>
                <Controller control={control} name="sub_topics" render={({ field }) => (
                  <div className="relative">
                    <select value={field.value?.[0] ?? ''}
                      onChange={e => field.onChange(e.target.value ? [e.target.value] : [])}
                      disabled={!watchTopics?.length}
                      className="w-full appearance-none border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 bg-white outline-none focus:border-primary-400 disabled:bg-slate-50">
                      <option value="">Choose from Drop-down</option>
                      {subTopics.map(st => <option key={st.id} value={st.id}>{st.name}</option>)}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                )} />
              </div>
            </div>

            {/* Duration + Difficulty */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Duration (Minutes)</label>
                <input {...register('total_time')} type="number" placeholder="Enter the time"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 placeholder:text-slate-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Test Difficulty Level</label>
                <Controller control={control} name="difficulty" render={({ field }) => (
                  <div className="flex items-center gap-6 pt-2">
                    {['easy', 'medium', 'hard'].map(level => (
                      <label key={level} className="flex items-center gap-2 cursor-pointer">
                        <div onClick={() => field.onChange(level)}
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer ${
                            field.value === level ? 'border-primary-600' : 'border-slate-300'
                          }`}>
                          {field.value === level && <div className="w-2.5 h-2.5 rounded-full bg-primary-600" />}
                        </div>
                        <span className="text-sm text-slate-700 capitalize">
                          {level === 'hard' ? 'Difficult' : level.charAt(0).toUpperCase() + level.slice(1)}
                        </span>
                      </label>
                    ))}
                  </div>
                )} />
              </div>
            </div>

            {/* Marking Scheme */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Marking Scheme:</h3>
              <div className="flex items-end gap-4 flex-wrap">
                <div>
                  <p className="text-xs text-slate-500 mb-2">Wrong Answer</p>
                  <Controller control={control} name="wrong_marks"
                    render={({ field }) => <NumberStepper value={Number(field.value)} onChange={field.onChange} />} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-2">Unattempted</p>
                  <Controller control={control} name="unattempt_marks"
                    render={({ field }) => <NumberStepper value={Number(field.value)} onChange={field.onChange} min={0} />} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-2">Correct Answer</p>
                  <Controller control={control} name="correct_marks"
                    render={({ field }) => <NumberStepper value={Number(field.value)} onChange={field.onChange} min={0} />} />
                </div>
                <div className="flex-1 min-w-[140px]">
                  <p className="text-xs text-slate-500 mb-2">No of Questions</p>
                  <input {...register('total_questions')} type="number" placeholder="Ex:250 Marks"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 placeholder:text-slate-300" />
                </div>
                <div className="flex-1 min-w-[140px]">
                  <p className="text-xs text-slate-400 mb-2">Total Marks</p>
                  <input {...register('total_marks')} type="number" readOnly placeholder="Ex:250 Marks"
                    className="w-full border border-slate-100 rounded-lg px-3 py-2 text-sm text-slate-400 bg-slate-50 outline-none cursor-not-allowed placeholder:text-slate-300" />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button type="button" onClick={onClose}
                className="px-8 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-all">
                Cancel
              </button>
              <button type="submit" disabled={isSaving}
                className="px-10 py-2.5 rounded-xl text-sm font-semibold bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 transition-all">
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
import { Trash2, Plus, ChevronDown, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List } from 'lucide-react'
import { DIFFICULTY_OPTIONS } from '@/utils'
import type { Question, Topic, SubTopic } from '@/types'

interface Props {
  question: Question
  index: number
  total: number
  topics: Topic[]
  subTopics: SubTopic[]
  onChange: (field: keyof Question, value: string) => void
  onDelete: () => void
  onAdd: () => void
}

const TOOLBAR_ICONS = [Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List]

export default function QuestionForm({
  question,
  index,
  total,
  topics,
  subTopics,
  onChange,
  onDelete,
  onAdd,
}: Props) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-800">
            Question {index + 1}
          </span>
          <span className="text-xs text-slate-400">/ {total}</span>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-all"
        >
          <Plus size={12} />
          MCQ
        </button>
      </div>

      {/* Delete */}
      <button
        onClick={onDelete}
        className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 mb-3 transition-colors"
      >
        <Trash2 size={12} />
        Delete All Edits
      </button>

      {/* Toolbar */}
      <div className="flex items-center gap-0.5 border border-slate-200 rounded-t-lg px-2 py-1.5 bg-slate-50 flex-wrap">
        {TOOLBAR_ICONS.map((Icon, i) => (
          <button
            key={i}
            type="button"
            className="p-1.5 rounded hover:bg-slate-200 text-slate-500 transition-all"
          >
            <Icon size={13} />
          </button>
        ))}
      </div>

      {/* Question textarea */}
      <textarea
        value={question.question}
        onChange={(e) => onChange('question', e.target.value)}
        placeholder="Type here"
        rows={3}
        className="w-full border border-slate-200 border-t-0 rounded-b-lg px-4 py-3 text-sm text-slate-700 outline-none focus:border-primary-400 resize-none placeholder:text-slate-300"
      />

      {/* Options */}
      <div className="mt-4">
        <p className="text-sm font-medium text-slate-700 mb-3">
          Type the options below
        </p>
        <div className="space-y-2">
          {(['option1', 'option2', 'option3', 'option4'] as const).map((opt) => (
            <div key={opt} className="flex items-center gap-3">
              {/* Radio */}
              <button
                type="button"
                onClick={() => onChange('correct_option', opt)}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  question.correct_option === opt
                    ? 'border-primary-600'
                    : 'border-slate-300'
                }`}
              >
                {question.correct_option === opt && (
                  <div className="w-2.5 h-2.5 rounded-full bg-primary-600" />
                )}
              </button>
              <input
                value={question[opt]}
                onChange={(e) => onChange(opt, e.target.value)}
                placeholder="Type Option here"
                className="flex-1 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 placeholder:text-slate-300"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Solution */}
      <div className="mt-4">
        <p className="text-sm font-medium text-slate-700 mb-2">Add Solution</p>
        <textarea
          value={question.explanation ?? ''}
          onChange={(e) => onChange('explanation', e.target.value)}
          placeholder="Type here"
          rows={3}
          className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-700 outline-none focus:border-primary-400 resize-none placeholder:text-slate-300"
        />
      </div>

      {/* Question Settings */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        <p className="text-sm font-semibold text-slate-700 mb-4">
          Question settings
        </p>
        <div className="space-y-3">
          {/* Difficulty */}
          <div>
            <label className="text-xs text-slate-500 mb-1.5 block">
              Level of Difficulty
            </label>
            <div className="relative">
              <select
                value={question.difficulty ?? ''}
                onChange={(e) => onChange('difficulty', e.target.value)}
                className="w-full appearance-none border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 bg-white outline-none focus:border-primary-400"
              >
                <option value="">Select from Drop-down</option>
                {DIFFICULTY_OPTIONS.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
              <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Topic */}
          <div>
            <label className="text-xs text-slate-500 mb-1.5 block">Topic</label>
            <div className="relative">
              <select
                value={question.topic_id ?? ''}
                onChange={(e) => onChange('topic_id', e.target.value)}
                className="w-full appearance-none border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 bg-white outline-none focus:border-primary-400"
              >
                <option value="">Select from Drop-down</option>
                {topics.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Sub Topic */}
          <div>
            <label className="text-xs text-slate-500 mb-1.5 block">Sub-topic</label>
            <div className="relative">
              <select
                value={question.sub_topic_id ?? ''}
                onChange={(e) => onChange('sub_topic_id', e.target.value)}
                className="w-full appearance-none border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 bg-white outline-none focus:border-primary-400"
              >
                <option value="">Select from Drop-down</option>
                {subTopics.map((st) => (
                  <option key={st.id} value={st.id}>{st.name}</option>
                ))}
              </select>
              <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
import { Plus, X } from 'lucide-react'
import type { Question } from '@/types'

interface Props {
  questions: Question[]
  activeIndex: number
  onSelect: (index: number) => void
  onDelete: (index: number) => void
  onAdd: () => void
}

export default function QuestionSidebar({
  questions,
  activeIndex,
  onSelect,
  onDelete,
  onAdd,
}: Props) {
  return (
    <aside className="w-52 bg-white border-r border-slate-200 flex flex-col shrink-0">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100">
        <p className="text-xs font-semibold text-slate-700">Question Creation</p>
        <p className="text-xs text-slate-400 mt-0.5">
          Total Questions: {questions.length}
        </p>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto py-2">
        {questions.map((q, index) => (
          <div
            key={index}
            onClick={() => onSelect(index)}
            className={`mx-2 mb-1 px-3 py-2 rounded-lg cursor-pointer flex items-center justify-between group transition-all ${
              activeIndex === index
                ? 'bg-primary-50 border border-primary-200'
                : 'hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <div
                className={`w-2 h-2 rounded-full shrink-0 ${
                  q.question ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              />
              <span
                className={`text-xs font-medium truncate ${
                  activeIndex === index ? 'text-primary-700' : 'text-slate-600'
                }`}
              >
                Question {index + 1}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete(index)
              }}
              className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all shrink-0"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>

      {/* Add button */}
      <div className="p-3 border-t border-slate-100">
        <button
          onClick={onAdd}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-dashed border-primary-300 text-primary-600 text-xs font-medium hover:bg-primary-50 transition-all"
        >
          <Plus size={13} />
          Add Question
        </button>
      </div>
    </aside>
  )
}
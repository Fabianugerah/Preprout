import { ChevronRight } from 'lucide-react'
import type { Question } from '@/types'

interface Props {
  questions: Question[]
  onSelect: (index: number) => void
}

export default function QuestionListSidebar({ questions, onSelect }: Props) {
  return (
    <aside className="w-52 bg-white border-r border-slate-200 flex flex-col shrink-0">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-700">Question creation</p>
          <p className="text-xs text-slate-400 mt-0.5">
            Total Questions . {questions.length}
          </p>
        </div>
        <button className="text-slate-400 hover:text-slate-600">
          <ChevronRight size={14} />
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto py-2">
        {questions.map((q, index) => (
          <div
            key={index}
            onClick={() => onSelect(index)}
            className="mx-2 mb-1 px-3 py-2 rounded-lg cursor-pointer flex items-center justify-between hover:bg-slate-50 transition-all group"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                <span className="text-white text-[9px] font-bold">✓</span>
              </div>
              <span className="text-xs font-medium text-slate-600 truncate">
                Question {index + 1}
              </span>
            </div>
            <ChevronRight
              size={12}
              className="text-slate-400 group-hover:text-primary-500 shrink-0"
            />
          </div>
        ))}
      </div>
    </aside>
  )
}
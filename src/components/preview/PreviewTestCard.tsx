import { Pencil } from 'lucide-react'
import type { Test, Topic, SubTopic } from '@/types'

interface Props {
  test: Test
  topics: Topic[]
  subTopics: SubTopic[]
  onEdit: () => void
}

export default function PreviewTestCard({ test, topics, subTopics, onEdit }: Props) {
  const topicName = (id: string) => topics.find((t) => t.id === id)?.name ?? id
  const subTopicName = (id: string) => subTopics.find((s) => s.id === id)?.name ?? id

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 relative mb-6">
      {/* Edit */}
      <button
        onClick={onEdit}
        className="absolute top-5 right-5 p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all"
      >
        <Pencil size={15} />
      </button>

      {/* Type badge */}
      <div className="mb-4">
        <span className="px-3 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-semibold">
          {test.type === 'practice' ? 'Chapter Wise' : test.type ?? 'Chapter Wise'}
        </span>
      </div>

      {/* Chapter + Difficulty */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-lg">🎯</span>
        <span className="text-base font-bold text-slate-800">Chapter 1</span>
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-semibold">
          <span>🧠</span>
          {test.difficulty
            ? test.difficulty.charAt(0).toUpperCase() + test.difficulty.slice(1)
            : 'Easy'}
        </span>
      </div>

      {/* Subject / Topic / Sub Topic */}
      <div className="space-y-2.5 mb-5">
        <div className="flex items-center gap-3 text-sm">
          <span className="text-slate-400 w-20">Subject</span>
          <span className="text-slate-300">:</span>
          <span className="text-slate-700 font-medium">{test.subject ?? '—'}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-slate-400 w-20">Topic</span>
          <span className="text-slate-300">:</span>
          <div className="flex gap-1.5 flex-wrap">
            {(test.topic_ids ?? test.topics ?? []).map((tid, i) => (
              <span
                key={i}
                className="px-2.5 py-0.5 rounded-full border border-amber-400 text-amber-600 text-xs font-medium"
              >
                {topicName(tid)}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-slate-400 w-20">Sub Topic</span>
          <span className="text-slate-300">:</span>
          <div className="flex gap-1.5 flex-wrap">
            {(test.sub_topic_ids ?? test.sub_topics ?? []).map((stid, i) => (
              <span
                key={i}
                className="px-2.5 py-0.5 rounded-full border border-amber-400 text-amber-600 text-xs font-medium"
              >
                {subTopicName(stid)}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span>🕐</span>
          <span>{test.total_time ?? 0} Min</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span>📄</span>
          <span>{test.total_questions ?? 0} Q's</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span>📊</span>
          <span>{test.total_marks ?? 0} Marks</span>
        </div>
      </div>
    </div>
  )
}
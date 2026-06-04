import { Pencil } from 'lucide-react'
import type { Test, Topic, SubTopic } from '@/types'

interface Props {
  test: Test
  topics: Topic[]
  subTopics: SubTopic[]
  onEdit: () => void
}

export default function TestInfoCard({ test, topics, subTopics, onEdit }: Props) {
  const topicName = (id: string) => topics.find((t) => t.id === id)?.name ?? id
  const subTopicName = (id: string) => subTopics.find((s) => s.id === id)?.name ?? id

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 mb-5 relative">
      {/* Edit button */}
      <button
        onClick={onEdit}
        className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all"
      >
        <Pencil size={14} />
      </button>

      {/* Badges */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="px-2.5 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold capitalize">
          {test.type === 'practice' ? 'Chapter Wise' : test.type}
        </span>
        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          Chapter 1
        </span>
        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold capitalize">
          {test.difficulty ?? 'Easy'}
        </span>
      </div>

      {/* Subject / Topic / Sub Topic */}
      <div className="flex items-start gap-8 text-sm text-slate-600 mb-3 flex-wrap">
        <div>
          <span className="text-xs text-slate-400 block mb-0.5">Subject</span>
          <span className="font-medium">{test.subject ?? '—'}</span>
        </div>
        <div>
          <span className="text-xs text-slate-400 block mb-0.5">Topic</span>
          <div className="flex gap-1 flex-wrap">
            {(test.topic_ids ?? test.topics ?? []).map((tid, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 text-xs"
              >
                {topicName(tid)}
              </span>
            ))}
          </div>
        </div>
        <div>
          <span className="text-xs text-slate-400 block mb-0.5">Sub Topic</span>
          <div className="flex gap-1 flex-wrap">
            {(test.sub_topic_ids ?? test.sub_topics ?? []).map((stid, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 text-xs"
              >
                {subTopicName(stid)}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 text-xs text-slate-500">
        <span>{test.total_time ?? 0} Min</span>
        <span>•</span>
        <span>{test.total_questions ?? 0} Qt</span>
        <span>•</span>
        <span>{test.total_marks ?? 0} Marks</span>
      </div>
    </div>
  )
}
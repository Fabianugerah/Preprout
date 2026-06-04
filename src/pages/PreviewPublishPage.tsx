import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { testsApi, subjectsApi, topicsApi, subTopicsApi } from '@/api'
import { useTestCreationStore } from '@/store'
import { getErrorMessage } from '@/utils'
import type { Test, Question, Topic, SubTopic, Subject } from '@/types'

import PageHeader from '@/components/layout/PageHeader'
import PreviewTestCard from '@/components/preview/PreviewTestCard'
import PublishOptions from '@/components/preview/PublishOptions'
import QuestionListSidebar from '@/components/preview/QuestionListSidebar'
import EditTestModal from '@/components/questions/EditTestModal'

type LiveUntilOption = 'always' | '1week' | '2weeks' | '3weeks' | '1month' | 'custom'

export default function PreviewPublishPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { currentTest, setCurrentTest, questions } = useTestCreationStore()

  const [test, setTest] = useState<Test | null>(currentTest)
  const [localQuestions, setLocalQuestions] = useState<Question[]>(questions)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [subTopics, setSubTopics] = useState<SubTopic[]>([])
  const [showEditModal, setShowEditModal] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)

  // Publish options state
  const [publishTab, setPublishTab] = useState<'now' | 'schedule'>('now')
  const [liveUntil, setLiveUntil] = useState<LiveUntilOption>('always')
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleTime, setScheduleTime] = useState('')
  const [endDate, setEndDate] = useState('')
  const [endTime, setEndTime] = useState('')

  // Fetch test
  useEffect(() => {
    if (!test && id) {
      testsApi.getById(id).then((res) => setTest(res.data.data))
    }
  }, [id, test])

  // Fetch subjects
  useEffect(() => {
    subjectsApi.getAll().then((res) => setSubjects(res.data.data ?? []))
  }, [])

  // Fetch topics
  useEffect(() => {
    const subjectId = test?.subject_id ?? test?.subject ?? ''
    if (!subjectId) return
    topicsApi.getBySubject(subjectId).then((res) => setTopics(res.data.data ?? []))
  }, [test])

  // Fetch subtopics
  useEffect(() => {
    const topicIds = test?.topic_ids ?? test?.topics ?? []
    if (!topicIds.length) return
    subTopicsApi.getByTopicIds(topicIds).then((res) => setSubTopics(res.data.data ?? []))
  }, [test])

  const handleConfirm = async () => {
    if (!id) return
    if (publishTab === 'schedule' && !scheduleDate) {
      toast.error('Please select a schedule date')
      return
    }
    if (liveUntil === 'custom' && !endDate) {
      toast.error('Please select an end date')
      return
    }
    setIsConfirming(true)
    try {
      await testsApi.publish(id)
      toast.success('Test published successfully! 🎉')
      navigate('/dashboard')
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setIsConfirming(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <PageHeader />

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <QuestionListSidebar
          questions={localQuestions}
          onSelect={() => navigate(`/tests/${id}/questions`)}
        />

        {/* Main */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 py-5">
            {/* Page title */}
            <p className="text-sm text-slate-500 mb-4">Test creation</p>

            {/* Test created badge */}
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-lg font-bold text-slate-800">Test created</h2>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-semibold">
                <CheckCircle size={12} />
                All {localQuestions.length} Questions done
              </span>
            </div>

            {/* Test info card */}
            {test && (
              <PreviewTestCard
                test={test}
                topics={topics}
                subTopics={subTopics}
                onEdit={() => setShowEditModal(true)}
              />
            )}

            {/* Publish options */}
            <PublishOptions
              publishTab={publishTab}
              onTabChange={setPublishTab}
              liveUntil={liveUntil}
              onLiveUntilChange={setLiveUntil}
              scheduleDate={scheduleDate}
              onScheduleDateChange={setScheduleDate}
              scheduleTime={scheduleTime}
              onScheduleTimeChange={setScheduleTime}
              endDate={endDate}
              onEndDateChange={setEndDate}
              endTime={endTime}
              onEndTimeChange={setEndTime}
            />
          </div>
        </main>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-slate-200 px-6 py-3 flex items-center justify-end gap-3 shrink-0">
        <button
          onClick={() => navigate('/dashboard')}
          className="px-8 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-all"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          disabled={isConfirming}
          className="px-10 py-2.5 rounded-xl text-sm font-semibold bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 transition-all"
        >
          {isConfirming ? 'Publishing...' : 'Confirm'}
        </button>
      </div>

      {/* Edit Modal */}
      {showEditModal && test && (
        <EditTestModal
          test={test}
          subjects={subjects}
          onClose={() => setShowEditModal(false)}
          onSave={(updated) => {
            setTest(updated)
            setCurrentTest(updated)
            setShowEditModal(false)
          }}
        />
      )}
    </div>
  )
}
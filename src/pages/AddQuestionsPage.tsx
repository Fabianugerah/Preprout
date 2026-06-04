import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { testsApi, questionsApi, subjectsApi, topicsApi, subTopicsApi } from '@/api'
import { useTestCreationStore } from '@/store'
import { getErrorMessage } from '@/utils'
import type { Test, Question, Subject, Topic, SubTopic } from '@/types'

import PageHeader from '@/components/layout/PageHeader'
import QuestionSidebar from '@/components/questions/QuestionSidebar'
import TestInfoCard from '@/components/questions/TestInfoCard'
import QuestionForm from '@/components/questions/QuestionForm'
import EditTestModal from '@/components/questions/EditTestModal'

export default function AddQuestionsPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { currentTest, setCurrentTest, setQuestions } = useTestCreationStore()

  const [test, setTest] = useState<Test | null>(currentTest)
  const [localQuestions, setLocalQuestions] = useState<Question[]>([])
  const [activeQIndex, setActiveQIndex] = useState(0)
  const [isPublishing, setIsPublishing] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [subTopics, setSubTopics] = useState<SubTopic[]>([])

  const emptyQuestion = (): Question => ({
    type: 'mcq',
    question: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    correct_option: 'option1',
    explanation: '',
    difficulty: '',
    topic_id: '',
    sub_topic_id: '',
    test_id: id,
  })

  useEffect(() => {
    setLocalQuestions([emptyQuestion()])
  }, [])

  useEffect(() => {
    if (!test && id) {
      testsApi.getById(id).then(res => setTest(res.data.data))
    }
  }, [id, test])

  useEffect(() => {
    subjectsApi.getAll().then(res => setSubjects(res.data.data ?? []))
  }, [])

  useEffect(() => {
    const subjectId = test?.subject_id ?? test?.subject ?? ''
    if (!subjectId) return
    topicsApi.getBySubject(subjectId).then(res => setTopics(res.data.data ?? []))
  }, [test])

  useEffect(() => {
    const topicIds = test?.topic_ids ?? test?.topics ?? []
    if (!topicIds.length) return
    subTopicsApi.getByTopicIds(topicIds).then(res => setSubTopics(res.data.data ?? []))
  }, [test])

  const activeQ = localQuestions[activeQIndex] ?? emptyQuestion()

  const updateQuestion = (field: keyof Question, value: string) => {
    setLocalQuestions(prev => {
      const updated = [...prev]
      updated[activeQIndex] = { ...updated[activeQIndex], [field]: value }
      return updated
    })
  }

  const addQuestion = () => {
    setLocalQuestions(prev => [...prev, emptyQuestion()])
    setActiveQIndex(localQuestions.length)
  }

  const deleteQuestion = (index: number) => {
    if (localQuestions.length === 1) {
      toast.error('At least one question required')
      return
    }
    setLocalQuestions(prev => prev.filter((_, i) => i !== index))
    setActiveQIndex(Math.max(0, index - 1))
  }

  const handleNext = async () => {
    if (!id) return
    const hasEmpty = localQuestions.some(
      q => !q.question || !q.option1 || !q.option2 || !q.option3 || !q.option4
    )
    if (hasEmpty) {
      toast.error('Please fill all question fields')
      return
    }
    setIsPublishing(true)
    try {
      await questionsApi.bulkCreate({
        questions: localQuestions.map(q => ({ ...q, type: 'mcq', test_id: id! })),
      })
      await testsApi.update(id, { total_questions: localQuestions.length })
      setQuestions(localQuestions)
      toast.success('Questions saved!')
      navigate(`/tests/${id}/preview`)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <PageHeader
        rightContent={
          <button
            onClick={handleNext}
            disabled={isPublishing}
            className="ml-2 px-6 py-2 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 disabled:opacity-50 transition-all"
          >
            {isPublishing ? 'Saving...' : 'Publish'}
          </button>
        }
      />

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <QuestionSidebar
          questions={localQuestions}
          activeIndex={activeQIndex}
          onSelect={setActiveQIndex}
          onDelete={deleteQuestion}
          onAdd={addQuestion}
        />

        {/* Main */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 py-5">
            {/* Test info */}
            {test && (
              <TestInfoCard
                test={test}
                topics={topics}
                subTopics={subTopics}
                onEdit={() => setShowEditModal(true)}
              />
            )}

            {/* Question form */}
            <QuestionForm
              question={activeQ}
              index={activeQIndex}
              total={localQuestions.length}
              topics={topics}
              subTopics={subTopics}
              onChange={updateQuestion}
              onDelete={() => deleteQuestion(activeQIndex)}
              onAdd={addQuestion}
            />
          </div>
        </main>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-slate-200 px-6 py-3 flex items-center justify-between shrink-0">
        <button
          onClick={() => navigate(`/tests/${id}/edit`)}
          className="px-5 py-2.5 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-all"
        >
          Edit Test Creation
        </button>
        <button
          onClick={handleNext}
          disabled={isPublishing}
          className="px-8 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 disabled:opacity-50 transition-all"
        >
          {isPublishing ? 'Saving...' : 'Next'}
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
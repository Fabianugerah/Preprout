import { create } from 'zustand'
import type { Test, Question, Subject, Topic, SubTopic } from '@/types'

interface TestCreationState {
  currentTest: Test | null
  currentTestId: string | null
  questions: Question[]
  subjects: Subject[]
  topics: Topic[]
  subTopics: SubTopic[]

  setCurrentTest: (test: Test) => void
  setCurrentTestId: (id: string) => void
  setQuestions: (questions: Question[]) => void
  addQuestion: (question: Question) => void
  updateQuestion: (index: number, question: Question) => void
  removeQuestion: (index: number) => void
  setSubjects: (subjects: Subject[]) => void
  setTopics: (topics: Topic[]) => void
  setSubTopics: (subTopics: SubTopic[]) => void
  resetTestCreation: () => void
}

export const useTestCreationStore = create<TestCreationState>((set) => ({
  currentTest: null,
  currentTestId: null,
  questions: [],
  subjects: [],
  topics: [],
  subTopics: [],

  setCurrentTest: (test) => set({ currentTest: test }),
  setCurrentTestId: (id) => set({ currentTestId: id }),

  setQuestions: (questions) => set({ questions }),
  addQuestion: (question) =>
    set((state) => ({ questions: [...state.questions, question] })),
  updateQuestion: (index, question) =>
    set((state) => {
      const updated = [...state.questions]
      updated[index] = question
      return { questions: updated }
    }),
  removeQuestion: (index) =>
    set((state) => ({
      questions: state.questions.filter((_, i) => i !== index),
    })),

  setSubjects: (subjects) => set({ subjects }),
  setTopics: (topics) => set({ topics }),
  setSubTopics: (subTopics) => set({ subTopics }),

  resetTestCreation: () =>
    set({
      currentTest: null,
      currentTestId: null,
      questions: [],
      topics: [],
      subTopics: [],
    }),
}))
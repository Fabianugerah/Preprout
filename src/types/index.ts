// ─────────────────────────────────────────────
// Auth
// ─────────────────────────────────────────────
export interface LoginPayload {
  userId: string
  password: string
}

export interface User {
  id: string
  name?: string
  email?: string
  [key: string]: unknown
}

export interface AuthResponse {
  success: boolean
  data: {
    token: string
    user: User
  }
}

// ─────────────────────────────────────────────
// Subject / Topic / Sub-topic
// ─────────────────────────────────────────────
export interface Subject {
  id: string
  name: string
}

export interface Topic {
  id: string
  name: string
  subject_id: string
}

export interface SubTopic {
  id: string
  name: string
  topic_id: string
}

// ─────────────────────────────────────────────
// Test
// ─────────────────────────────────────────────
export type TestStatus = 'draft' | 'live' | 'archived' | null

export interface Test {
  id: string
  name: string
  type?: string
  subject?: string
  subject_id?: string
  topics?: string[]
  topic_ids?: string[]
  sub_topics?: string[]
  sub_topic_ids?: string[]
  difficulty?: string
  correct_marks?: number
  wrong_marks?: number
  unattempt_marks?: number
  total_time?: number
  total_marks?: number
  total_questions?: number
  status: TestStatus
  created_at?: string
  questions?: string[]
}

export interface CreateTestPayload {
  name: string
  type: string
  subject: string
  topics: string[]
  sub_topics: string[]
  correct_marks: number
  wrong_marks: number
  unattempt_marks: number
  difficulty: string
  total_time: number
  total_marks: number
  total_questions: number
  status: TestStatus
}

export interface UpdateTestPayload {
  name?: string
  type?: string
  subject?: string
  topics?: string[]
  sub_topics?: string[]
  correct_marks?: number
  wrong_marks?: number
  unattempt_marks?: number
  difficulty?: string
  total_time?: number
  total_marks?: number
  total_questions?: number
  status?: TestStatus
  questions?: string[]
}

// ─────────────────────────────────────────────
// Question
// ─────────────────────────────────────────────
export type CorrectOption = 'option1' | 'option2' | 'option3' | 'option4'

export interface Question {
  id?: string
  type: 'mcq'
  question: string
  option1: string
  option2: string
  option3: string
  option4: string
  correct_option: CorrectOption
  explanation?: string
  difficulty?: string
  topic_id?: string
  sub_topic_id?: string
  media_url?: string
  test_id?: string
}

export interface BulkCreateQuestionsPayload {
  questions: Array<Omit<Question, 'id'> & { test_id: string }>
}

export interface BulkFetchQuestionsPayload {
  question_ids: string[]
}

// ─────────────────────────────────────────────
// API Generic Response
// ─────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean
  data: T
  message?: string
}

// ─────────────────────────────────────────────
// Form Values
// ─────────────────────────────────────────────
export interface TestFormValues {
  name: string
  type: string
  subject: string
  topics: string[]
  sub_topics: string[]
  difficulty: string
  correct_marks: number
  wrong_marks: number
  unattempt_marks: number
  total_time: number
  total_marks: number
  total_questions: number
}

export interface QuestionFormValues {
  question: string
  option1: string
  option2: string
  option3: string
  option4: string
  correct_option: CorrectOption
  explanation?: string
  difficulty?: string
  topic_id?: string
  sub_topic_id?: string
  media_url?: string
}

export interface LoginFormValues {
  userId: string
  password: string
}
import apiClient from './client'
import type {
  ApiResponse,
  AuthResponse,
  LoginPayload,
  Subject,
  Topic,
  SubTopic,
  Test,
  CreateTestPayload,
  UpdateTestPayload,
  Question,
  BulkCreateQuestionsPayload,
  BulkFetchQuestionsPayload,
} from '@/types'

// Auth
export const authApi = {
  login: (payload: LoginPayload) =>
    apiClient.post<AuthResponse>('/auth/login', payload),
}

// Subjects
export const subjectsApi = {
  getAll: () =>
    apiClient.get<ApiResponse<Subject[]>>('/subjects'),
}

// Topics
export const topicsApi = {
  getBySubject: (subjectId: string) =>
    apiClient.get<ApiResponse<Topic[]>>(`/topics/subject/${subjectId}`),
}

// Sub-topics
export const subTopicsApi = {
  getByTopic: (topicId: string) =>
    apiClient.get<ApiResponse<SubTopic[]>>(`/sub-topics/topic/${topicId}`),

  getByTopicIds: (topicIds: string[]) =>
    apiClient.post<ApiResponse<SubTopic[]>>('/sub-topics/multi-topics', { topicIds }),
}

// Tests
export const testsApi = {
  getAll: () =>
    apiClient.get<ApiResponse<Test[]>>('/tests'),

  getById: (id: string) =>
    apiClient.get<ApiResponse<Test>>(`/tests/${id}`),

  create: (payload: CreateTestPayload) =>
    apiClient.post<ApiResponse<Test>>('/tests', payload),

  update: (id: string, payload: UpdateTestPayload) =>
    apiClient.put<ApiResponse<Test>>(`/tests/${id}`, payload),

  publish: (id: string) =>
    apiClient.put<ApiResponse<Test>>(`/tests/${id}`, { status: 'live' }),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/tests/${id}`),
}

// Questions
export const questionsApi = {
  bulkCreate: (payload: BulkCreateQuestionsPayload) =>
    apiClient.post<ApiResponse<Question[]>>('/questions/bulk', payload),

  fetchBulk: (payload: BulkFetchQuestionsPayload) =>
    apiClient.post<ApiResponse<Question[]>>('/questions/fetchBulk', payload),
}
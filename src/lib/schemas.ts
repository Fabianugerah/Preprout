import { z } from 'zod'

export const loginSchema = z.object({
  userId:   z.string().min(1, 'User ID is required'),
  password: z.string().min(1, 'Password is required'),
})

export const testSchema = z.object({
  name:            z.string().min(1, 'Test name is required').max(150),
  type:            z.string().min(1, 'Test type is required'),
  subject:         z.string().min(1, 'Subject is required'),
  topics:          z.array(z.string()).min(1, 'Select at least one topic'),
  sub_topics:      z.array(z.string()).default([]),
  difficulty:      z.string().min(1, 'Difficulty is required'),
  correct_marks:   z.coerce.number().min(0),
  wrong_marks:     z.coerce.number(),
  unattempt_marks: z.coerce.number(),
  total_time:      z.coerce.number().min(1, 'Total time must be > 0'),
  total_marks:     z.coerce.number().min(1, 'Total marks must be > 0'),
  total_questions: z.coerce.number().min(1, 'Must have at least 1 question'),
})

export const questionSchema = z.object({
  question:       z.string().min(1, 'Question text is required'),
  option1:        z.string().min(1, 'Option 1 is required'),
  option2:        z.string().min(1, 'Option 2 is required'),
  option3:        z.string().min(1, 'Option 3 is required'),
  option4:        z.string().min(1, 'Option 4 is required'),
  correct_option: z.enum(['option1', 'option2', 'option3', 'option4']),
  explanation:    z.string().optional(),
  difficulty:     z.string().optional(),
  topic_id:       z.string().optional(),
  sub_topic_id:   z.string().optional(),
  media_url:      z.string().optional(),
})

export type LoginSchema    = z.infer<typeof loginSchema>
export type TestSchema     = z.infer<typeof testSchema>
export type QuestionSchema = z.infer<typeof questionSchema>
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { TestStatus } from '@/types'

// ── Tailwind class merger ──────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ── Format date ───────────────────────────────
export function formatDate(dateString?: string): string {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// ── Status badge class ────────────────────────
export function getStatusClass(status: TestStatus): string {
  switch (status) {
    case 'live':     return 'badge-live'
    case 'draft':    return 'badge-draft'
    case 'archived': return 'badge-archived'
    default:         return 'badge-draft'
  }
}

export function getStatusLabel(status: TestStatus): string {
  switch (status) {
    case 'live':     return 'Live'
    case 'draft':    return 'Draft'
    case 'archived': return 'Archived'
    default:         return 'Draft'
  }
}

// ── Extract error message dari API ────────────
export function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as {
      response?: { data?: { message?: string; error?: string } }
    }
    return (
      axiosError.response?.data?.message ||
      axiosError.response?.data?.error ||
      'Something went wrong'
    )
  }
  if (error instanceof Error) return error.message
  return 'Something went wrong'
}

// ── Option label (option1 → A, dst) ──────────
export function getOptionLabel(option: string): string {
  const map: Record<string, string> = {
    option1: 'A',
    option2: 'B',
    option3: 'C',
    option4: 'D',
  }
  return map[option] ?? option
}

// ── Constants ─────────────────────────────────
export const DIFFICULTY_OPTIONS = [
  { value: 'easy',   label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard',   label: 'Hard' },
]

export const TEST_TYPE_OPTIONS = [
  { value: 'practice',  label: 'Practice' },
  { value: 'mock',      label: 'Mock Test' },
  { value: 'sectional', label: 'Sectional Test' },
  { value: 'full',      label: 'Full Test' },
]
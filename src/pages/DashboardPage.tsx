import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Pencil, Trash2, Eye, FileText } from 'lucide-react'
import toast from 'react-hot-toast'
import { testsApi } from '@/api'
import { formatDate, getStatusLabel, getStatusClass, getErrorMessage } from '@/utils'
import { ConfirmDialog, EmptyState, PageLoader } from '@/components/ui'
import PageHeader from '@/components/layout/PageHeader'
import type { Test } from '@/types'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [tests, setTests] = useState<Test[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchTests = async () => {
    try {
      const res = await testsApi.getAll()
      setTests(res.data.data ?? [])
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchTests() }, [])

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await testsApi.delete(deleteId)
      toast.success('Test deleted successfully')
      setTests((prev) => prev.filter((t) => t.id !== deleteId))
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  const totalTests = tests.length
  const liveTests = tests.filter((t) => t.status === 'live').length
  const draftTests = tests.filter((t) => t.status === 'draft').length

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <PageHeader />

      <div className="flex-1 px-6 py-6 max-w-[1200px] w-full mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Tests', value: totalTests, color: 'text-primary-600', bg: 'bg-primary-50', border: 'border-primary-100' },
            { label: 'Live Tests', value: liveTests, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
            { label: 'Draft Tests', value: draftTests, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
          ].map((stat) => (
            <div key={stat.label} className={`bg-white rounded-xl border ${stat.border} p-5 flex items-center gap-4`}>
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
                <FileText size={20} className={stat.color} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-800">All Tests</h2>
            <button
              onClick={() => navigate('/tests/new')}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-all"
            >
              <Plus size={16} />
              Create New Test
            </button>
          </div>

          {isLoading ? (
            <PageLoader />
          ) : tests.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No tests yet"
              description="Create your first test to get started"
              action={
                <button onClick={() => navigate('/tests/new')} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 mt-2">
                  <Plus size={16} />Create New Test
                </button>
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {['Test Name', 'Subject', 'Type', 'Status', 'Created', 'Actions'].map((h) => (
                      <th key={h} className={`px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide ${h === 'Actions' ? 'text-center' : 'text-left'}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tests.map((test) => (
                    <tr key={test.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-slate-800 truncate max-w-[200px]">{test.name}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{test.subject ?? '—'}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 capitalize">{test.type ?? '—'}</td>
                      <td className="px-6 py-4">
                        <span className={getStatusClass(test.status)}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {getStatusLabel(test.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">{formatDate(test.created_at)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => navigate(`/tests/${test.id}/preview`)} className="p-2 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-all" title="View">
                            <Eye size={15} />
                          </button>
                          <button onClick={() => navigate(`/tests/${test.id}/edit`)} className="p-2 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-all" title="Edit">
                            <Pencil size={15} />
                          </button>
                          <button onClick={() => setDeleteId(test.id)} className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all" title="Delete">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Test"
        message="Are you sure you want to delete this test? This action cannot be undone."
        confirmLabel={isDeleting ? 'Deleting...' : 'Delete'}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        variant="danger"
      />
    </div>
  )
}
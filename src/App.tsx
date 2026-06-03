import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import MainLayout from '@/components/layout/MainLayout'
import ProtectedRoute from '@/components/shared/ProtectedRoute'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import CreateTestPage from '@/pages/CreateTestPage'
import AddQuestionsPage from '@/pages/AddQuestionsPage'
import PreviewPublishPage from '@/pages/PreviewPublishPage'

function LayoutWrapper() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<LayoutWrapper />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/tests/new" element={<CreateTestPage />} />
            <Route path="/tests/:id/edit" element={<CreateTestPage />} />
            <Route path="/tests/:id/questions" element={<AddQuestionsPage />} />
            <Route path="/tests/:id/preview" element={<PreviewPublishPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
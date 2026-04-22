import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './auth/AuthContext'
import AppShell from './layout/AppShell'
import AuthCallback from './modules/auth-notifications/AuthCallback'
import LoginPage from './modules/auth-notifications/LoginPage'
import AdminResourcesPage from './modules/facilities-assets/AdminResourcesPage'
import ExistingResourceDetails from './modules/facilities-assets/ExistingResourceDetails'
import ResourceListPage from './modules/facilities-assets/ResourceListPage'
import ResourceCalendarPage from './modules/facilities-assets/ResourceCalendarPage'
import TicketCreatePage from './modules/maintenance-tickets/TicketCreatePage'
import TicketDashboardPage from './modules/maintenance-tickets/TicketDashboardPage'
import TicketDetailPage from './modules/maintenance-tickets/TicketDetailPage'
import HomePage from './pages/HomePage'
import AdminRoute from './routes/AdminRoute'
import ProtectedRoute from './routes/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/admin/resources"
            element={
              <AdminRoute>
                <AdminResourcesPage />
              </AdminRoute>
            }
          />
          <Route
            path="/facilities"
            element={
              <ProtectedRoute>
                <ResourceListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/facilities/:resourceId/calendar"
            element={
              <ProtectedRoute>
                <ResourceCalendarPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/facilities-assets/resources/:resourceId"
            element={<ExistingResourceDetails />}
          />

          <Route
            path="/tickets"
            element={
              <ProtectedRoute>
                <TicketDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tickets/new"
            element={
              <ProtectedRoute>
                <TicketCreatePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tickets/:id"
            element={
              <ProtectedRoute>
                <TicketDetailPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
</Routes>
    </AuthProvider>
  )
}

export default App

import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './auth/AuthContext'
import AppShell from './layout/AppShell'
import AuthCallback from './modules/auth-notifications/AuthCallback'
import LoginPage from './modules/auth-notifications/LoginPage'
import AdminResourcesPage from './modules/facilities-assets/AdminResourcesPage'
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
          <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
</Routes>
    </AuthProvider>
  )
}

export default App

import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './auth/AuthContext'
import AppShell from './layout/AppShell'
import AuthCallback from './modules/auth-notifications/AuthCallback'
import LoginPage from './modules/auth-notifications/LoginPage'
import HomePage from './pages/HomePage'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage />} />
          </Route>
</Routes>
    </AuthProvider>
  )
}

export default App

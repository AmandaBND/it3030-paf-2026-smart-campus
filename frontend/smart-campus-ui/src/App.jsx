import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './auth/AuthContext'
import AuthCallback from './modules/auth-notifications/AuthCallback'
import LoginPage from './modules/auth-notifications/LoginPage'
function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
</Routes>
    </AuthProvider>
  )
}

export default App

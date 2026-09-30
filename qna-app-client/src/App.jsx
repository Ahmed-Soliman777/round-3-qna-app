import { useEffect, useRef, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router'
import './App.css'
import SplashScreen from './components/SplashScreen'
import { SplashContext } from './context/splash'
import HomePage from './pages/HomePage'
import AssessmentsPage from './pages/AssessmentsPage'
import ContactPage from './pages/ContactPage'
import WhatsNewPage from './pages/WhatsNewPage'
import HelpCenterPage from './pages/HelpCenterPage'
import BlogPage from './pages/BlogPage'
import ReviewsPage from './pages/ReviewsPage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import { Proxy, PublicRoute } from './utils/proxy';
import VerifyAccountPage from './pages/VerifyAccountPage';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminQuizzes from './pages/AdminQuizzes';
import AdminQuizQuestions from './pages/AdminQuizQuestions';
import StudentDashboard from './pages/StudentDashboard';
import InviteEntry from './pages/InviteEntry';
import QuizPlaceholder from './pages/QuizPlaceholder';
import QuizInstructions from './pages/QuizInstructions';
import QuizSolve from './pages/QuizSolve';
import QuizResult from './pages/QuizResult';
import AdminQuizInvites from './pages/AdminQuizInvites'
import AdminAttempts from './pages/AdminAttempts'


function App() {
  const location = useLocation()
  const [showSplash, setShowSplash] = useState(true)
  const [splashFaded, setSplashFaded] = useState(false)
  const isFirstRun = useRef(true)
  // "Done" only once the fade-out has finished, so animations start in plain view.
  const splashDone = splashFaded && !showSplash

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false
      const minDelay = new Promise((resolve) => setTimeout(resolve, 1100))
      const fontsReady = document.fonts?.ready ?? Promise.resolve()
      Promise.all([minDelay, fontsReady]).then(() => setShowSplash(false))
      return
    }

    // A new page starts at the top, not at the previous page's scroll position.
    window.scrollTo({ top: 0, behavior: "instant" })
    setShowSplash(true)
    setSplashFaded(false)
    const timeout = setTimeout(() => setShowSplash(false), 700)
    return () => clearTimeout(timeout)
  }, [location.pathname])

  return (
    <SplashContext.Provider value={splashDone}>
      <SplashScreen visible={showSplash} onFadeEnd={setSplashFaded} />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/features/assessments' element={<AssessmentsPage />} />
        <Route path='/contact' element={<ContactPage />} />
        <Route path='/resources/whats-new' element={<WhatsNewPage />} />
        <Route path='/resources/help-center' element={<HelpCenterPage />} />
        <Route path='/resources/blog' element={<BlogPage />} />
        <Route path='/resources/reviews' element={<ReviewsPage />} />
        <Route element={<PublicRoute />}>
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/verify-account' element={<VerifyAccountPage />} />
        </Route>
        <Route element={<Proxy />}>
          <Route path='/admin-panel' element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path='quizzes' element={<AdminQuizzes />} />
            <Route path='quizzes/:quizId/questions' element={<AdminQuizQuestions />} />
            <Route path='quizzes/:quizId/invites' element={<AdminQuizInvites />} />
            <Route path='attempts' element={<AdminAttempts />} />
          </Route>
          <Route path='/dashboard' element={<StudentDashboard />} />
          <Route path="/quiz/invite/:token" element={<InviteEntry />} />
          <Route path="/quiz/:id" element={<QuizPlaceholder />} />
          <Route path="/quiz/:id/instructions" element={<QuizInstructions />} />
          <Route path="/quiz/:id/solve" element={<QuizSolve />} />
          <Route path="/quiz/:id/result" element={<QuizResult />} />
        </Route>
      </Routes>
    </SplashContext.Provider>
  )
}

export default App

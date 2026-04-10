import React from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider, useDispatch, useSelector } from 'react-redux'
import store from './redux/store'
import { setAuth, clearAuth } from './redux/authSlice'
import { supabase } from './supabase'
import LandingPage from './pages/LandingPage'
import HospitalMap from './pages/HospitalMap'
import Login from './pages/Login'
import Signup from './pages/Signup'
import VerifyOTP from './pages/VerifyOTP'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import DashboardLayout from './components/Dashboard/DashboardLayout'
import UserDashboard from './pages/Dashboard/UserDashboard'
import AdminPreview from './pages/AdminPreview'
import HospitalDetail from './pages/HospitalDetail'
import UserProfile from './pages/Dashboard/UserProfile'
import AccessDenied from './pages/AccessDenied'
import ProtectedRoute from './components/Auth/ProtectedRoute'
import Loader from './components/Loader/Loader'
import AlertContainer from './components/Alert/AlertContainer'
import { showLoader, hideLoader } from './redux/uiSlice'

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { authChecked } = useSelector(state => state.auth);

  React.useEffect(() => {
    dispatch(showLoader('Initializing secure protocols...'));
    
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        dispatch(setAuth({ session, user: session.user }));
      } else {
        dispatch(clearAuth());
      }
      dispatch(hideLoader());
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        dispatch(setAuth({ session, user: session.user }));
      } else {
        dispatch(clearAuth());
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  if (!authChecked) {
    return (
      <div className="vh-100 d-flex align-items-center justify-content-center bg-light">
        <Loader />
        <AlertContainer />
      </div>
    );
  }

  return children;
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AuthProvider>
          <div className="app-container">
            <Loader />
            <AlertContainer />

            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/map" element={<HospitalMap />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/verify-otp" element={<VerifyOTP />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/admin" element={<AdminPreview />} />
              <Route path="/hospital/:id" element={<HospitalDetail />} />
              <Route path="/access-denied" element={<AccessDenied />} />

              {/* Protected Dashboard Sub-System */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route index element={<UserDashboard />} />
                <Route path="profile" element={<UserProfile />} />
              </Route>
            </Routes>
          </div>
        </AuthProvider>
      </Router>
    </Provider>
  )
}

export default App

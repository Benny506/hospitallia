import React from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './redux/store'
import LandingPage from './pages/LandingPage'
import HospitalMap from './pages/HospitalMap'
import Loader from './components/Loader/Loader'
import AlertContainer from './components/Alert/AlertContainer'

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="app-container">
          <Loader />
          <AlertContainer />

          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/map" element={<HospitalMap />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  )
}

export default App

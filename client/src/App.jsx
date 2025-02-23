import './css/globals.css'
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'
import ErrorPage from './pages/ErrorPage'
import { HashRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
  );
}

export default App;
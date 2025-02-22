import './css/reset.css'
import TestPage from './pages/TestPage'
import ErrorPage from './pages/ErrorPage'
import DashboardPage from './pages/DashboardPage'
import { HashRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;

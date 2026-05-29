import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import AssessmentPage from './pages/AssessmentPage';
import ResultPage from './pages/ResultPage';
import SimulationPage from './pages/SimulationPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import AboutUsPage from './pages/AboutUsPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
        <Route path="/assessment" element={<AssessmentPage />} />
        {/* Future routes described in specifications */}
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/dashboard" element={<ResultPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/simulation" element={<SimulationPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import PatientIntake from './pages/PatientIntake';
import TechDashboard from './pages/TechDashboard';
import NeuroDashboard from './pages/NeuroDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<div>Login Page (Placeholder)</div>} />

        {/* Protected Routes inside the Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/tech-dash" replace />} />
          <Route path="tech-dash" element={<TechDashboard />} />
          <Route path="neuro-dash" element={<NeuroDashboard />} />
          <Route path="patient-entry" element={<PatientIntake />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import './localization/i18n';
import { Navbar } from './components/layout/Navbar';
import { InspectionPage } from './pages/InspectionPage';
import { ReportsPage } from './pages/ReportsPage';

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#F4F6F9] text-[#1F2429] flex flex-col font-sans transition-colors">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<InspectionPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

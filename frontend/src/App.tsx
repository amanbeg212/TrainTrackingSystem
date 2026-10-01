import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { JourneyPage } from './pages/JourneyPage';
import { SharedJourneyPage } from './features/sharing/SharedJourneyPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/train/:trainNumber" element={<JourneyPage />} />
        <Route path="/journey/:journeyId" element={<SharedJourneyPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

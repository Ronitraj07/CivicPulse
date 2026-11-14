import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CivicProvider } from './context/CivicContext';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { GovPortalsPage } from './pages/GovPortalsPage';
import { SubmitPage } from './pages/SubmitPage';
import { PostDetailPage } from './pages/PostDetailPage';
import { GovDashboardPage } from './pages/GovDashboardPage';

export const App: React.FC = () => {
  return (
    <CivicProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="s/:stateName" element={<HomePage />} />
            <Route path="gov-portals" element={<GovPortalsPage />} />
            <Route path="submit" element={<SubmitPage />} />
            <Route path="post/:id" element={<PostDetailPage />} />
            <Route path="gov-dashboard" element={<GovDashboardPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CivicProvider>
  );
};

export default App;

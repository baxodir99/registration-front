import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './utils/i18n';

import { AuthProvider, RequireAuth, RequireProfile } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import PayInvoicePage from './pages/PayInvoicePage';
import RegistrationPage from './pages/RegistrationPage';
import CabinetLayout from './pages/cabinet/CabinetLayout';
import CertificatesPage from './pages/cabinet/CertificatesPage';
import ExamsPage from './pages/cabinet/ExamsPage';
import HomePage from './pages/cabinet/HomePage';
import LinkProfilePage from './pages/cabinet/LinkProfilePage';
import PaymentsPage from './pages/cabinet/PaymentsPage';
import ProfilePage from './pages/cabinet/ProfilePage';
import ResultsPage from './pages/cabinet/ResultsPage';
import { modernTheme } from './theme/modernTheme';

function App() {
  return (
    <ThemeProvider theme={modernTheme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<RegistrationPage />} />
            <Route path="/kirish" element={<LoginPage />} />
            <Route element={<RequireAuth />}>
              <Route path="/tolov/:invoice" element={<PayInvoicePage />} />
              <Route path="/kabinet" element={<CabinetLayout />}>
                <Route path="profil-qoshish" element={<LinkProfilePage />} />
                <Route element={<RequireProfile />}>
                  <Route index element={<HomePage />} />
                  <Route path="imtihonlar" element={<ExamsPage />} />
                  <Route path="natijalar" element={<ResultsPage />} />
                  <Route path="sertifikatlar" element={<CertificatesPage />} />
                  <Route path="tolovlar" element={<PaymentsPage />} />
                  <Route path="profil" element={<ProfilePage />} />
                </Route>
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>

      {/* Toast Notifications */}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </ThemeProvider>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CheckInPage } from './pages/CheckInPage';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { QRPage } from './pages/QRPage';
import { ProtectedRoute } from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CheckInPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/qr" element={<QRPage />} />
      </Routes>
    </BrowserRouter>
  );
}

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import { LoginPage, RegisterPage, GalleryPage, UploadPage, CouplePage, SettingsPage, SpecialDatePage } from '../features';
import { NotificationList } from '../features';

export const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected routes */}
                <Route
                    path="/"
                    element={
                        <PrivateRoute>
                            <GalleryPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/upload"
                    element={
                        <PrivateRoute>
                            <UploadPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/couple"
                    element={
                        <PrivateRoute>
                            <CouplePage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/settings"
                    element={
                        <PrivateRoute>
                            <SettingsPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/special-dates"
                    element={
                        <PrivateRoute>
                            <SpecialDatePage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/notifications"
                    element={
                        <PrivateRoute>
                            <NotificationList />
                        </PrivateRoute>
                    }
                />

                {/* Redirect unknown routes */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

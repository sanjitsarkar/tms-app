import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { Provider } from 'react-redux';
import { apolloClient } from './graphql/client';
import { store } from './store';
import { useAppSelector } from './store/hooks';
import { selectIsAuthenticated } from './store/slices/authSlice';
import { Layout } from './components/Layout';
import { Login, Dashboard, Shipments } from './pages';

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Layout>{children}</Layout>;
};

// Auth route wrapper (redirects to home if already logged in)
const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/login" element={
                <AuthRoute>
                    <Login />
                </AuthRoute>
            } />

            <Route path="/" element={
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            } />

            <Route path="/shipments" element={
                <ProtectedRoute>
                    <Shipments />
                </ProtectedRoute>
            } />

            {/* Placeholder routes for menu items */}
            <Route path="/tracking/*" element={
                <ProtectedRoute>
                    <div className="glass rounded-2xl p-12 text-center">
                        <h2 className="text-xl font-semibold text-white mb-2">Tracking</h2>
                        <p className="text-dark-400">Coming soon...</p>
                    </div>
                </ProtectedRoute>
            } />

            <Route path="/reports/*" element={
                <ProtectedRoute>
                    <div className="glass rounded-2xl p-12 text-center">
                        <h2 className="text-xl font-semibold text-white mb-2">Reports</h2>
                        <p className="text-dark-400">Coming soon...</p>
                    </div>
                </ProtectedRoute>
            } />

            <Route path="/management/*" element={
                <ProtectedRoute>
                    <div className="glass rounded-2xl p-12 text-center">
                        <h2 className="text-xl font-semibold text-white mb-2">Management</h2>
                        <p className="text-dark-400">Coming soon...</p>
                    </div>
                </ProtectedRoute>
            } />

            <Route path="/documents" element={
                <ProtectedRoute>
                    <div className="glass rounded-2xl p-12 text-center">
                        <h2 className="text-xl font-semibold text-white mb-2">Documents</h2>
                        <p className="text-dark-400">Coming soon...</p>
                    </div>
                </ProtectedRoute>
            } />

            <Route path="/settings" element={
                <ProtectedRoute>
                    <div className="glass rounded-2xl p-12 text-center">
                        <h2 className="text-xl font-semibold text-white mb-2">Settings</h2>
                        <p className="text-dark-400">Coming soon...</p>
                    </div>
                </ProtectedRoute>
            } />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <ApolloProvider client={apolloClient}>
                <BrowserRouter>
                    <AppRoutes />
                </BrowserRouter>
            </ApolloProvider>
        </Provider>
    );
};

export default App;

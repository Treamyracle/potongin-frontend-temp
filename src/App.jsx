import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

// Komponen untuk memproteksi halaman Dashboard
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    return children;
};

// Redirect jika sudah login
const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (!loading && user) return <Navigate to="/dashboard" />;
    return children;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Toaster position="top-center" />
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    
                    <Route path="/login" element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    } />
                    
                    <Route path="/signup" element={
                        <PublicRoute>
                            <Signup />
                        </PublicRoute>
                    } />
                    
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
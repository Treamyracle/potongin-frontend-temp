import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const { data } = await api.get('/api/v1/me');
                setUser(data);
            } catch (error) {
                localStorage.removeItem('token');
                setUser(null);
            }
        }
        setLoading(false);
    };

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/login', { email, password });
            localStorage.setItem('token', data.token);
            await checkUser();
            toast.success('Login berhasil!');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.error || 'Login gagal');
            return false;
        }
    };

    const signup = async (email, password) => {
        try {
            await api.post('/signup', { email, password });
            toast.success('Registrasi berhasil! Silakan login.');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.error || 'Gagal daftar');
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        toast.success('Anda telah keluar');
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
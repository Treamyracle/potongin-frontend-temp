import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Scissors } from 'lucide-react';
import './css/Login.css'; // Import the new CSS file

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(email, password);
        if (success) navigate('/dashboard');
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <div className="icon-wrapper">
                        <Scissors className="w-8 h-8 text-maroon-900" />
                    </div>
                    <h2 className="app-title">Potong.in</h2>
                    <p className="app-subtitle">Masuk untuk mengelola link Anda</p>
                </div>

                <form onSubmit={handleSubmit} className="form-group">
                    <div>
                        <label className="input-label">Email</label>
                        <input
                            type="email"
                            required
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="input-label">Password</label>
                        <input
                            type="password"
                            required
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn-primary">
                        Masuk
                    </button>
                </form>
                <div className="login-footer">
                    <span className="text-gray-600">Belum punya akun? </span>
                    <Link to="/signup" className="link-text">
                        Daftar sekarang
                    </Link>
                </div>
            </div>
        </div>
    );
}
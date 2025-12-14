import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Scissors } from 'lucide-react';
import toast from 'react-hot-toast';
import './css/Signup.css'; // Import the new CSS file

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Password dan Konfirmasi Password tidak cocok!');
            return;
        }

        if (password.length < 6) {
            toast.error('Password minimal 6 karakter');
            return;
        }

        const success = await signup(email, password);
        if (success) navigate('/login');
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                <div className="signup-header">
                    <div className="icon-wrapper">
                        <Scissors className="w-8 h-8 text-maroon-900" />
                    </div>
                    <h2 className="signup-title">Daftar Akun</h2>
                    <p className="signup-subtitle">Mulai pendekkan link Anda sekarang</p>
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

                    <div>
                        <label className="input-label">Konfirmasi Password</label>
                        <input
                            type="password"
                            required
                            placeholder="Ulangi password Anda"
                            className="form-input"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn-primary">
                        Daftar
                    </button>
                </form>

                <div className="signup-footer">
                    <span className="text-gray-600">Sudah punya akun? </span>
                    <Link to="/login" className="link-text">
                        Login disini
                    </Link>
                </div>
            </div>
        </div>
    );
}
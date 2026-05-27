import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Scissors } from 'lucide-react';
import toast from 'react-hot-toast';

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
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 relative overflow-hidden">
            {/* Background decorative blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-maroon-100/50 rounded-full blur-3xl mix-blend-multiply"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-maroon-200/30 rounded-full blur-3xl mix-blend-multiply"></div>
            </div>

            <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100 z-10 relative">
                <div className="text-center mb-8">
                    <div className="bg-maroon-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm border border-maroon-100">
                        <Scissors className="w-8 h-8 text-maroon-900" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Daftar Akun</h2>
                    <p className="text-slate-500 mt-2 text-sm">Mulai pendekkan link Anda sekarang</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-maroon-900/20 focus:border-maroon-900 transition-colors"
                            placeholder="nama@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-maroon-900/20 focus:border-maroon-900 transition-colors"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Konfirmasi Password</label>
                        <input
                            type="password"
                            required
                            placeholder="Ulangi password Anda"
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-maroon-900/20 focus:border-maroon-900 transition-colors"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="w-full mt-2 flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-maroon-900 hover:bg-maroon-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maroon-900 transition-all active:scale-[0.98]">
                        Daftar
                    </button>
                </form>

                <div className="mt-8 text-center text-sm">
                    <span className="text-slate-500">Sudah punya akun? </span>
                    <Link to="/login" className="font-semibold text-maroon-900 hover:text-maroon-700 transition-colors">
                        Login disini
                    </Link>
                </div>
            </div>
        </div>
    );
}
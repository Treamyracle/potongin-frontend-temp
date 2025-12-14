import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Scissors } from 'lucide-react';
import toast from 'react-hot-toast'; // Import toast untuk notifikasi error

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // State baru
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validasi Password
        if (password !== confirmPassword) {
            toast.error('Password dan Konfirmasi Password tidak cocok!');
            return;
        }

        if (password.length < 6) {
            toast.error('Password minimal 6 karakter');
            return;
        }

        // Jika valid, panggil fungsi signup (hanya email & password yang dikirim)
        const success = await signup(email, password);
        if (success) navigate('/login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border-t-4 border-maroon-900">
                <div className="text-center mb-8">
                    <div className="bg-maroon-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Scissors className="w-8 h-8 text-maroon-900" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Daftar Akun</h2>
                    <p className="text-gray-500 mt-2">Mulai pendekkan link Anda sekarang</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-maroon-900 focus:border-maroon-900"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-maroon-900 focus:border-maroon-900"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {/* Konfirmasi Password (BARU) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Konfirmasi Password</label>
                        <input
                            type="password"
                            required
                            placeholder="Ulangi password Anda"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-maroon-900 focus:border-maroon-900"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-maroon-900 hover:bg-maroon-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maroon-900 transition"
                    >
                        Daftar
                    </button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <span className="text-gray-600">Sudah punya akun? </span>
                    <Link to="/login" className="font-medium text-maroon-900 hover:text-maroon-700">
                        Login disini
                    </Link>
                </div>
            </div>
        </div>
    );
}
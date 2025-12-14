import axios from 'axios';

// Sesuaikan dengan URL backend Go Anda
const BASE_URL = 'https://potong.in/'; 

const api = axios.create({
    baseURL: BASE_URL,
});

// Otomatis pasang Token jika ada
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const API_URL = BASE_URL; // Export untuk keperluan URL gambar QR
export default api;
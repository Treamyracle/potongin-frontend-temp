import { useState, useEffect } from "react";
import api, { API_URL } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  Plus,
  Copy,
  Trash2,
  Edit2,
  QrCode,
  ExternalLink,
  X,
  Scissors,
  LogOut,
} from "lucide-react";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [links, setLinks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(null); // Menyimpan short_code untuk QR
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Form State
  const [originalUrl, setOriginalUrl] = useState("");
  const [customCode, setCustomCode] = useState("");

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const { data } = await api.get("/api/v1/links");
      setLinks(data);
    } catch (error) {
      console.error("Gagal ambil link", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // --- PERUBAHAN DI SINI ---
        // Kirim original_url DAN custom_code
        await api.put(`/api/v1/links/${currentId}`, {
          original_url: originalUrl,
          custom_code: customCode, // Backend sekarang menerima ini
        });
        toast.success("Link berhasil diupdate");
        // -------------------------
      } else {
        const payload = { original_url: originalUrl };
        if (customCode) payload.custom_code = customCode;

        await api.post("/api/v1/links", payload);
        toast.success("Link berhasil dibuat");
      }
      closeModal();
      fetchLinks();
    } catch (error) {
      toast.error(error.response?.data?.error || "Terjadi kesalahan");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus link ini?")) return;
    try {
      await api.delete(`/api/v1/links/${id}`);
      toast.success("Link dihapus");
      fetchLinks();
    } catch (error) {
      toast.error("Gagal menghapus");
    }
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setOriginalUrl("");
    setCustomCode("");
    setShowModal(true);
  };

  const openEditModal = (link) => {
    setIsEditing(true);
    setCurrentId(link.ID);
    setOriginalUrl(link.original_url);
    setCustomCode(link.short_code); // Pastikan ini mengisi state agar muncul di input form
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
  };

  const copyToClipboard = (shortCode) => {
    const fullUrl = `https://potong.in/${shortCode}`; // Sesuaikan domain production nanti
    navigator.clipboard.writeText(fullUrl);
    toast.success("Link disalin!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-maroon-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <Scissors className="w-6 h-6" />
              <span className="font-bold text-xl">Potong.in</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm opacity-90 hidden sm:block">
                Halo, {user?.email}
              </span>
              <button
                onClick={logout}
                className="p-2 hover:bg-maroon-800 rounded-full transition"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Link</h1>
            <p className="text-gray-500 text-sm mt-1">
              Kelola link pendek dan pantau statistik Anda.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center space-x-2 bg-maroon-900 text-white px-4 py-2 rounded-lg hover:bg-maroon-800 transition shadow-md"
          >
            <Plus className="w-5 h-5" />
            <span>Buat Link Baru</span>
          </button>
        </div>

        {/* List Links */}
        {links.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <div className="bg-maroon-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Scissors className="w-8 h-8 text-maroon-900 opacity-50" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              Belum ada link
            </h3>
            <p className="text-gray-500 mt-2">
              Buat link pendek pertama Anda sekarang.
            </p>
          </div>
        ) : (
          // ... kode sebelumnya (di dalam return) ...

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {links.map((link) => (
              <div
                key={link.ID}
                className="bg-white rounded-xl shadow hover:shadow-md transition p-5 border border-gray-100 flex flex-col justify-between h-full"
              >
                <div>
                  {/* --- BAGIAN YANG DIPERBAIKI --- */}
                  <div className="flex justify-between items-center mb-2 gap-3">
                    <div className="flex items-center space-x-2 min-w-0 overflow-hidden">
                      <span
                        className="font-bold text-maroon-900 text-lg truncate block"
                        title={link.short_code}
                      >
                        /{link.short_code}
                      </span>
                      <button
                        onClick={() => copyToClipboard(link.short_code)}
                        className="text-gray-400 hover:text-maroon-900 flex-shrink-0"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full flex-shrink-0 whitespace-nowrap">
                      {link.clicks} Klik
                    </span>
                  </div>
                  {/* --- SELESAI PERBAIKAN --- */}

                  <p className="text-gray-500 text-sm truncate mb-4 flex items-center">
                    <ExternalLink className="w-3 h-3 mr-1 flex-shrink-0" />
                    <a
                      href={link.original_url}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline truncate"
                    >
                      {link.original_url}
                    </a>
                  </p>
                </div>

                <div className="flex justify-end border-t pt-4 space-x-2">
                  <button
                    onClick={() => setShowQRModal(link.short_code)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg tooltip"
                    title="Lihat QR Code"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openEditModal(link)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Edit Link"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(link.ID)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Hapus Link"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          // ... kode selanjutnya ...
        )}
      </main>

      {/* Modal Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-maroon-900 px-6 py-4 flex justify-between items-center">
              <h3 className="text-white font-bold">
                {isEditing ? "Edit Link" : "Buat Link Baru"}
              </h3>
              <button
                onClick={closeModal}
                className="text-white opacity-80 hover:opacity-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* ... kode sebelumnya ... */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL Asli (Panjang)
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://contoh-website-panjang.com/blabla"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-maroon-900 focus:border-maroon-900 outline-none"
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                />
              </div>

              {/* --- PERBAIKAN: HAPUS '{!isEditing &&' DI SINI AGAR MUNCUL SAAT EDIT --- */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Custom Code{" "}
                  <span className="text-gray-400 font-normal">(Opsional)</span>
                </label>
                <div className="flex items-center">
                  <span className="bg-gray-100 border border-r-0 border-gray-300 px-3 py-2 rounded-l-lg text-gray-500 text-sm">
                    potong.in/
                  </span>
                  <input
                    type="text"
                    placeholder="diskon-ramadhan"
                    className="w-full px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-maroon-900 focus:border-maroon-900 outline-none"
                    value={customCode}
                    onChange={(e) => setCustomCode(e.target.value)}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {isEditing
                    ? "Mengubah kode akan membuat link lama tidak berfungsi."
                    : "Biarkan kosong untuk kode acak."}
                </p>
              </div>
              {/* --------------------------------------------------------------------- */}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-maroon-900 text-white py-2 rounded-lg hover:bg-maroon-800 transition font-medium"
                >
                  {isEditing ? "Simpan Perubahan" : "Potong Sekarang"}
                </button>
              </div>
            </form>
            {/* ... kode setelahnya ... */}
          </div>
        </div>
      )}

      {/* Modal QR Code */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm text-center relative">
            <button
              onClick={() => setShowQRModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-gray-900 mb-4">QR Code</h3>
            <div className="flex justify-center mb-4 border p-4 rounded-lg bg-white">
              {/* Menggunakan URL API backend langsung untuk QR Image */}
              <img
                src={`${API_URL}/qr/${showQRModal}`}
                alt="QR Code"
                className="w-48 h-48 object-contain"
              />
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Scan untuk membuka link:{" "}
              <span className="font-semibold text-maroon-900">
                potong.in/{showQRModal}
              </span>
            </p>
            <button
              onClick={() => setShowQRModal(null)}
              className="text-sm text-gray-500 hover:underline"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

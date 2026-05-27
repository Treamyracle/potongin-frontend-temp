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
  BarChart2,
} from "lucide-react";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [links, setLinks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(null); 
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Form State
  const [originalUrl, setOriginalUrl] = useState("");
  const [customCode, setCustomCode] = useState("");

  const fetchLinks = async () => {
    try {
      const { data } = await api.get("/api/v1/links");
      setLinks(data);
    } catch (error) {
      console.error("Gagal ambil link", error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    fetchLinks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/api/v1/links/${currentId}`, {
          original_url: originalUrl,
          custom_code: customCode,
        });
        toast.success("Link berhasil diupdate");
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
    if (!window.confirm("Yakin ingin menghapus link ini?")) return;
    try {
      await api.delete(`/api/v1/links/${id}`);
      toast.success("Link dihapus");
      fetchLinks();
    } catch {
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
    setCustomCode(link.short_code);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
  };

  const copyToClipboard = (shortCode) => {
    const fullUrl = `https://potong.in/${shortCode}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success("Link disalin!");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      {/* Floating Navbar */}
      <div className="fixed top-4 left-4 right-4 z-40 max-w-7xl mx-auto">
        <nav className="bg-white/80 backdrop-blur-md border border-slate-200/60 shadow-sm shadow-slate-200/50 rounded-2xl px-6 py-3 flex justify-between items-center transition-all">
          <div className="flex items-center space-x-3">
            <div className="bg-maroon-900 text-white p-1.5 rounded-lg shadow-sm">
                <Scissors className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-800">Potong.in</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex flex-col text-right mr-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Account</span>
              <span className="text-sm font-medium text-slate-800">{user?.email}</span>
            </div>
            <button 
              onClick={logout} 
              className="p-2 text-slate-500 hover:text-maroon-900 hover:bg-maroon-50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-maroon-900/20"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </nav>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard Link</h1>
            <p className="text-slate-500 mt-2 text-base">
              Kelola link pendek dan pantau statistik performa Anda.
            </p>
          </div>
          <button 
            onClick={openCreateModal} 
            className="group flex items-center justify-center space-x-2 bg-maroon-900 text-white px-5 py-2.5 rounded-xl shadow-md hover:bg-maroon-800 hover:shadow-lg hover:-translate-y-0.5 transition-all w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maroon-900 active:scale-95"
          >
            <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
            <span className="font-semibold">Buat Link Baru</span>
          </button>
        </div>

        {/* List Links */}
        {links.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center flex flex-col items-center justify-center">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mb-5 border border-slate-100">
              <Scissors className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              Belum ada link yang dipotong
            </h3>
            <p className="text-slate-500 max-w-md mx-auto mb-6">
              Mulai buat link pendek kustom pertama Anda agar lebih mudah dibagikan ke pengguna lain.
            </p>
            <button 
                onClick={openCreateModal} 
                className="flex items-center space-x-2 bg-white text-maroon-900 border border-maroon-200 px-4 py-2 rounded-lg hover:bg-maroon-50 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-maroon-900/20"
            >
                <Plus className="w-4 h-4" />
                <span>Buat Link Sekarang</span>
            </button>
          </div>
        ) : (
          <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {links.map((link) => (
              <div key={link.ID} className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-maroon-200 shadow-sm hover:shadow-md transition-all group flex flex-col h-full">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-3 gap-3">
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <a href={`https://potong.in/${link.short_code}`} target="_blank" rel="noreferrer" className="font-bold text-maroon-900 text-lg tracking-tight truncate hover:underline">
                        /{link.short_code}
                      </a>
                      <button
                        onClick={() => copyToClipboard(link.short_code)}
                        className="text-slate-400 hover:text-maroon-900 p-1 rounded-md hover:bg-maroon-50 transition-colors flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-maroon-900/20"
                        title="Copy short link"
                        aria-label="Copy short link"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="bg-blue-50 text-blue-700 border border-blue-100 text-xs px-2.5 py-1 rounded-full font-semibold flex items-center space-x-1 whitespace-nowrap">
                        <BarChart2 className="w-3 h-3" />
                        <span>{link.clicks} Klik</span>
                    </div>
                  </div>

                  <div className="text-slate-500 text-sm truncate flex items-center mb-5 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                    <ExternalLink className="w-3.5 h-3.5 mr-2 flex-shrink-0 text-slate-400" />
                    <a
                      href={link.original_url}
                      target="_blank"
                      rel="noreferrer"
                      className="truncate hover:text-maroon-900 hover:underline transition-colors"
                      title={link.original_url}
                    >
                      {link.original_url}
                    </a>
                  </div>
                </div>

                <div className="flex justify-end border-t border-slate-100 pt-4 space-x-1.5 opacity-100 sm:opacity-70 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setShowQRModal(link.short_code)}
                    className="p-2 text-slate-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-900/20"
                    title="Lihat QR Code"
                    aria-label="QR Code"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openEditModal(link)}
                    className="p-2 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                    title="Edit Link"
                    aria-label="Edit Link"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(link.ID)}
                    className="p-2 text-slate-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-900/20"
                    title="Hapus Link"
                    aria-label="Hapus Link"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all scale-100 border border-slate-200">
            <div className="border-b border-slate-100 px-6 py-4 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-slate-800 font-bold text-lg">
                {isEditing ? "Edit Link" : "Buat Link Baru"}
              </h3>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400/20"
                aria-label="Tutup modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-white">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  URL Asli (Panjang)
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://contoh-website-panjang.com/blabla"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-maroon-900/20 focus:border-maroon-900 transition-colors placeholder:text-slate-400"
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-semibold text-slate-700">
                    Custom Code
                  </label>
                  <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Opsional</span>
                </div>
                <div className="flex items-stretch">
                  <span className="bg-slate-50 border border-r-0 border-slate-200 px-4 py-2.5 rounded-l-xl text-slate-500 text-sm font-medium flex items-center">
                    potong.in/
                  </span>
                  <input
                    type="text"
                    placeholder="diskon-ramadhan"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-r-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-maroon-900/20 focus:border-maroon-900 transition-colors placeholder:text-slate-400"
                    value={customCode}
                    onChange={(e) => setCustomCode(e.target.value)}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2 flex items-start">
                  {isEditing ? (
                    <><span className="text-orange-500 mr-1.5 text-sm leading-none">•</span> Mengubah kode akan membuat link lama tidak berfungsi.</>
                  ) : (
                    <><span className="text-blue-500 mr-1.5 text-sm leading-none">•</span> Biarkan kosong untuk generate kode pendek acak.</>
                  )}
                </p>
              </div>

              <div className="pt-4 mt-2 border-t border-slate-100 flex justify-end space-x-3">
                <button 
                    type="button" 
                    onClick={closeModal} 
                    className="px-5 py-2.5 rounded-xl font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200"
                >
                    Batal
                </button>
                <button type="submit" className="px-5 py-2.5 bg-maroon-900 text-white rounded-xl hover:bg-maroon-800 transition-colors font-medium shadow-sm flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maroon-900">
                  {isEditing ? "Simpan Perubahan" : "Potong Sekarang"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal QR Code */}
      {showQRModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm text-center relative border border-slate-100">
            <button
              onClick={() => setShowQRModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200"
              aria-label="Tutup modal QR"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="bg-maroon-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-6 h-6 text-maroon-900" />
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 mb-6">Scan QR Code</h3>
            
            <div className="flex justify-center mb-6 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm mx-auto w-fit">
              <img
                src={`${API_URL}/qr/${showQRModal}`}
                alt={`QR Code untuk potong.in/${showQRModal}`}
                className="w-48 h-48 object-contain rounded-xl"
              />
            </div>
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Link Tujuan</p>
                <p className="font-bold text-maroon-900 text-lg">
                  potong.in/{showQRModal}
                </p>
            </div>
            
            <button
              onClick={() => copyToClipboard(showQRModal)}
              className="w-full py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-slate-200"
            >
              <Copy className="w-4 h-4" />
              <span>Salin Link</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
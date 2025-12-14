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
import "./css/Dashboard.css"; // Import the new CSS file

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
    <div className="dashboard-wrapper">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-content">
            <div className="logo-area">
              <Scissors className="w-6 h-6" />
              <span className="font-bold text-xl">Potong.in</span>
            </div>
            <div className="user-area">
              <span className="text-sm opacity-90 hidden sm:block">
                Halo, {user?.email}
              </span>
              <button onClick={logout} className="logout-btn">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="main-container">
        {/* Header Section */}
        <div className="content-header">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Link</h1>
            <p className="text-gray-500 text-sm mt-1">
              Kelola link pendek dan pantau statistik Anda.
            </p>
          </div>
          <button onClick={openCreateModal} className="btn-create-link">
            <Plus className="w-5 h-5" />
            <span>Buat Link Baru</span>
          </button>
        </div>

        {/* List Links */}
        {links.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon-wrapper">
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
          <div className="links-grid">
            {links.map((link) => (
              <div key={link.ID} className="link-card">
                <div>
                  <div className="link-header">
                    <div className="link-title-wrapper">
                      <span className="short-code-text" title={link.short_code}>
                        /{link.short_code}
                      </span>
                      <button
                        onClick={() => copyToClipboard(link.short_code)}
                        className="text-gray-400 hover:text-maroon-900 flex-shrink-0"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="click-badge">
                      {link.clicks} Klik
                    </span>
                  </div>

                  <p className="original-url-wrapper">
                    <ExternalLink className="w-3 h-3 mr-1 flex-shrink-0" />
                    <a
                      href={link.original_url}
                      target="_blank"
                      rel="noreferrer"
                      className="url-link"
                    >
                      {link.original_url}
                    </a>
                  </p>
                </div>

                <div className="card-actions">
                  <button
                    onClick={() => setShowQRModal(link.short_code)}
                    className="btn-icon btn-icon-gray tooltip"
                    title="Lihat QR Code"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openEditModal(link)}
                    className="btn-icon btn-icon-blue"
                    title="Edit Link"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(link.ID)}
                    className="btn-icon btn-icon-red"
                    title="Hapus Link"
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
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
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
            <form onSubmit={handleSubmit} className="modal-form">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL Asli (Panjang)
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://contoh-website-panjang.com/blabla"
                  className="modal-input"
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Custom Code{" "}
                  <span className="text-gray-400 font-normal">(Opsional)</span>
                </label>
                <div className="custom-code-wrapper">
                  <span className="custom-code-prefix">
                    potong.in/
                  </span>
                  <input
                    type="text"
                    placeholder="diskon-ramadhan"
                    className="custom-code-input"
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

              <div className="pt-2">
                <button type="submit" className="btn-submit">
                  {isEditing ? "Simpan Perubahan" : "Potong Sekarang"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal QR Code */}
      {showQRModal && (
        <div className="qr-modal-overlay">
          <div className="qr-modal-box">
            <button
              onClick={() => setShowQRModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-gray-900 mb-4">QR Code</h3>
            <div className="qr-image-wrapper">
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
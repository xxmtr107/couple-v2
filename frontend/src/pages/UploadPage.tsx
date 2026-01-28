import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Hãy chọn file");
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      setError("File lớn hơn 100MB");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      await axiosClient.post("/media/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/");
    } catch {
      setError("Upload lỗi");
    }
  };

  return (
    <div className="page upload-page">
      <header className="top-bar">
        <h2>Upload kỷ niệm 💖</h2>
        <Link to="/" className="btn ghost">
          ← Gallery
        </Link>
      </header>

      <form className="upload-card" onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button type="submit" className="btn">
          Upload
        </button>
      </form>
    </div>
  );
}


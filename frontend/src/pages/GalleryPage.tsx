import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";

type Media = {
  id: number;
  fileName: string;
  type: "PHOTO" | "VIDEO";
  originalName: string;
  contentType: string;
};

export default function GalleryPage() {
  const [media, setMedia] = useState<Media[]>([]);
  const [filter, setFilter] = useState<"ALL" | "PHOTO" | "VIDEO">("ALL");

  const loadMedia = async (type?: string) => {
    const params: any = {};
    if (type && type !== "ALL") params.type = type;
    const res = await axiosClient.get<Media[]>("/media", { params });
    setMedia(res.data);
  };

  useEffect(() => {
    loadMedia(filter);
  }, [filter]);

  const handleDownload = (id: number) => {
    window.location.href = `http://localhost:8080/api/media/${id}/download`;
  };

  const handleDelete = async (id: number) => {
    await axiosClient.delete(`/media/${id}`);
    loadMedia(filter);
  };

  return (
    <div className="page">
      <header className="top-bar">
        <h2>Our Memories ✨</h2>
        <div>
          <Link to="/upload" className="btn">
            Upload
          </Link>
          <button
            className="btn ghost"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <div className="filters">
        {["ALL", "PHOTO", "VIDEO"].map((t) => (
          <button
            key={t}
            className={filter === t ? "chip active" : "chip"}
            onClick={() => setFilter(t as any)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="media-grid">
        {media.map((m) => (
          <div className="media-card" key={m.id}>
            {m.type === "PHOTO" ? (
              <img
                src={`http://localhost:8080/uploads/${m.fileName}`}
                alt={m.originalName}
              />
            ) : (
              <video controls>
                <source
                  src={`http://localhost:8080/uploads/${m.fileName}`}
                  type={m.contentType}
                />
              </video>
            )}
            <div className="media-actions">
              <span className="name">{m.originalName}</span>
              <div>
                <button className="small" onClick={() => handleDownload(m.id)}>
                  Download
                </button>
                <button
                  className="small danger"
                  onClick={() => handleDelete(m.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {media.length === 0 && (
          <p className="empty">Chưa có kỷ niệm nào, hãy upload nhé 💖</p>
        )}
      </div>
    </div>
  );
}


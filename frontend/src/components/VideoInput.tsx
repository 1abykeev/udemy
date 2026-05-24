"use client";

import { useState, useRef } from "react";

export default function VideoInput({ defaultValue, chapterId }: { defaultValue?: string; chapterId: string }) {
  const [mode, setMode] = useState<"url" | "file">("url");
  const [urlValue, setUrlValue] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string>("");
  const [error, setError] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    setUploadedUrl("");

    const fd = new FormData();
    fd.append("file", file);
    fd.append("chapterId", chapterId);

    try {
      const res = await fetch("/api/upload/video", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Ошибка загрузки");
      setUploadedUrl(data.url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      {/* Toggle */}
      <div className="flex bg-gray-100 rounded-lg p-1 mb-3 w-fit">
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
            mode === "url" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          По ссылке
        </button>
        <button
          type="button"
          onClick={() => setMode("file")}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
            mode === "file" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Загрузить файл
        </button>
      </div>

      {mode === "url" ? (
        <div>
          <input
            name="videoUrl"
            type="url"
            value={urlValue}
            onChange={(e) => setUrlValue(e.target.value)}
            placeholder="https://example.com/video.mp4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#a435f0] focus:ring-1 focus:ring-[#a435f0]"
          />
          <p className="text-xs text-gray-400 mt-1">YouTube ссылки (youtube.com/watch?v=...) и прямые MP4 ссылки</p>
        </div>
      ) : (
        <div>
          {/* Hidden field carries the uploaded URL into the Server Action form */}
          <input type="hidden" name="videoUrl" value={uploadedUrl || defaultValue || ""} />

          <input
            ref={fileRef}
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#a435f0] file:text-white hover:file:bg-[#8710d8] cursor-pointer disabled:opacity-50"
          />

          {uploading && (
            <p className="text-xs text-[#a435f0] mt-2">Загрузка видео, подождите...</p>
          )}
          {uploadedUrl && (
            <p className="text-xs text-green-600 mt-2">✓ Видео загружено успешно</p>
          )}
          {error && (
            <p className="text-xs text-red-500 mt-2">{error}</p>
          )}
          {defaultValue && !uploadedUrl && (
            <p className="text-xs text-gray-500 mt-1">Текущее видео сохранится если не выбрать новый файл</p>
          )}
          <p className="text-xs text-gray-400 mt-1">MP4, MOV, AVI — максимум 1 ГБ</p>
        </div>
      )}
    </div>
  );
}

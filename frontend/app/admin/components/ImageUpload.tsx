"use client";

import { useCallback, useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import Image from "next/image";

interface Props {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
}

export default function ImageUpload({
  value,
  onChange,
  folder = "images",
  label = "Upload Image",
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Only image files are allowed");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("File must be under 10MB");
        return;
      }

      setError("");
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/upload/image`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("kronus_admin_token")}`,
            },
            body: formData,
          },
        );

        if (!res.ok) throw new Error("Upload failed");
        const json = await res.json();
        onChange(json.data?.url ?? "");
      } catch {
        setError("Upload failed. Try again.");
      } finally {
        setUploading(false);
      }
    },
    [folder, onChange],
  );

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) upload(file);
    e.target.value = "";
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {value ? (
        <div className="relative group w-full h-48 rounded-lg overflow-hidden border border-gray-200">
          <Image
            src={value}
            alt="Uploaded"
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
            <button
              type="button"
              title="Replace image"
              onClick={() => inputRef.current?.click()}
              className="bg-white text-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-50"
            >
              Replace
            </button>
            <button
              type="button"
              title="Remove image"
              onClick={() => onChange("")}
              className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-700"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-2 w-full h-48 rounded-lg border-2 border-dashed cursor-pointer transition ${
            dragOver
              ? "border-teal bg-teal/5"
              : "border-gray-300 hover:border-gray-400 bg-gray-50"
          }`}
        >
          {uploading ? (
            <Loader2 size={24} className="text-teal animate-spin" />
          ) : (
            <>
              <Upload size={24} className="text-gray-400" />
              <span className="text-sm text-gray-500">
                Drop image here or click to browse
              </span>
              <span className="text-xs text-gray-400">
                JPEG, PNG, WebP — max 10MB
              </span>
            </>
          )}
        </div>
      )}

      {/* URL fallback input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste image URL…"
        className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-xs text-gray-600 focus:ring-2 focus:ring-teal focus:border-teal outline-none"
      />

      {error && <p className="text-xs text-red-500">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        title="Select File"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}

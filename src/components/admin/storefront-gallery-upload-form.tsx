"use client";

import { useRef, useState } from "react";
import { UploadButton, UploadThumb, type UploadPreview } from "@/components/admin/upload-thumbnail";

const MAX_STOREFRONT_GALLERY_IMAGE_SIZE_MB = 4;
const MAX_FILE_SIZE =
  MAX_STOREFRONT_GALLERY_IMAGE_SIZE_MB * 1024 * 1024;

export function StorefrontGalleryUploadForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<UploadPreview | null>(null);

  function resetUpload() {
    setPreview(null);
    formRef.current?.reset();
    if (inputRef.current) inputRef.current.value = "";
  }

  function upload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = formRef.current;
    if (!form) return;

    const formData = new FormData(form);
    const file = formData.get("file");

    if (!(file instanceof File) || file.size === 0) {
      setMessage("Choose an image to upload.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setMessage(
        `Image must be ${MAX_STOREFRONT_GALLERY_IMAGE_SIZE_MB} MB or smaller.`,
      );
      return;
    }

    const request = new XMLHttpRequest();
    request.open("POST", "/api/admin/gallery");
    setIsUploading(true);
    setMessage("");

    request.upload.onprogress = (progressEvent) => {
      if (!progressEvent.lengthComputable) return;
      const progress = Math.round(
        (progressEvent.loaded / progressEvent.total) * 100,
      );
      setPreview((current) =>
        current ? { ...current, progress, complete: progress === 100 } : current,
      );
    };

    request.onload = () => {
      setIsUploading(false);
      if (request.status >= 200 && request.status < 400) {
        window.location.reload();
        return;
      }
      setMessage(request.responseText || "Upload failed.");
    };

    request.onerror = () => {
      setIsUploading(false);
      setMessage("Upload failed.");
    };

    request.send(formData);
  }

  return (
    <form
      action="/api/admin/gallery"
      className="grid gap-4 border-b border-[#ece7df] p-4 md:grid-cols-[1fr_1fr_auto]"
      encType="multipart/form-data"
      method="post"
      onSubmit={upload}
      ref={formRef}
    >
      <label className="grid gap-2 text-xs font-semibold uppercase text-[#81796f]">
        Add image
        <UploadButton
          disabled={Boolean(preview) || isUploading}
          inputRef={inputRef}
          name="file"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            if (file.size > MAX_FILE_SIZE) {
              setMessage(
                `Image must be ${MAX_STOREFRONT_GALLERY_IMAGE_SIZE_MB} MB or smaller.`,
              );
              event.target.value = "";
              return;
            }
            setMessage("");
            setPreview({
              id: `${file.name}-${file.lastModified}`,
              name: file.name,
              url: URL.createObjectURL(file),
              progress: 0,
              complete: false,
            });
          }}
        >
          {preview ? "Image selected" : "Choose image"}
        </UploadButton>
        <span className="text-[0.65rem] text-[#9a9288]">
          Max {MAX_STOREFRONT_GALLERY_IMAGE_SIZE_MB} MB
        </span>
      </label>
      <label className="grid gap-2 text-xs font-semibold uppercase text-[#81796f]">
        Alt text
        <input className="admin-input" name="alt_text" />
      </label>
      <div className="flex flex-col items-start gap-3">
        <button
          className="admin-action w-fit px-4 py-2.5 text-sm disabled:opacity-50"
          disabled={isUploading}
          type="submit"
        >
          {isUploading ? "Uploading..." : "Upload image"}
        </button>
        {message ? <p className="text-sm font-semibold text-red-500">{message}</p> : null}
      </div>
      {preview ? (
        <div className="md:col-span-3">
          <UploadThumb item={preview} onRemove={resetUpload} />
        </div>
      ) : null}
    </form>
  );
}

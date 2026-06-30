"use client";

import { useRef, useState } from "react";
import { cropImageFileToSquare, setInputFiles } from "@/components/admin/image-cropper";
import { UploadButton, UploadThumb, type UploadPreview } from "@/components/admin/upload-thumbnail";

const MAX_FILE_SIZE_MB = 3;
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

export function ProductImageUploadForm({
  action,
}: {
  action: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<UploadPreview | null>(null);

  async function prepareFile(file: File) {
    const croppedFile = await cropImageFileToSquare(file);

    if (croppedFile.size > MAX_FILE_SIZE) {
      setMessage(`Cropped image must be ${MAX_FILE_SIZE_MB} MB or smaller. Please upload a different image.`);
      if (inputRef.current) inputRef.current.value = "";
      return null;
    }

    if (inputRef.current) setInputFiles(inputRef.current, [croppedFile]);
    setMessage("");
    setPreview({
      id: `${croppedFile.name}-${croppedFile.lastModified}`,
      name: croppedFile.name,
      url: URL.createObjectURL(croppedFile),
      progress: 0,
      complete: false,
    });

    return croppedFile;
  }

  function upload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = formRef.current;
    if (!form) return;

    const formData = new FormData(form);
    const file = formData.get("file");

    if (file instanceof File && file.size > MAX_FILE_SIZE) {
      setMessage(`Image must be ${MAX_FILE_SIZE_MB} MB or smaller. Please upload a different image.`);
      return;
    }

    if (file instanceof File) {
      setPreview({
        id: `${file.name}-${file.lastModified}`,
        name: file.name,
        url: URL.createObjectURL(file),
        progress: 0,
        complete: false,
      });
    }

    const request = new XMLHttpRequest();
    request.open("POST", action);
    setIsUploading(true);
    setMessage("");
    setProgress(0);

    request.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      const nextProgress = Math.round((event.loaded / event.total) * 100);
      setProgress(nextProgress);
      setPreview((current) =>
        current ? { ...current, progress: nextProgress, complete: nextProgress === 100 } : current,
      );
    };

    request.onload = () => {
      setIsUploading(false);
      if (request.status >= 200 && request.status < 400) {
        setProgress(100);
        setPreview((current) => (current ? { ...current, progress: 100, complete: true } : current));
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
      action={action}
      className="grid gap-4 md:grid-cols-[1fr_1fr_auto]"
      encType="multipart/form-data"
      method="post"
      onSubmit={upload}
      ref={formRef}
    >
      <label className="grid gap-2 text-xs font-semibold uppercase text-[#81796f]">
        Upload image
        <UploadButton
          disabled={Boolean(preview) || isUploading}
          inputRef={inputRef}
          name="file"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            if (file.size > MAX_FILE_SIZE) {
              setMessage(`Image must be ${MAX_FILE_SIZE_MB} MB or smaller. Please upload a different image.`);
              event.target.value = "";
              return;
            }
            await prepareFile(file);
          }}
        >
          {preview ? "Image selected" : "Choose image"}
        </UploadButton>
        <span className="text-[0.65rem] text-[#9a9288]">Max {MAX_FILE_SIZE_MB} MB</span>
      </label>
      <label className="grid gap-2 text-xs font-semibold uppercase text-[#81796f]">
        Alt text
        <input className="admin-input" name="alt_text" />
      </label>
      <label className="grid gap-2 text-xs font-semibold uppercase text-[#81796f]">
        Sort order
        <input className="admin-input" defaultValue="0" name="sort_order" />
      </label>
      <div className="space-y-2 md:col-span-3">
        <button
          className="admin-action w-fit px-4 py-2.5 text-sm disabled:opacity-50"
          disabled={isUploading}
          type="submit"
        >
          {isUploading ? "Uploading..." : "Add image"}
        </button>
        {isUploading ? (
          <p className="text-xs font-semibold text-[#81796f]">Uploading {progress}%</p>
        ) : null}
        {preview ? (
          <UploadThumb
            item={preview}
            onRemove={() => {
              setPreview(null);
              formRef.current?.reset();
              if (inputRef.current) inputRef.current.value = "";
            }}
          />
        ) : null}
        {message ? <p className="text-sm text-red-500">{message}</p> : null}
      </div>
    </form>
  );
}

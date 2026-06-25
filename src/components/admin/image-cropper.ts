"use client";

const CROP_SIZE = 1200;

export async function cropImageFileToSquare(file: File) {
  const image = await loadImage(file);
  const canvas = document.createElement("canvas");
  const size = Math.min(image.naturalWidth, image.naturalHeight);
  const sourceX = Math.max(0, (image.naturalWidth - size) / 2);
  const sourceY = Math.max(0, (image.naturalHeight - size) / 2);
  const outputSize = Math.min(CROP_SIZE, size);
  const context = canvas.getContext("2d");

  if (!context) return file;

  canvas.width = outputSize;
  canvas.height = outputSize;
  context.drawImage(
    image,
    sourceX,
    sourceY,
    size,
    size,
    0,
    0,
    outputSize,
    outputSize,
  );

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, getOutputType(file), 0.9);
  });

  if (!blob) return file;

  return new File([blob], file.name, {
    lastModified: Date.now(),
    type: blob.type || file.type,
  });
}

export async function cropImageFilesToSquare(files: File[]) {
  return Promise.all(files.map((file) => cropImageFileToSquare(file)));
}

export function setInputFiles(input: HTMLInputElement, files: File[]) {
  const transfer = new DataTransfer();
  files.forEach((file) => transfer.items.add(file));
  input.files = transfer.files;
}

function getOutputType(file: File) {
  return file.type === "image/png" || file.type === "image/webp"
    ? file.type
    : "image/jpeg";
}

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new window.Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Image could not be loaded."));
    };
    image.src = url;
  });
}

"use client";

import { useCallback, useRef, useState } from "react";
import clsx from "clsx";
import { Loader2, UploadCloud, X } from "lucide-react";
import Image from "next/image";

import { ALLOWED_IMAGE_TYPES, MAX_GALLERY_IMAGES, MAX_UPLOAD_SIZE_BYTES, formatBytes } from "@/lib/uploads";

interface ImageUploadFieldProps {
  label: string;
  description?: string;
  value: string[];
  onChange: (urls: string[]) => void;
  primaryValue?: string | null;
  onPrimaryChange?: (url: string | null) => void;
}

const ACCEPT_LABEL = "image/png,image/jpeg,image/webp,image/gif,image/avif";

export function ImageUploadField({
  label,
  description,
  value,
  onChange,
  primaryValue,
  onPrimaryChange,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetPrimaryIfNeeded = useCallback(
    (next: string[]) => {
      if (!onPrimaryChange) {
        return;
      }
      if (next.length === 0) {
        onPrimaryChange(null);
        return;
      }
      if (!primaryValue || !next.includes(primaryValue)) {
        onPrimaryChange(next[0]);
      }
    },
    [onPrimaryChange, primaryValue],
  );

  const handleUploaded = useCallback(
    (urls: string[]) => {
      if (!urls.length) {
        return;
      }
      const next = [...value, ...urls];
      onChange(next);
      resetPrimaryIfNeeded(next);
    },
    [onChange, resetPrimaryIfNeeded, value],
  );

  const performUpload = useCallback(
    async (files: FileList | File[] | null) => {
      if (!files || files.length === 0) {
        return;
      }

      const allowedSlots = MAX_GALLERY_IMAGES - value.length;
      if (allowedSlots <= 0) {
        setError(`You can upload up to ${MAX_GALLERY_IMAGES} images.`);
        return;
      }

      const queue = Array.from(files).slice(0, allowedSlots);
      const errors: string[] = [];
      const uploadedUrls: string[] = [];

      setIsUploading(true);
      setError(null);

      for (const file of queue) {
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
          errors.push(`"${file.name}" has an unsupported file type.`);
          continue;
        }
        if (file.size > MAX_UPLOAD_SIZE_BYTES) {
          errors.push(`"${file.name}" exceeds ${formatBytes(MAX_UPLOAD_SIZE_BYTES)}.`);
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
          const response = await fetch("/api/uploads", {
            method: "POST",
            body: formData,
            credentials: "include",
          });
          const payload = await response
            .json()
            .catch(() => ({ error: "Unexpected response from the server." }));

          if (!response.ok || !payload?.url) {
            throw new Error(payload?.error ?? "Failed to upload file.");
          }

          uploadedUrls.push(payload.url);
        } catch (uploadError) {
          errors.push(
            uploadError instanceof Error ? uploadError.message : "Failed to upload file.",
          );
        }
      }

      handleUploaded(uploadedUrls);
      setIsUploading(false);

      if (errors.length) {
        setError(errors[0]);
      }
    },
    [value.length, handleUploaded],
  );

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragActive(false);
      if (event.dataTransfer?.files?.length) {
        void performUpload(event.dataTransfer.files);
      }
    },
    [performUpload],
  );

  const onInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      void performUpload(event.target.files);
      event.target.value = "";
    },
    [performUpload],
  );

  const removeImage = (url: string) => {
    const next = value.filter((item) => item !== url);
    onChange(next);
    resetPrimaryIfNeeded(next);
  };

  return (
    <div className="space-y-3 text-sm text-white/70">
      <div>
        <span className="block text-xs font-medium uppercase tracking-[0.18em] text-white/50">
          {label}
        </span>
        {description ? <p className="mt-1 text-xs text-white/45">{description}</p> : null}
        <p className="mt-1 text-xs text-white/40">
          Formats: JPG, PNG, WEBP, GIF, AVIF · up to {formatBytes(MAX_UPLOAD_SIZE_BYTES)} per file · max{" "}
          {MAX_GALLERY_IMAGES} images.
        </p>
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragActive(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setIsDragActive(false);
        }}
        onDrop={onDrop}
        className={clsx(
          "flex h-36 flex-col items-center justify-center gap-2 rounded-[32px] border-2 border-dashed px-6 text-center transition",
          isDragActive ? "border-brand-primary bg-brand-primary/5" : "border-white/20 bg-black/20",
        )}
      >
        {isUploading ? (
          <div className="flex items-center gap-2 text-white">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-xs uppercase tracking-[0.2em] text-white/70">Uploading…</span>
          </div>
        ) : (
          <>
            <UploadCloud className="h-6 w-6 text-white/60" />
            <div className="text-xs text-white/65">
              <strong className="font-semibold text-white">Drag & drop</strong> images here{" "}
              <span className="text-white/50">or click to browse</span>
            </div>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_LABEL}
          multiple
          className="hidden"
          onChange={onInputChange}
        />
      </div>

      {error ? <p className="text-xs text-red-400">{error}</p> : null}

      {value.length ? (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {value.map((url) => {
            const isPrimary = primaryValue === url;
            return (
              <figure
                key={url}
                className="group relative h-48 overflow-hidden rounded-3xl border border-white/15 bg-black/40"
              >
                <Image
                  src={url}
                  alt="Uploaded vehicle photo"
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition group-hover:opacity-100" />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    type="button"
                    aria-label="Remove image"
                    onClick={() => removeImage(url)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white/80 backdrop-blur transition hover:border-white/40 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <figcaption className="absolute bottom-2 left-2 right-2 flex items-center justify-between rounded-full border border-white/15 bg-black/50 px-3 py-1 text-xs text-white/75 backdrop-blur">
                  <span className={clsx("font-medium", isPrimary ? "text-brand-primary" : "text-white/70")}>
                    {isPrimary ? "Cover photo" : "Gallery photo"}
                  </span>
                  {!isPrimary && onPrimaryChange ? (
                    <button
                      type="button"
                      onClick={() => onPrimaryChange?.(url)}
                      className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70 transition hover:text-white"
                    >
                      Set as cover
                    </button>
                  ) : null}
                </figcaption>
              </figure>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

"use client";

import type { ChangeEvent } from "react";

import { PlusIcon } from "@/components/icons/plus/plus";
import { XIcon } from "@/components/icons/x/x";

import {
  REGISTER_LOG_ACCEPTED_IMAGE_TYPE_INPUT,
  REGISTER_LOG_MAX_IMAGE_COUNT,
  REGISTER_LOG_MAX_IMAGE_SIZE_BYTES,
} from "./registerLog.constants";
import type { RegisterLogImagePreview } from "./registerLog.types";

interface RegisterLogImagePickerProps {
  errorMessage: string | null;
  images: RegisterLogImagePreview[];
  onAddImages: (files: FileList) => void;
  onRemoveImage: (imageId: string) => void;
}

export function RegisterLogImagePicker({
  errorMessage,
  images,
  onAddImages,
  onRemoveImage,
}: RegisterLogImagePickerProps) {
  const hasImages = images.length > 0;
  const canAddMore = images.length < REGISTER_LOG_MAX_IMAGE_COUNT;

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files?.length) {
      onAddImages(event.target.files);
    }

    event.target.value = "";
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="mb-1.5 ml-1 text-xs font-bold uppercase text-fg-faint">
            사진
          </p>
          <p className="ml-1 text-xs text-fg-dim">
            JPG, PNG, WEBP 파일을 최대 {REGISTER_LOG_MAX_IMAGE_COUNT}장까지
            첨부할 수 있습니다. 장당 최대{" "}
            {formatFileSize(REGISTER_LOG_MAX_IMAGE_SIZE_BYTES)}입니다.
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-surface-muted px-2.5 py-1 text-[10px] font-semibold text-fg-muted">
          {images.length}/{REGISTER_LOG_MAX_IMAGE_COUNT}
        </span>
      </div>

      <label
        className={`flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-line bg-surface-muted px-4 py-5 text-center transition-colors ${
          canAddMore
            ? "hover:border-brand-border hover:bg-surface-card"
            : "cursor-not-allowed opacity-60"
        }`}
      >
        <input
          accept={REGISTER_LOG_ACCEPTED_IMAGE_TYPE_INPUT}
          className="sr-only"
          disabled={!canAddMore}
          multiple
          onChange={handleFileChange}
          type="file"
        />
        <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-surface text-brand-fg">
          <PlusIcon className="h-5 w-5" />
        </span>
        <span className="text-sm font-semibold text-fg">
          {canAddMore ? "사진 추가" : "사진 첨부 완료"}
        </span>
        <span className="mt-1 text-xs text-fg-muted">
          {canAddMore
            ? "현장 사진이나 조과 사진을 선택하세요."
            : "최대 장수에 도달했습니다."}
        </span>
      </label>

      {errorMessage ? (
        <p className="ml-1 text-xs font-medium text-red-400" role="alert">
          {errorMessage}
        </p>
      ) : null}

      {hasImages ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((image) => (
            <li
              className="group relative overflow-hidden rounded-xl border border-line bg-surface-muted"
              key={image.id}
            >
              <div
                aria-label={image.file.name}
                className="h-28 bg-cover bg-center"
                role="img"
                style={{ backgroundImage: `url(${image.previewUrl})` }}
              />
              <div className="min-w-0 border-t border-line-muted bg-surface-card px-2.5 py-2">
                <p className="truncate text-[11px] font-semibold text-fg">
                  {image.file.name}
                </p>
                <p className="mt-0.5 text-[10px] text-fg-muted">
                  {formatFileSize(image.file.size)}
                </p>
              </div>
              <button
                aria-label={`${image.file.name} 삭제`}
                className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-950/70 text-white shadow-sm transition-colors hover:bg-slate-950"
                onClick={() => onRemoveImage(image.id)}
                type="button"
              >
                <XIcon className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))}KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)}MB`;
}

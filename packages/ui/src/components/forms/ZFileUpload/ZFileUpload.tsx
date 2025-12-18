/**
 * ZFileUpload - Drag and drop file upload component
 */

import React, {
  useState,
  useRef,
  useCallback,
  DragEvent,
  ChangeEvent,
} from "react";
import styles from "./ZFileUpload.module.css";

export type FileWithPreview = File & {
  preview?: string;
};

export type ZFileUploadProps = {
  /** Called when files are selected */
  onFilesChange: (files: FileWithPreview[]) => void;
  /** Current files */
  files?: FileWithPreview[];
  /** Accepted file types (e.g., "image/*", ".pdf,.doc") */
  accept?: string;
  /** Allow multiple files */
  multiple?: boolean;
  /** Maximum file size in bytes */
  maxSize?: number;
  /** Maximum number of files */
  maxFiles?: number;
  /** Disable upload */
  disabled?: boolean;
  /** Show file previews */
  showPreview?: boolean;
  /** Custom upload text */
  uploadText?: string;
  /** Additional class name */
  className?: string;
  /** Called on upload error */
  onError?: (error: string) => void;
};

export function ZFileUpload({
  onFilesChange,
  files = [],
  accept,
  multiple = false,
  maxSize,
  maxFiles = 10,
  disabled = false,
  showPreview = true,
  uploadText = "Drag files here or click to upload",
  className,
  onError,
}: ZFileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback(
    (file: File): string | undefined => {
      if (maxSize && file.size > maxSize) {
        return `File "${file.name}" exceeds maximum size of ${formatBytes(
          maxSize
        )}`;
      }

      if (accept) {
        const acceptedTypes = accept.split(",").map((t) => t.trim());
        const fileType = file.type;
        const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;

        const isAccepted = acceptedTypes.some((type) => {
          if (type.startsWith(".")) {
            return fileExtension === type.toLowerCase();
          }
          if (type.endsWith("/*")) {
            return fileType.startsWith(type.replace("/*", "/"));
          }
          return fileType === type;
        });

        if (!isAccepted) {
          return `File "${file.name}" is not an accepted file type`;
        }
      }

      return undefined;
    },
    [accept, maxSize]
  );

  const processFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || disabled) return;

      const newFiles: FileWithPreview[] = [];
      const errors: string[] = [];

      Array.from(fileList).forEach((file) => {
        const error = validateFile(file);
        if (error) {
          errors.push(error);
        } else {
          const fileWithPreview = file as FileWithPreview;
          if (file.type.startsWith("image/")) {
            fileWithPreview.preview = URL.createObjectURL(file);
          }
          newFiles.push(fileWithPreview);
        }
      });

      if (errors.length > 0) {
        onError?.(errors.join("\n"));
      }

      if (newFiles.length > 0) {
        const combined = multiple ? [...files, ...newFiles] : newFiles;
        const limited = combined.slice(0, maxFiles);
        onFilesChange(limited);
      }
    },
    [disabled, files, maxFiles, multiple, onError, onFilesChange, validateFile]
  );

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleRemoveFile = (index: number) => {
    const fileToRemove = files[index];
    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  return (
    <div className={`${styles.container} ${className || ""}`}>
      <div
        className={`${styles.dropzone} ${isDragging ? styles.dragging : ""} ${
          disabled ? styles.disabled : ""
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
        aria-label="File upload area"
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          disabled={disabled}
          className={styles.input}
          aria-hidden="true"
        />

        <div className={styles.content}>
          <div className={styles.icon}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <p className={styles.text}>{uploadText}</p>
          {accept && (
            <p className={styles.hint}>
              Accepted: {accept}
              {maxSize && ` • Max size: ${formatBytes(maxSize)}`}
            </p>
          )}
        </div>
      </div>

      {showPreview && files.length > 0 && (
        <ul className={styles.fileList} role="list">
          {files.map((file, index) => (
            <li key={`${file.name}-${index}`} className={styles.fileItem}>
              {file.preview ? (
                <img
                  src={file.preview}
                  alt={file.name}
                  className={styles.preview}
                />
              ) : (
                <div className={styles.fileIcon}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
              )}
              <div className={styles.fileInfo}>
                <span className={styles.fileName}>{file.name}</span>
                <span className={styles.fileSize}>
                  {formatBytes(file.size)}
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile(index);
                }}
                className={styles.removeButton}
                aria-label={`Remove ${file.name}`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default ZFileUpload;

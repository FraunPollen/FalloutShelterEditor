import { useState, forwardRef, useImperativeHandle, useRef } from "react";

export interface FileDropZoneHandle {
  /** Clears both the native input value and the displayed filename. */
  reset: () => void;
}

interface FileDropZoneProps {
  label: string;
  accept?: string;
  onFileSelected: (file: File | null) => void;
}

/**
 * Native <input type="file"> elements are famously resistant to being
 * cleared: setting `input.value = ""` clears the underlying selection, but
 * plenty of browser/OS combinations still leave the last-selected filename
 * displayed. The reliable fix in React is to remount the input entirely by
 * changing its `key` — a fresh DOM node has no stale display state to clear.
 */
export const FileDropZone = forwardRef<FileDropZoneHandle, FileDropZoneProps>(
  ({ label, accept, onFileSelected }, ref) => {
    const [inputKey, setInputKey] = useState(0);
    const [_, setFileName] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      reset: () => {
        setFileName(null);
        setInputKey((k) => k + 1); // remount -> guaranteed-blank input
        onFileSelected(null);
      },
    }));

    return (
      <label className="field field--file">
        <span>{label}</span>
        <input
          key={inputKey}
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={(e) => {
            const file = e.target.files?.[0] ?? null;
            setFileName(file?.name ?? null);
            onFileSelected(file);
          }}
        />
      </label>
    );
  },
);

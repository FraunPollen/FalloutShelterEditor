import sjcl from "../vendor/sjcl-core.js";
import type { SaveData } from "../types/save";

// Same key/iv the original sjcl.js defined as globals. Kept here as the
// default, but overridable via FileEncryptorOptions — the constructor no
// longer silently ignores a caller-supplied key/iv (bug fixed during the
// vanilla-JS review).
const DEFAULT_KEY = [
  2815074099, 1725469378, 4039046167, 874293617, 3063605751, 3133984764,
  4097598161, 3620741625,
];
// sjcl's hex codec isn't in our minimal ambient module (we only declared the
// pieces we use). Decode the IV hex string ourselves instead of widening the
// ambient types for one one-time conversion.
function hexToBits(hex: string): number[] {
  const bytes = hex.match(/.{1,8}/g) ?? [];
  return bytes.map((word) => parseInt(word.padEnd(8, "0"), 16) | 0);
}
const DEFAULT_IV_BITS = hexToBits("7475383967656A693334307438397532");

export interface FileEncryptorOptions {
  key?: number[];
  iv?: number[];
  maxFileSize?: number; // bytes
}

export class FileEncryptor {
  private key: number[];
  private iv: number[];
  private maxFileSize: number;

  constructor(options: FileEncryptorOptions = {}) {
    this.key = options.key ?? DEFAULT_KEY;
    this.iv = options.iv ?? DEFAULT_IV_BITS;
    this.maxFileSize = options.maxFileSize ?? 30 * 1024 * 1024; // 30MB default
  }

  private validateFile(file: File): void {
    if (!file) throw new Error("No file provided");
    if (file.size > this.maxFileSize) {
      throw new Error(
        `File exceeds maximum size of ${Math.round(this.maxFileSize / 1024 / 1024)}MB`,
      );
    }
  }

  private readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target?.result as string);
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  }

  private decryptContent(base64Str: string): SaveData {
    try {
      const cipherBits = sjcl.codec.base64.toBits(base64Str);
      const prp = new sjcl.cipher.aes(this.key);
      const plainBits = sjcl.mode.cbc.decrypt(prp, cipherBits, this.iv);
      const jsonStr = sjcl.codec.utf8String.fromBits(plainBits);
      return JSON.parse(jsonStr) as SaveData;
    } catch (error) {
      throw new Error(`Decryption failed: ${(error as Error).message}`);
    }
  }

  private encryptContent(data: SaveData): string {
    try {
      // Always stringify a real object here — the original bug that inflated
      // file size on every round trip was caused by a caller passing an
      // already-stringified (and often pretty-printed) blob through this
      // method, double-encoding it. Typing the parameter as SaveData instead
      // of `string | object` makes that mistake a compile error now.
      const compactJsonStr = JSON.stringify(data);
      const plainBits = sjcl.codec.utf8String.toBits(compactJsonStr);
      const prp = new sjcl.cipher.aes(this.key);
      const cipherBits = sjcl.mode.cbc.encrypt(prp, plainBits, this.iv);
      return sjcl.codec.base64.fromBits(cipherBits);
    } catch (error) {
      throw new Error(`Encryption failed: ${(error as Error).message}`);
    }
  }

  private downloadBlob(
    content: string,
    filename: string,
    mimeType: string,
  ): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  private generateFilename(
    originalName: string,
    operation: "encrypt" | "decrypt",
  ): string {
    if (operation === "decrypt") {
      return originalName.replace(/\.(sav|sv2)$/i, ".json");
    }
    // Falls back to appending .sv2 if the source name has neither extension,
    // instead of silently leaving the original extension in place.
    const hasKnownExt = /\.(txt|json)$/i.test(originalName);
    const base = hasKnownExt
      ? originalName.replace(/\.(txt|json)$/i, "")
      : originalName;
    return `${base}.sv2`;
  }

  async decryptToObject(file: File): Promise<SaveData> {
    this.validateFile(file);
    const content = await this.readFileAsText(file);
    return this.decryptContent(content);
  }

  async decrypt(file: File): Promise<void> {
    const data = await this.decryptToObject(file);
    const prettyJson = JSON.stringify(data, null, 2);
    this.downloadBlob(
      prettyJson,
      this.generateFilename(file.name, "decrypt"),
      "application/json",
    );
  }

  async encryptObject(filename: string, data: SaveData): Promise<void> {
    const encryptedContent = this.encryptContent(data);
    this.downloadBlob(
      encryptedContent,
      this.generateFilename(filename, "encrypt"),
      "text/plain",
    );
  }
}

const defaultEncryptor = new FileEncryptor();

/** Matches the signature App.tsx already assumes — drop-in for the earlier stub. */
export function decryptFile(file: File): Promise<SaveData> {
  return defaultEncryptor.decryptToObject(file);
}

/** Matches the signature App.tsx already assumes — drop-in for the earlier stub. */
export function encryptAndDownload(
  data: SaveData,
  originalFileName: string,
): Promise<void> {
  return defaultEncryptor.encryptObject(originalFileName, data);
}

/** Downloads any JSON-serializable value as a pretty-printed .json file. */
export function downloadJson(data: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/** Reads a .json File and parses it as a SaveData — for the standalone "encrypt this JSON" tool. */
export function readJsonFile(file: File): Promise<SaveData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        resolve(JSON.parse(event.target?.result as string) as SaveData);
      } catch (err) {
        reject(new Error(`Invalid JSON: ${(err as Error).message}`));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}

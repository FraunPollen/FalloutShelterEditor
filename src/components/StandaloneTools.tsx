import { useState } from "react";
import { FileDropZone } from "./FileDropZone";
import {
  decryptFile,
  readJsonFile,
  encryptAndDownload,
  downloadJson,
} from "../crypto/fileEncryptor";

/**
 * Retained from the original app: a way to decrypt/encrypt without going
 * through the edit form at all, and the iOS save-retrieval steps (iOS
 * saves live inside the app's iCloud container, not a browsable folder,
 * so there's no simple "drag the file over" step like PC/Android).
 */
export function StandaloneTools() {
  const [status, setStatus] = useState("");

  async function handleDecryptOnly(file: File | null) {
    if (!file) return;
    try {
      const data = await decryptFile(file);
      downloadJson(data, file.name.replace(/\.(sav|sv2)$/i, ".json"));
      setStatus(`Decrypted ${file.name}`);
    } catch (err) {
      setStatus(`Decrypt failed: ${(err as Error).message}`);
    }
  }

  async function handleEncryptOnly(file: File | null) {
    if (!file) return;
    try {
      const data = await readJsonFile(file);
      await encryptAndDownload(data, file.name.replace(/\.json$/i, ""));
      setStatus(`Encrypted ${file.name}`);
    } catch (err) {
      setStatus(`Encrypt failed: ${(err as Error).message}`);
    }
  }

  return (
    <details className="standalone-tools">
      <summary>Instructions &amp; Standalone decrypt/encrypt</summary>

      <div className="tools-grid">
        <FileDropZone
          label="Decrypt .sv2 → .json"
          accept=".sv2"
          onFileSelected={handleDecryptOnly}
        />
        <FileDropZone
          label="Encrypt .json → .sv2"
          accept=".json"
          onFileSelected={handleEncryptOnly}
        />
      </div>
      {status && <p className="status-line">{status}</p>}

      <h3>Retrieving your save on iPhone</h3>
      <ol>
        <li>Save your vault to iCloud from within Fallout Shelter.</li>
        <li>
          On a Mac, retrieve the .sv2 file via Terminal:
          <br />
          <code>
            open ~/Library/Mobile\ Documents/iCloud~com~bethsoft~falloutshelter
          </code>
        </li>
        <li>
          Copy the vault file to Downloads (and keep it as a backup — this
          editor never modifies the file you load, only what you download).
        </li>
        <li>
          In Fallout Shelter, uncheck the iCloud option next to your save slot
          and delete the local save.
        </li>
        <li>
          Load the .sv2 above, make your changes, and download the updated file.
        </li>
        <li>
          Copy the new file into the iCloud folder and wait for the upload to
          complete.
        </li>
        <li>
          Back in Fallout Shelter, check the iCloud icon next to the matching
          save slot. If it doesn't load right away, the iCloud upload probably
          isn't finished yet — wait ~30 seconds and try again.
        </li>
      </ol>
    </details>
  );
}

class FileEncryptor {
    constructor(options = {}) {
        this.key = key;
        this.iv = iv;
        this.maxFileSize = options.maxFileSize || 30 * 1024 * 1024; // 30MB default
    }

    /**
     * Validate file before processing
     * @param {File} file - File to validate
     * @throws {Error} If file is invalid
     */
    validateFile(file) {
        if (!file) {
            throw new Error('No file provided');
        }

        if (file.size > this.maxFileSize) {
            throw new Error(`File exceeds maximum size of ${Math.round(this.maxFileSize / 1024 / 1024)}MB`);
        }
    }

    /**
     * Read file as text
     * @param {File} file - File to read
     * @returns {Promise<string>} File content as string
     */
    readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (event) => resolve(event.target.result);
            reader.onerror = () => reject(new Error('Failed to read file'));
            
            reader.readAsText(file);
        });
    }

    /**
     * Validate JSON string
     * @param {string} jsonStr - JSON string to validate
     * @returns {Object} Parsed JSON object
     * @throws {Error} If JSON is invalid
     */
    validateJSON(jsonStr) {
        try {
            return JSON.parse(jsonStr);
        } catch (error) {
            throw new Error(`Invalid JSON format: ${error.message}`);
        }
    }

    /**
     * Create and download a blob file
     * @param {string} content - File content
     * @param {string} filename - Target filename
     * @param {string} mimeType - MIME type for the blob
     */
    downloadBlob(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        saveAs(blob, filename);
    }

    /**
     * Generate output filename based on operation
     * @param {string} originalName - Original filename
     * @param {string} operation - 'encrypt' or 'decrypt'
     * @returns {string} New filename
     */
    generateFilename(originalName, operation) {
        if (operation === 'decrypt') {
            return originalName.replace(/\.(sav|sv2)$/i, '.json');
        } else {
            return originalName
                .replace(/\.(txt|json)$/i, '.sv2');
        }
    }

    /**
     * Decrypt base64 encoded content
     * @param {string} base64Str - Base64 encoded encrypted content
     * @returns {string} Decrypted JSON string
     * @throws {Error} If decryption fails
     */
    decryptContent(base64Str) {
        try {
            const cipherBits = sjcl.codec.base64.toBits(base64Str);
            const prp = new sjcl.cipher.aes(this.key);
            const plainBits = sjcl.mode.cbc.decrypt(prp, cipherBits, this.iv);
            const jsonStr = sjcl.codec.utf8String.fromBits(plainBits);
            
            // Validate the decrypted content is valid JSON
            this.validateJSON(jsonStr);
            
            return jsonStr;
        } catch (error) {
            throw new Error(`Decryption failed: ${error.message}`);
        }
    }

    /**
     * Encrypt JSON content
     * @param {object} json - JSON string to encrypt
     * @returns {string} Base64 encoded encrypted content
     * @throws {Error} If encryption fails
     */
    encryptContent(json) {
        try {
            const compactJsonStr = JSON.stringify(json);
            const plainBits = sjcl.codec.utf8String.toBits(compactJsonStr);
            const prp = new sjcl.cipher.aes(this.key);
            const cipherBits = sjcl.mode.cbc.encrypt(prp, plainBits, this.iv);
            
            return sjcl.codec.base64.fromBits(cipherBits);
        } catch (error) {
            throw new Error(`Encryption failed: ${error.message}`);
        }
    }

    /**
     * Decrypt a save file and trigger download
     * @param {File} file - Save file to decrypt
     */
    async decrypt(file) {
        const jsonObj = await this.decryptToObject(file);
        const prettyJson = JSON.stringify(jsonObj, null, 2);
        const filename = this.generateFilename(file.name, 'decrypt');
        this.downloadBlob(prettyJson, filename, 'application/json');
    }

    /**
     * Saves provided JSON to file
     * @param {object} data - JSON object to export
     * @param {string} filename - Name of file to save
     */
    saveJsonToFile(data, filename) {
        const prettyJson = JSON.stringify(data, null, 2);
        const newFilename = this.generateFilename(filename, 'decrypt');
        this.downloadBlob(prettyJson, newFilename, 'application/json');
    }

    /**
     * Decrypt a save file and trigger download
     * @param {File} file - Save file to decrypt
     * @returns {Promise<string>} Decrypted JSON content
     */
    async decryptToObject(file) {
        this.validateFile(file);
        const content = await this.readFileAsText(file);
        const decryptedContent = this.decryptContent(content);
        return JSON.parse(decryptedContent);
    }

    /**
     * Encrypt a JSON file and trigger download
     * @param {string} filename - name of original file
     * @param {object} data - JSON object to encrypt
     * @returns {Promise<string>} Encrypted content
     */
    async encryptObject(filename, data) {
        const encryptedContent = this.encryptContent(data); 
        const newFilename = this.generateFilename(filename, 'encrypt');
        this.downloadBlob(encryptedContent, newFilename, 'text/plain');
    }

    /**
     * Encrypt a JSON file and trigger download
     * @param {File} file - JSON file to encrypt
     */
    async encrypt(file) {
        this.validateFile(file);
        const content = await this.readFileAsText(file);
        await this.encryptObject(file.name, content)
    }
}

// Usage example:
// const encryptor = new FileEncryptor();
// 
// // To decrypt a file
// const decryptedContent = await encryptor.decrypt(saveFile);
// 
// // To encrypt a file  
// const encryptedContent = await encryptor.encrypt(jsonFile);
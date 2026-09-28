declare module "*sjcl-core.js" {
  type BitArray = number[];

  namespace codec {
    namespace base64 {
      function toBits(input: string): BitArray;
      function fromBits(bits: BitArray): string;
    }
    namespace utf8String {
      function toBits(input: string): BitArray;
      function fromBits(bits: BitArray): string;
    }
  }

  namespace cipher {
    class aes {
      constructor(key: BitArray);
    }
  }

  namespace mode {
    namespace cbc {
      function encrypt(
        prp: cipher.aes,
        plaintext: BitArray,
        iv: BitArray,
      ): BitArray;
      function decrypt(
        prp: cipher.aes,
        ciphertext: BitArray,
        iv: BitArray,
      ): BitArray;
    }
  }

  const sjcl: { codec: typeof codec; cipher: typeof cipher; mode: typeof mode };
  export default sjcl;
}

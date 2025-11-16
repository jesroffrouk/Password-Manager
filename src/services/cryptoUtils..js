// utils function
function toBase64(bytes) {
  return btoa(String.fromCharCode(...bytes));
}
function FromBase64(str){
      return Uint8Array.from(atob(str), c => c.charCodeAt(0));
  }

const deriveAESkey = async(salt, Masterkey) => {
    const enc = new TextEncoder();
    const passwordBuffer = enc.encode(Masterkey);
    // Import the password as a base key for PBKDF2
    const baseKey = await crypto.subtle.importKey(
    "raw",
    passwordBuffer,
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
    );

    // 4. Derive a 256-bit AES-GCM key using PBKDF2 with SHA-256
    const derivedKey = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt,
        iterations: 300_000, // use a large number for security
        hash: "SHA-256",
      },
      baseKey,
      { name: "AES-GCM", length: 256 },
      false, // extractable (set false if you want it locked)
      ["encrypt", "decrypt"]
    );
    return derivedKey
}

// encryption and decryption process 

export const encryption = async(PlainText,Masterkey) => {
    const enc = new TextEncoder()
    const rawSalt = crypto.getRandomValues(new Uint8Array(16))
    const rawIv = crypto.getRandomValues(new Uint8Array(12))
    console.log(Masterkey)
    const key = await deriveAESkey(rawSalt,Masterkey)
    const rawCipherText = await crypto.subtle.encrypt({name: 'AES-GCM',iv:rawIv},key,enc.encode(PlainText))
    //  return salt , iv and cyphertext to store themn 
    let Base64Salt = toBase64(rawSalt)
    let Base64Iv = toBase64(rawIv)
    let Base64CipherText = toBase64(new Uint8Array(rawCipherText))
    return {cipherText:Base64CipherText,salt:Base64Salt,iv:Base64Iv} 
}

export const decryption = async(Base64CipherText,Base64Salt,Base64Iv,Masterkey) => {
    try {
      const rawCipherText = FromBase64(Base64CipherText);
      const rawSalt = FromBase64(Base64Salt);
      const rawIv = FromBase64(Base64Iv);

      const key = await deriveAESkey(rawSalt,Masterkey);

      const decryptedBuffer = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv:rawIv },
        key,
        rawCipherText
      );

      const dec = new TextDecoder();
     // return decrypted text to user
      let decryptedText = dec.decode(decryptedBuffer)
      return decryptedText
    } catch (err) {
      console.error("Decryption failed:", err);
      window.dispatchEvent(new CustomEvent('error-handle',{detail: {message: "Decryption Failed. Try again."}}))
    }
}
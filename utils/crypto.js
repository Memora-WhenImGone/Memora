import sodium from "libsodium-wrappers";

let sodiumReady = false;

async function getSodium() {
  if (!sodiumReady) {
    await sodium.ready;
    sodiumReady = true;
  }
  return sodium;
}

async function decodeBase64(b64) {
  const s = await getSodium();
  return s.from_base64(b64, s.base64_variants.ORIGINAL);
}

async function encodeBase64(bytes) {
  const s = await getSodium();
  return s.to_base64(bytes, s.base64_variants.ORIGINAL);
}

export async function generateVaultDEK() {
  const s = await getSodium();
  return s.randombytes_buf(s.crypto_secretbox_KEYBYTES);
}

export async function wrapEncryptionKey(vaultDEK) {
  const s = await getSodium();
  const kekB64 = process.env.VAULT_KEK_B64;

  if (!kekB64) {
    throw new Error("VAULT_KEK_B64 not set");
  }

  const keyEncryptionKey = await decodeBase64(kekB64);

  if (keyEncryptionKey.length !== s.crypto_secretbox_KEYBYTES) {
    throw new Error("Vault KEK MUST BE 32 bits");
  }

  const nonce = s.randombytes_buf(s.crypto_secretbox_NONCEBYTES);
  const encrypted = s.crypto_secretbox_easy(vaultDEK, nonce, keyEncryptionKey);
  const nonceB64 = await encodeBase64(nonce);
  const encryptedB64 = await encodeBase64(encrypted);

  return nonceB64 + "." + encryptedB64;
}

export async function unwrapEncryptionKey(wrapped) {
  const s = await getSodium();
  const kekB64 = process.env.VAULT_KEK_B64;

  if (!kekB64) {
    throw new Error("VAULT_KEK_B64 is not set");
  }

  const keyEncryptionKey = await decodeBase64(kekB64);

  if (keyEncryptionKey.length !== s.crypto_secretbox_KEYBYTES) {
    throw new Error("Vault KEK MUST BE 32 bits");
  }

  const wrappedStr = String(wrapped || "");
  const parts = wrappedStr.split(".");
  const nonceB64 = parts[0];
  const cipherB64 = parts[1];

  if (!nonceB64 || !cipherB64) {
    throw new Error("Invalid wrapped key format, can't separatre");
  }

  const nonce = await decodeBase64(nonceB64);
  const ciphertext = await decodeBase64(cipherB64);
  const dek = s.crypto_secretbox_open_easy(ciphertext, nonce, keyEncryptionKey);

  return dek;
}

export async function sealForPublicKey(bytes, publicKeyB64) {
  const s = await getSodium();
  const pk = await decodeBase64(publicKeyB64);
  const sealed = s.crypto_box_seal(bytes, pk);
  return encodeBase64(sealed);
}

export async function generateContactKeyPair() {
  const s = await getSodium();
  const keypair = s.crypto_box_keypair();
  const publicKey = keypair.publicKey;
  const privateKey = keypair.privateKey;

  return {
    publicKeyB64: await encode(publicKey),
    privateKeyB64: await encode(privateKey),
  };
}

export async function generateFingerprint(publicKeyB64) {
  const s = await getSodium();
  const publicKey = await decode(publicKeyB64);
  const hash = s.crypto_generichash(16, publicKey);
  return encode(hash);
}

export async function encode(bytes) {
  return encodeBase64(bytes);
}

export async function decode(b64) {
  return decodeBase64(b64);
}

export async function encryptDEKForContact(dekBytes, publicKeyB64) {
  const s = await getSodium();
  const pk = await decodeBase64(publicKeyB64);
  const sealed = s.crypto_box_seal(dekBytes, pk);
  return encodeBase64(sealed);
}

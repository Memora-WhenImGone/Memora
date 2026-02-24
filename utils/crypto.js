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

// see how libsodium made it easy to woek with crypto 

// if we use node native crypto library than some one might have died 
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

  return `${await encodeBase64(nonce)}.${await encodeBase64(encrypted)}`;
}


export async function generateContactKeyPair() {
  const s = await getSodium();
  const { publicKey, privateKey } = s.crypto_box_keypair();
  return {
    publicKeyB64: await encode(publicKey),
    privateKeyB64: await encode(privateKey),
  };
}
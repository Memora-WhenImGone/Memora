import sodium from "libsodium-wrappers";

let sodiumReady = false;

async function getSodium() {
  if (!sodiumReady) {
    await sodium.ready;
    sodiumReady = true;
  }
  return sodium;
}

const keyEncryptionKey = process.env.VAULT_KEK_B64; // We encrypt the key with a key that lives on server 

export async function generateVaultDEK() {
  const s = await getSodium();
  return s.randombytes_buf(s.crypto_secretbox_KEYBYTES);
}

async function encode(bytes) {
  const s = await getSodium();
  return s.to_base64(bytes, s.base64_variants.ORIGINAL);
}

// see how libsodium made it easy to woek with crypto 

// if we use node native crypto library than some one might have died 


async function decode(b64) {
  const s = await getSodium();
  return s.from_base64(b64, s.base64_variants.ORIGINAL);
}


export async function wrapDencryptionKey(vaultDencryptionKey) {
  const s = await getSodium();
  const keyEncryptionKey = await decode(keyEncryptionKey);

  const nonce = s.randombytes_buf(s.crypto_secretbox_NONCEBYTES); // nonce is a fancy way of saying a 
  // random maths value

  const encrypted = s.crypto_secretbox_easy(vaultDencryptionKey, nonce, keyEncryptionKey);
  return `${await encode(nonce)}.${await encode(encrypted)}`; // we need strings to store in DB binary value we can but it looks really bad
}
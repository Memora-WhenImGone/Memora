// This is when user is under onboarding 
// /api/trusted-contact-invite 

import { generateVaultDEK, wrapDencryptionKey } from "@/utils/crypto";


export async function POST(request) {
  try {
   
    const auth = await authChecker();
    if (!auth.ok) return auth.response;

    const reqBody = await request.json();

    const {name, contacts = [], trigger } = reqBody;
    if (!name || !trigger) {
      return NextResponse.json({ message: "name and trigger are required" }, { status: 400 });
    }

      const alreadyExists = await Vault.findOne({ owner: auth.uid });
        if (alreadyExists) {
      return NextResponse.json({ message: "Vault already exists" }, { status: 409 });
    }

    // Now we should generate a vault encryption key and wrap it. 

    // Idea is we will encrypt vault with a key and wrap it, than we generate a user public and private key 
    // and use the user key to encrypt the vault key aka Security Class 

    const vaultDencryptionKey = await generateVaultDEK();

    const wrapDencryptionKey = await wrapDencryptionKey(vaultDencryptionKey);

   
  } catch (err) {
    return NextResponse.json({ message: "Failed to create vault" }, { status: 500 });
  }
}
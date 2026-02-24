// This is when user is under onboarding 
// /api/trusted-contact-invite 

import Vault from "@/dataBase/Vault";
import { authChecker } from "@/utils/auth";
import { generateContactKeyPair, generateVaultDEK, wrapEncryptionKey } from "@/utils/crypto";
import { NextResponse } from "next/server";



async function buildContact(contactInfo, vaultDencryptionKey) {


  Console.log(contactInfo);


  const { name, email, relationship } = contactInfo;
  const { publicKeyB64, privateKeyB64 } = await generateContactKeyPair();

  return {
    name,
    email,
    relationship,
    status: "invited",
    invitedAt: new Date(),
    keyVersion: 1,
    keyStatus: "active",
    lastKeySentAt: new Date(),
    publicKey: publicKeyB64,
    keyFingerprint: await generateFingerprint(publicKeyB64),
    encryptedDEK: await encryptDEKForContact(vaultDencryptionKey, publicKeyB64),
   _privateKeyToDeliver: privateKeyB64, // this is not going to Db i will chop it off 
  };
}

function stripPrivateKey(contact) {
  const safe = { ...contact };
  delete safe._privateKeyToDeliver;
  return safe;
}


export async function POST(request) {
  try {
    
    const auth = await authChecker();
    if (!auth.ok) return auth.response;

    const reqBody = await request.json();
    console.log("Boday", reqBody)
    const {name, contacts = [], trigger } = reqBody;
    if (!name || !trigger) {
      return NextResponse.json({ message: "name and trigger are required" }, { status: 400 });
    }

    //   const alreadyExists = await Vault.findOne({ owner: auth.uid });
    //     if (alreadyExists) {
    //   return NextResponse.json({ message: "Vault already exists" }, { status: 409 });
    // }

    // Now we should generate a vault encryption key and wrap it. 

    // Idea is we will encrypt vault with a key and wrap it, than we generate a user public and private key 
    // and use the user key to encrypt the vault key aka Security Class 

    const vaultDencryptionKey = await generateVaultDEK();
    const wrappedDEK = await wrapEncryptionKey(vaultDencryptionKey);



    /// When we run it without await Promise.all map returns <Promise> 
    // its like c# Task.whenall()
  const builtContacts = await Promise.all(
      contacts.map((c) => buildContact(c, vaultDencryptionKey))
    );

 const vault = await Vault.create({
      owner: auth.uid,
      name,
      trigger,
      recoveryStatus: "setup",
      dekWrapped: wrappedDEK,
      dekAlg: "secretbox",
      dekVersion: 1,
      dekCreatedAt: new Date(),
      contacts: builtContacts.map(stripPrivateKey),
    });


 return NextResponse.json(
      {
        message: "Vault created",
        vaultId: vault._id,
        contactsInvited: builtContacts.length,
      },
      { status: 201 }
    );
    
  } catch (err) {
    console.log(err)
    return NextResponse.json({ message: "Failed to create vault" }, { status: 500 });
  }
}

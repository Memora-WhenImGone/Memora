import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Vault from "@/dataBase/Vault";
import { authChecker } from "@/utils/auth";
import {
  generateContactKeyPair,
  generateVaultDEK,
  wrapEncryptionKey,
  generateFingerprint,
  encryptDEKForContact,
} from "@/utils/crypto";

connectToDatabase();

async function buildContact(contactInfo, vaultKey) {
  const name = contactInfo.name;
  const email = contactInfo.email;
  const relationship = contactInfo.relationship;

  const keyPair = await generateContactKeyPair();
  const publicKeyB64 = keyPair.publicKeyB64;
  const privateKeyB64 = keyPair.privateKeyB64;

  const fingerprint = await generateFingerprint(publicKeyB64);
  const encryptedDEK = await encryptDEKForContact(vaultKey, publicKeyB64);

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
    keyFingerprint: fingerprint,
    encryptedDEK: encryptedDEK,
    _privateKeyToDeliver: privateKeyB64,
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

    if (!auth.ok) {
      return auth.response;
    }

    const reqBody = await request.json();

    const name = reqBody.name;
    const trigger = reqBody.trigger;

    let contacts = reqBody.contacts;
    if (!contacts) {
      contacts = [];
    }

    if (!name || !trigger) {
      return NextResponse.json({ message: "name and trigger are required" }, { status: 400 });
    }

    const vaultKey = await generateVaultDEK();
    const wrappedDEK = await wrapEncryptionKey(vaultKey);

    const builtContacts = await Promise.all(
      contacts.map((c) => buildContact(c, vaultKey))
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
    console.log(err);
    return NextResponse.json({ message: "Failed to create vault" }, { status: 500 });
  }
}

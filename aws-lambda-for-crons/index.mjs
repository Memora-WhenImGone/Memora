// This is an aws lambda function which is connected to event bridge 
// that will run this function everyday 
// so we will write the logic to scan the mongodb colelctions
// apply filters on lastactivty and send triggers 

import { MailtrapClient } from "mailtrap";
import crypto from "crypto";
import { MongoClient, ObjectId } from "mongodb";




const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "memora.cloudbybilal.com";
const MAIL_KEY = process.env.MAILTRAP_API_KEY;
const MAIL_FROM = process.env.MAILTRAP_FROM_EMAIL;
const MAIL_NAME = process.env.MAILTRAP_FROM_NAME || "Memora";
const MAIL_SUBJECT = "Your Memora Vault Access";

const URI = process.env.MONGODB_URI;


console.log(URI)


const client = new MongoClient(URI);

let db;
async function connect() {
  if (!db) {
    await client.connect();
    db = client.db();
  }
  return db;
}


async function getVaults() {
  const db = await connect();

  const results = db.collection("vaults").aggregate([
    { $match: { status: "active" } },
    {
      $addFields: {
        cutoff: {
          $dateSubtract: {
            startDate: "$$NOW",
            unit: "day",
            amount: "$trigger.inactivityDays",
          },
        },
      },
    },
    {
      $match: {
        $expr: { $lte: ["$lastActiveAt", "$cutoff"] },
      },
    },
  ]).toArray();



  console.log(results);

  return results;
}


// give me every unique user ID that has 
// been assigned to any active item in this vault
async function getAssignedIds(vaultId) {
  const db = await connect();
  return db.collection("vault_items") // all vault items
  .distinct("assignedTo", // filter only object ids for assignedIds
    {
    vault: new ObjectId(vaultId), // than we filter where vault id is this vaults id
    deletedAt: { $exists: false },
  });
}

function pickContacts(vault, ids) {

  const contacts = vault.contacts;

  const idsWeWant = new Set(ids.map(String));

  console.log(idsWeWant)


  const matchingContacts = contacts.filter((contact) => {
    const contactId = String(contact._id); 
    return idsWeWant.has(contactId);
  });

  return matchingContacts;
}



async function saveAll(vaultId, sessions) {
  const db = await connect();
   await db.collection("contact_sessions").insertMany(sessions.map((s) => s.session));
   await db.collection("vaults").updateOne(
    { _id: new ObjectId(vaultId), status: "active" },
    {
      $set: {
        status: "released",
        releasedAt: new Date(),
      },
    }
  );
}






function makeSessions(vaultId, contacts) {
  return contacts.map((c) => {
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash =crypto.createHash("sha256").update(token).digest("hex"); // remeber hash remains same all the time if input is not change 
    // why : we need it to authorise users.
    const expiry = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);
    return {
      session: { vault: vaultId, contactId: c._id, tokenHash, expiresAt: expiry, createdAt: new Date() },
      link:  `${BASE_URL}/contact/dashboard?token=${token}`,
      email: c.email,
      name: c.name,
    };
  });
}



async function sendAll(mail, sessions, vaultName) {
  for (const session of sessions) {
    await sendOne(mail, session.email, session.link, session.name, vaultName);
  }
}


async function sendOne(mail, to, link, name, vaultName) {
  try {

    await mail.send({
      from: { name: MAIL_NAME, email: MAIL_FROM },
      to: [{ email: to }],
      subject: MAIL_SUBJECT,
      
      text: `Hello ${name}, you have access to "${vaultName}". Use this link within 15 days: ${link}`,
      html: `
        <p>Hello ${name},</p>
        <p>You have access to <strong>${vaultName}</strong>.</p>
        <a href="${link}">Open your vault</a>
      `,
    });

  } catch (e) {
    console.error("Failed to send email", e);
  }
}


export async function handler() {

    await connect();
    const mail = new MailtrapClient({ token: MAIL_KEY });
    const matchingVaults = await getVaults();

    console.log(matchingVaults)

    for(const matchingVault of matchingVaults){
            const Ids = await getAssignedIds(matchingVault._id);
            const contacts = pickContacts(matchingVault, Ids);
           const sessions = makeSessions(matchingVault._id, contacts);
            await saveAll(matchingVault._id, sessions);
            await sendAll(mail, sessions, matchingVault.name);
    }

 return {
    statusCode: 200,
    body: JSON.stringify({"message": "done"}),
    ok: true
  };


     
}
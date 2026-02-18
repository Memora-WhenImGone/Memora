import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import User from "../dataBase/User.js";
import Vault from "../dataBase/Vault.js";
import VaultItem from "../dataBase/VaultItem.js";
import FileModel from "../dataBase/File.js";
import Trigger from "../dataBase/trigger.js";

const MONGODB_URI = process.env.MONGODB_URI;

async function seed() {

  console.log("env",process.env.MONGODB_URI)
  try {
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is missing");
    }

    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing data (for development only)
    await Promise.all([
      User.deleteMany({}),
      Vault.deleteMany({}),
      VaultItem.deleteMany({}),
      FileModel.deleteMany({}),
      Trigger.deleteMany({}),
    ]);

    console.log("Old data cleared");

    // Create User
    const user = await User.create({
      email: "test@memora.com",
      password: "hashedpassword123",
      fullname: "Test User",
    });

    console.log("User created");

    // Create Vault
    const vault = await Vault.create({
      owner: user._id,
      name: "My First Vault",
      contacts: [],
      trigger: {
        inactivityDays: 30,
        warningDays: 7,
      },
      status: "active",
    });

    console.log("Vault created");

    // Create Trigger (TTL example: expires in 1 hour)
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await Trigger.create({
      owner: user._id,
      vault: vault._id,
      inactivityDays: 30,
      warningDays: 7,
      expiresAt,
    });

    console.log("Trigger created (will auto-delete after expiry)");

    // Create Vault Item
    const vaultItem = await VaultItem.create({
      owner: user._id,
      vault: vault._id,
      type: "document",
      title: "My Important Document",
      description: "Seeded vault item",
      tags: ["important", "seed"],
      secret: { note: "This is encrypted content" },
    });

    console.log("VaultItem created");

    // Create File
    await FileModel.create({
      owner: user._id,
      vault: vault._id,
      item: vaultItem._id,
      bucket: "memora-bucket",
      key: "documents/test-file.pdf",
      size: 2048,
      contentType: "application/pdf",
      etag: "123456789abcdef",
      originalName: "test-file.pdf",
    });

    console.log("File created");

    console.log("Database successfully seeded!");
    process.exit(0);

  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seed();

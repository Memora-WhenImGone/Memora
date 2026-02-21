import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    relationship: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "invited", "verified"],
      default: "pending",
    },
    invitedAt: {
      type: Date,
    },
    verifiedAt: {
      type: Date,
    },
    publicKey: {
      type: String,
    },
    keyFingerprint: {
      type: String,
    },
    encryptedDEK: {
      type: String,
    },
    keyVersion: {
      type: Number,
      default: 1,
      min: 1,
    },
    keyStatus: {
      type: String,
      enum: ["active", "revoked"],
      default: "active",
    },
    lastKeySentAt: {
      type: Date,
    },
  },
  { _id: true }
);

const triggerSchema = new Schema(
  {
    inactivityDays: {
      type: Number,
      required: true,
      min: 7,
      max: 365,
    },
    warningDays: {
      type: Number,
      required: true,
      enum: [1, 3, 7, 14, 30],
    },
  },
  { _id: false }
);

const vaultSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    contacts: {
      type: [contactSchema],
      default: [],
    },
    trigger: {
      type: triggerSchema,
      required: true,
    },
    recoveryStatus: {
      type: String,
      enum: ["setup", "ready", "recovering"],
      default: "setup",
    },
    status: {
      type: String,
      enum: ["creation", "active", "released"],
      default: "creation",
    },
    dekWrapped: {
      type: String,
    },
    dekAlg: {
      type: String,
      default: "secretbox",
    },
    dekVersion: {
      type: Number,
      default: 1,
      min: 1,
    },
    dekCreatedAt: {
      type: Date,
    },
    lastActiveAt: {
      type: Date,
      default: Date.now,
    },
    activatedAt: {
      type: Date,
    },
    releasedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

vaultSchema.index({ owner: 1, status: 1 });

const Vault =
  models.Vault || model("Vault", vaultSchema);

export default Vault;
import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: 
    { 
      type: String, 
      required: true 
    },
    email: 
    { type: String, 
      required: true 
    },
    relationship: 
    { type: String, 
      required: true },
    status: 
    { type: String, enum: ["pending", "invited", "verified"], 
      default: "pending" },
    invitedAt: 
    { type: Date },
    verifiedAt: 
    { type: Date },
  },
  { _id: false }
);

const triggerSchema = new mongoose.Schema(
  {
    inactivityDays: { type: Number,
       required: true, 
      min: 7, 
      max: 365 },
    warningDays: { type: Number, 
      required: true, 
      enum: [1, 3, 7, 14, 30] },
  },
  { _id: false } // when you know you know 
);

const vaultSchema = new mongoose.Schema(
  {
    owner: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "user", 
      required: true },
    name: 
    { 
      type: String, 
      required: true },
    contacts: 
    { 
      type: [contactSchema], 
      default: [] },
    trigger: 
    { 
      type: triggerSchema, 
      required: true },
    status: { type: String, enum: ["draft", "active"], default: "draft" },
    lastActiveAt: { type: Date, default: Date.now },
    activatedAt: { type: Date },
  },
  { timestamps: true }
);

const Vault = mongoose.models.vault || mongoose.model("vault", vaultSchema);

export default Vault;


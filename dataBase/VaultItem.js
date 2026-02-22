import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const vaultItemSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    vault: {
      type: Schema.Types.ObjectId,
      ref: "Vault",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["document", "credential", "note"],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    fileIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "File",
      },
    ],
    secret: {
      type: Schema.Types.Mixed,
    },
    assignedTo: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

vaultItemSchema.index({ owner: 1, vault: 1, type: 1, createdAt: -1 });
vaultItemSchema.index({ title: "text", description: "text", tags: "text" });

const VaultItem =
  models.VaultItem || model("VaultItem", vaultItemSchema);

export default VaultItem;
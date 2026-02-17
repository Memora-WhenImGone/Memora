import mongoose from "mongoose";

const vaultItemSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    vault: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "vault",
      required: true,
    },

    type: {
      type: String,
      enum: ["document", "credential", "note"],
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    tags: {
      type: [String],
      default: [],
    },

    fileIds: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "file",
      default: [],
    },

    secret: {
      type: mongoose.Schema.Types.Mixed,
    },

    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);


vaultItemSchema.index({ owner: 1, vault: 1, type: 1, createdAt: -1 });

// Thinking is owner => vault=> type => createdAt Indexes makes things faster.
vaultItemSchema.index({ title: "text", description: "text", tags: "text" });

// good for searches learn more at my youtube channel 
// https://www.youtube.com/watch?si=j-u6c-urJGf1hyC6&v=zcRTz-p_700&feature=youtu.be

vaultItemSchema.index(
  { deletedAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 30 }
);

const VaultItem =
  mongoose.models.vault_item ||
  mongoose.model("vault_item", vaultItemSchema);

export default VaultItem;

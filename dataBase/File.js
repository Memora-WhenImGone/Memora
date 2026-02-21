import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const fileSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },

    vault: {
      type: Schema.Types.ObjectId,
      ref: "vault",
      index: true,
    },

    item: {
      type: Schema.Types.ObjectId,
      ref: "VaultItem",
    },

    bucket: {
      type: String,
      required: true,
      trim: true,
    },

    key: {
      type: String,
      required: true,
      trim: true,
    },

    etag: {
      type: String,
      required: true,
    },

    size: {
      type: Number,
      required: true,
      min: 0,
    },

    contentType: {
      type: String,
      required: true,
    },

    originalName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);


fileSchema.index({ vault: 1, owner: 1 });

const File = models.File || model("file", fileSchema);

export default File;
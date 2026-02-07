import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    owner: 
    { type: mongoose.Schema.Types.ObjectId, 
      ref: "user", 
      required: true 
    },
    bucket: 
    { type: String, 
      required: true },
    key: 
    { type: String, 
      required: true },
    size: 
    { type: Number, 
      required: true },
    contentType: 
    { type: String, 
      required: true },
    etag: 
    { type: String, 
      required: true },
    originalName:
     { type: String, 
      required: true },
    uploadedAt: 
    { type: Date, 
      default: Date.now },
  },
  { timestamps: true }
);

const FileModel = mongoose.models.file || mongoose.model("file", fileSchema);

export default FileModel;


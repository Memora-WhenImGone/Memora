import mongoose from "mongoose";

const triggerSchema = new mongoose.Schema(
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

    inactivityDays: {
      type: Number,
      required: true,
      min: 7,
      max: 365,
    },

    warningDays: {
      type: Number,
      enum: [1, 3, 7, 14, 30],
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL
    },
  },
  { timestamps: true }
);

const Trigger =
  mongoose.models.trigger || mongoose.model("trigger", triggerSchema);

export default Trigger;

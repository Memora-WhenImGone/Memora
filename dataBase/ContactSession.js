import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const contactSessionSchema = new Schema(
    {

        vault: {
            type: Schema.Types.ObjectId,
            ref: "Vault",
            required: true,
        },

        contact: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },


        tokenHash: {
            type: String,
            required: true,
            unique: true,
        },

        expiresAt: {
            type: Date,
            required: true,
        },

        usedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);


contactSessionSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
);


const ContactSession =
    models.ContactSession || model("ContactSession", contactSessionSchema);

export default ContactSession;
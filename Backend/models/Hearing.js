const mongoose = require("mongoose");

const hearingSchema = new mongoose.Schema(
    {
        caseNumber: {
            type: String,
            required: true,
            trim: true
        },

        clientName: {
            type: String,
            required: true,
            trim: true
        },

        court: {
            type: String,
            required: true,
            trim: true
        },

        hearingDate: {
            type: Date,
            required: true
        },

        purpose: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            enum: [
                "Upcoming",
                "Completed",
                "Adjourned"
            ],
            default: "Upcoming"
        },

        notes: {
            type: String,
            default: ""
        }
    },

    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Hearing",
    hearingSchema
);
const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema(
    {
        caseNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        clientName: {
            type: String,
            required: true,
            trim: true
        },

        caseType: {
            type: String,
            required: true
        },

        court: {
            type: String,
            required: true,
            trim: true
        },

        filingDate: {
            type: Date,
            required: true
        },

        nextHearing: {
            type: Date
        },

        status: {
            type: String,
            enum: ["Pending", "Active", "Disposed"],
            default: "Pending"
        },

        priority: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Medium"
        },

        description: {
            type: String,
            default: ""
        }
    },

    {
        timestamps: true
    }
);

module.exports = mongoose.model("Case", caseSchema);
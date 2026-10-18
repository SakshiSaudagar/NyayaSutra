const express = require("express");
const router = express.Router();

const Hearing = require("../models/Hearing");


// GET hearings
router.get("/", async (req, res) => {
    try {

        const hearings =
            await Hearing.find()
                .sort({ hearingDate: 1 });

        res.json(hearings);

    } catch (error) {

        res.status(500).json({
            message: "Unable to fetch hearings"
        });
    }
});


// CREATE hearing
router.post("/", async (req, res) => {
    try {

        const hearing =
            new Hearing(req.body);

        const savedHearing =
            await hearing.save();

        res.status(201).json(savedHearing);

    } catch (error) {

        res.status(400).json({
            message: error.message
        });
    }
});


// UPDATE hearing
router.put("/:id", async (req, res) => {
    try {

        const updatedHearing =
            await Hearing.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            );

        res.json(updatedHearing);

    } catch (error) {

        res.status(400).json({
            message: error.message
        });
    }
});


// DELETE hearing
router.delete("/:id", async (req, res) => {
    try {

        await Hearing.findByIdAndDelete(
            req.params.id
        );

        res.json({
            message: "Hearing deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: "Unable to delete hearing"
        });
    }
});


module.exports = router;
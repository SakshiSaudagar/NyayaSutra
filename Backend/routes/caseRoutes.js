const express = require("express");
const router = express.Router();

const Case = require("../models/Case");


// GET all cases
router.get("/", async (req, res) => {
    try {

        const cases = await Case.find()
            .sort({ createdAt: -1 });

        res.json(cases);

    } catch (error) {

        console.error("GET CASES ERROR:", error);

        res.status(500).json({
            message: error.message
        });
    }
});


// GET single case
router.get("/:id", async (req, res) => {
    try {

        const caseData =
            await Case.findById(req.params.id);

        if (!caseData) {

            return res.status(404).json({
                message: "Case not found"
            });
        }

        res.json(caseData);

    } catch (error) {

        console.error("GET SINGLE CASE ERROR:", error);

        res.status(500).json({
            message: error.message
        });
    }
});


// CREATE case
router.post("/", async (req, res) => {
    try {

        console.log("CREATE CASE REQUEST:");
        console.log(req.body);

        const newCase =
            new Case(req.body);

        const savedCase =
            await newCase.save();

        console.log("CASE SAVED SUCCESSFULLY:");

        res.status(201).json(savedCase);

    } catch (error) {

        console.error("CREATE CASE ERROR:", error);

        res.status(400).json({
            message: error.message
        });
    }
});


// UPDATE case
router.put("/:id", async (req, res) => {
    try {

        const updatedCase =
            await Case.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!updatedCase) {

            return res.status(404).json({
                message: "Case not found"
            });
        }

        res.json(updatedCase);

    } catch (error) {

        console.error("UPDATE CASE ERROR:", error);

        res.status(400).json({
            message: error.message
        });
    }
});


// DELETE case
router.delete("/:id", async (req, res) => {
    try {

        const deletedCase =
            await Case.findByIdAndDelete(
                req.params.id
            );

        if (!deletedCase) {

            return res.status(404).json({
                message: "Case not found"
            });
        }

        res.json({
            message: "Case deleted successfully"
        });

    } catch (error) {

        console.error("DELETE CASE ERROR:", error);

        res.status(500).json({
            message: error.message
        });
    }
});


module.exports = router;
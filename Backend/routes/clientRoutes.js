const express = require("express");
const router = express.Router();

const Client = require("../models/Client");


// GET all clients
router.get("/", async (req, res) => {
    try {

        const clients =
            await Client.find()
                .sort({ createdAt: -1 });

        res.json(clients);

    } catch (error) {

        res.status(500).json({
            message: "Unable to fetch clients"
        });
    }
});


// GET single client
router.get("/:id", async (req, res) => {
    try {

        const client =
            await Client.findById(req.params.id);

        if (!client) {

            return res.status(404).json({
                message: "Client not found"
            });
        }

        res.json(client);

    } catch (error) {

        res.status(500).json({
            message: "Unable to fetch client"
        });
    }
});


// CREATE client
router.post("/", async (req, res) => {
    try {

        const client =
            new Client(req.body);

        const savedClient =
            await client.save();

        res.status(201).json(savedClient);

    } catch (error) {

        res.status(400).json({
            message: error.message
        });
    }
});


// DELETE client
router.delete("/:id", async (req, res) => {
    try {

        const deletedClient =
            await Client.findByIdAndDelete(
                req.params.id
            );

        if (!deletedClient) {

            return res.status(404).json({
                message: "Client not found"
            });
        }

        res.json({
            message: "Client deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: "Unable to delete client"
        });
    }
});


module.exports = router;
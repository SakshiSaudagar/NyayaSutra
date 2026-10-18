const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
    path: path.join(__dirname, ".env")
});

const connectDB = require("../Database/database");

const caseRoutes = require("./routes/caseRoutes");
const clientRoutes = require("./routes/clientRoutes");
const hearingRoutes = require("./routes/hearingRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/cases", caseRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/hearings", hearingRoutes);
app.use("/api/tasks", taskRoutes);

// Frontend
app.use(
    express.static(
        path.join(__dirname, "../Frontend")
    )
);

// API test
app.get("/api", (req, res) => {
    res.json({
        success: true,
        message: "NyayaSutra API is working!"
    });
});

// Start server only after MongoDB connects
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(
                `NyayaSutra running at http://localhost:${PORT}`
            );
        });

    } catch (error) {
        console.error("Failed to start NyayaSutra:", error.message);
    }
};

startServer();
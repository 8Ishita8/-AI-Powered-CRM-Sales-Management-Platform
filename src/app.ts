import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import leadRoutes from "./modules/leads/routes/lead.routes";
import followupRoutes from "./modules/followups/routes/followup.routes";
import { errorHandler } from "./middleware/error.middleware";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to Database
connectDB();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/api/v1/leads", leadRoutes);
app.use("/api/v1/follow-ups", followupRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ success: true, status: "healthy" });
});

// Centralized Error Handler (must be registered last)
app.use(errorHandler);

// Start server (only if not imported for tests)
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
}

export default app;

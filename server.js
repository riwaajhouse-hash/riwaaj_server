import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import emailRoutes from "./routes/emailRoutes.js";


const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => res.send("✅ Resend Email API is running!"));
app.use("/", emailRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
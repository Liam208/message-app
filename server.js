import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import routes from "./routes/main.routes.js";
import connectDB from "./db/db.js";
import dotenv from "dotenv";

dotenv.config();
const port = process.env.PORT || 3030;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Current file path
const __filename = fileURLToPath(import.meta.url);

// Current directory
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, "public", "index.html");

app.use(express.static(path.join(__dirname, "public")));
app.use("/", routes);

connectDB()
  .then(() => {
    app.listen(port, "0.0.0.0", () => {
      console.log("Server started on 3030");
    });
  })
  .catch((err) => {
    console.error("DB connection failed", err);
  });

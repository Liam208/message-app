import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import routes from "./routes/main.routes.js";
import connectDB from "./db/db.js";
import { connect } from "net";

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
    app.listen(3030, "0.0.0.0", () => {
      console.log("Server started on 3030");
    });
  })
  .catch((err) => {
    console.error("DB connection failed", err);
  });

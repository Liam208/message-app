import express from "express";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import path from "path";
import Message from "../models/mainModel.js"; // <-- import Message model

// Current file path
const __filename = fileURLToPath(import.meta.url);
const escapeHtml = (str) => {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};
// Current directory
const __dirname = path.dirname(__filename);
const messages = {};

const filePath = path.join(__dirname, "..", "public", "html", "index.html");

export const mainFile = (req, res) => {
  res.sendFile(filePath);
};

export const sendText = async (req, res) => {
  const { message, sender = "Anonymous", recipient = "Anonymous" } = req.body;
  console.log(message);

  if (!message) return res.status(400).json({ msg: "Message Required" });

  try {
    // Save to DB
    const msgDoc = await Message.create({
      sender,
      recipient,
      text: message,
    });

    const id = msgDoc._id.toString();
    messages[id] = message; // Optionally keep in-memory for legacy support
    console.log("saved to DB");

    const link = `${req.protocol}://${req.get("host")}/message/${id}`;
    res.json({ link });
  } catch (err) {
    res.status(500).json({ msg: "Failed to save message" });
  }
};

export const retrieveText = (req, res) => {
  // Serve the HTML page for GET /message/:id
  const msgFilePath = path.join(__dirname, "..", "public", "html", "msg.html");
  res.sendFile(msgFilePath);
};
export const getMessageJson = async (req, res) => {
  const { id } = req.params;

  // Try DB first
  try {
    const msgDoc = await Message.findById(id);
    if (!msgDoc) return res.status(404).json({ message: "Message not found" });

    const safeMessage = escapeHtml(msgDoc.text || "");
    res.json({
      message: safeMessage,
      sender: msgDoc.sender,
      recipient: msgDoc.recipient,
    });
  } catch (err) {
    res.status(404).json({ message: "Message not found" });
  }
};

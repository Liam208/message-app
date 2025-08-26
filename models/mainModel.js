import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: { type: String, default: "Anonymous" },
  recipient: { type: String, default: "Anonymous" },
  text: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 3 },
});

const Message = mongoose.model("Message", messageSchema);

export default Message;

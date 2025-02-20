import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  message: String,
  studentIds: [String],
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;

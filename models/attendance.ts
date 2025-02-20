import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  paperId: { type: mongoose.Schema.Types.ObjectId, ref: "Paper" },
  date: { type: Date },
  status: { type: String },
});

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;

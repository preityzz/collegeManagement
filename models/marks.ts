import mongoose from "mongoose";

const marksSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, required: true },
  paperId: { type: mongoose.Schema.Types.ObjectId, required: true },
  marks: { type: Number, required: true },
});

export default mongoose.models.Marks || mongoose.model("Marks", marksSchema);

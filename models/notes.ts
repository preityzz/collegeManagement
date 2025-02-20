import mongoose from "mongoose";

const NotesSchema = new mongoose.Schema({
  paperId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Paper",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const Notes = mongoose.models.Notes || mongoose.model("Notes", NotesSchema);
export default Notes;

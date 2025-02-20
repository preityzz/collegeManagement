import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema({
  semester: Number,
  days: [
    {
      dayName: String,
      subjects: [String],
    },
  ],
});

const Timetable = mongoose.model("Timetable", timetableSchema);

export default Timetable;

import mongoose from "mongoose";

const paperSchema = new mongoose.Schema({
  name: String,
  code: String,
});

const Paper = mongoose.model("Paper", paperSchema);

export default Paper;

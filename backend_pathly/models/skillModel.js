import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
  question: { type: String, required: true },
  skill: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});
const SkillModel = mongoose.model("Skill", skillSchema);
export default SkillModel;

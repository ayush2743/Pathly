import mongoose from "mongoose";

const roadmapSchema = new mongoose.Schema({
  skillId: { type: mongoose.Schema.Types.ObjectId, ref: "Skill", required: true },
  skill: { type: String, required: true },
  roadmap: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now },
});

const RoadmapModel = mongoose.model("Roadmap", roadmapSchema);

export default RoadmapModel;

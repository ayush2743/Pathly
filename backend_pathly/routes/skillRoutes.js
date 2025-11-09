import express from "express";
import skillController from "../controllers/skillController.js";

const router = express.Router();

// GET all skills
router.get("/", skillController.getAllSkills);

// GET roadmap by skill ID
router.get("/roadmap/:skillId", skillController.getRoadmapBySkill);

export default router;


import dbService from "../services/dbService.js";

class SkillController {

  async getAllSkills(req, res) {
    try {
      const skills = await dbService.getAllSkillsWithDetails();

      return res.status(200).json({
        success: true,
        count: skills.length,
        data: skills,
      });
    } catch (error) {
      console.error("Error in SkillController.getAllSkills:", error);
      return res.status(500).json({
        success: false,
        error: error.message || "Failed to retrieve skills",
      });
    }
  }

  async getRoadmapBySkill(req, res) {
    try {
      const { skillId } = req.params;

      if (!skillId) {
        return res.status(400).json({
          success: false,
          error: "Skill ID is required",
        });
      }

      // Get roadmap using the skill ID
      const result = await dbService.getRoadmap(skillId);

      if (!result) {
        return res.status(404).json({
          success: false,
          error: "Roadmap not found for the given skill",
        });
      }
      return res.status(200).json({
        success: true,
        skill: result.skill, // for consistency, since not provided here
        roadmap: result.roadmap,
      });
    } catch (error) {
      console.error("Error in SkillController.getRoadmapBySkill:", error);

      return res.status(500).json({
        success: false,
        error: error.message || "Failed to retrieve roadmap",
      });
    }
  }
}

export default new SkillController();


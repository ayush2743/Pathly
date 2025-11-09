import geminiService from "../services/geminiService.js";
import dbService from "../services/dbService.js";

class GeminiController {

  async generateMap(req, res) {
    try {

      const { question } = req.body;

  
      if (!question) {
        return res.status(400).json({
          success: false,
          error: "Question is required in the request body",
        });
      }

  
      const existingSkills = await dbService.getAllSkills();

      const skillResponse = await geminiService.getSkillName(question, existingSkills);

      if(skillResponse.isNewSkill) {
        // Create new skill and generate roadmap
        const createdSkill = await dbService.createSkill({
          question: question,
          skill: skillResponse.skillName,
        });
        
        const roadmapResponse = await geminiService.generateRoadmap(skillResponse.skillName);

        const createdRoadmap = await dbService.createRoadmap({
          skillId: createdSkill._id,
          skill: createdSkill.skill,
          roadmap: roadmapResponse.roadmap,
        });

        return res.status(200).json({
          success: true,
          skill: skillResponse.skillName,
          roadmap: roadmapResponse.roadmap,
        });
      } else {
        // Skill exists, retrieve existing roadmap
        const skillId = await dbService.getSkillId(skillResponse.skillName);
        const roadmap = await dbService.getRoadmap(skillId);

        return res.status(200).json({
          success: true,
          skill: roadmap.skill,
          roadmap: roadmap.roadmap,
        });
      }

    } catch (error) {
      console.error("Error in GeminiController:", error);

      // Send error response
      return res.status(500).json({
        success: false,
        error: error.message || "Failed to generate response from Gemini AI",
      });
    }
  }
}


export default new GeminiController();


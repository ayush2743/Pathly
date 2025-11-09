import SkillModel from "../models/skillModel.js"
import RoadmapModel from "../models/roadmapModel.js";


class DbService {
  constructor() {
    this.SkillModel = SkillModel;
    this.RoadmapModel = RoadmapModel;
  }

  async getAllSkills() {
    try {
      const skills = await this.SkillModel.find({}, { skill: 1, _id: 0 })
      return skills;
    } catch (error) {
      console.error("Error in DbService, getAllSkills:", error);
      throw error;
    }
  } 

  async getRoadmap(skillId) {
    try {
      const roadmap = await this.RoadmapModel.findOne({ skillId: skillId });
      return roadmap;
    } catch (error) {
      console.error("Error in DbService, getRoadmap:", error);
      throw error;
    }
  }

  async getSkillId(skillName) {
    try {
      const skill = await this.SkillModel.findOne({ skill: skillName });
      return skill._id;
    } catch (error) {
      console.error("Error in DbService, getSkillId:", error);
      throw error;
    }
  }

  async createSkill(skill) {
    try {
      const newSkill = await this.SkillModel.create(skill);
      return newSkill;
    } catch (error) {
      console.error("Error in DbService, createSkill:", error);
      throw error;
    }
  }
  
  async createRoadmap(roadmap) {
    try {
      const newRoadmap = await this.RoadmapModel.create(roadmap);
      return newRoadmap;
    } catch (error) {
      console.error("Error in DbService, createRoadmap:", error);
      throw error;
    }
  }

  async getAllSkillsWithDetails() {
    try {
      const skills = await this.SkillModel.find({}).sort({ createdAt: -1 });
      return skills;
    } catch (error) {
      console.error("Error in DbService, getAllSkillsWithDetails:", error);
      throw error;
    }
  }
}

export default new DbService();
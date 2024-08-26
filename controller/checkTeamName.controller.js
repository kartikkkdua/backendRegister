import { Team } from "../model/team.model.js";

export const handleTeamNameCheck = async (req, res) => {
  try {
    const { teamName } = req.body;
    const existingTeam = await Team.findOne({ teamName });
    if (existingTeam) {
      return res.status(400).json({
        success: false,
        message: 'Team name already exists'
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Team name is unique'
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Internal Server Error, ${err}`
    });
  }
}
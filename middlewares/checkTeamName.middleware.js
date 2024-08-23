import { Team } from "../model/team.model.js";

export const checkTeamName = async (req, res, next) => {
  try {
    const { teamName } = req.body;
    const existingTeam = await Team.findOne({ teamName })
    if(existingTeam) {
      return res.status(400).json({ success: false, message: 'Team name already exists' });
    }
    next();
  } catch(err) {
    res.status(500).json({ success: false, message: `Internal Server Error, ${err}` });
  }
}
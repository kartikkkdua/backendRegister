import PrimeIdJson from '../primeId.json' assert { type: 'json' };
import { Team } from '../model/team.model.js';

export const checkPrimeId = async (req, res) => {
  const { primeId, selectedEvents, teamMembers } = req.body;

    const allPrimeIds = teamMembers
      .filter(user => user.isPrimeMember)
      .map(user => user.primeId);

    if(primeId) {
      allPrimeIds.push(primeId);
    }

    if(!allPrimeIds.length) {
      return res.status(204).json({ success: true, message: 'No Prime ids sent, user can register normally' });
    }

    const primeIds = PrimeIdJson.PrimeIds;
    // Check if prime id exists
    for (const id of allPrimeIds) {
      if (!primeIds.includes(id)) {
        return res.status(400).json({ success: false, message: `Invalid Prime Id ${id}` });
      }

      const isUserInEvent = await Team.findOne({
        $or: [
          { primeId: id },
          { 'teamMembers.primeId': id }
        ]
      });

      if (isUserInEvent) {
        for (const event of selectedEvents) {
          if (isUserInEvent.selectedEvents.includes(event)) {
            return res.status(409).json({ success: false, message: `Prime id ${id} already registered for event ${event} for team ${isUserInEvent.teamName}`  }); 
          }
        }
      }
    }

    return res.status(200).json({ success: true, message: `${allPrimeIds.join(', ')} can be registered in the events: ${selectedEvents.join(', ')}` }); 
}
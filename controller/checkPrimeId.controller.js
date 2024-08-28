import PrimeIdJson from '../primeId.json' with { type: 'json' };
import { Team } from '../model/team.model.js';

export const checkPrimeId = async (req, res) => {
  const { primeId, selectedEvents, teamMembers } = req.body;

    const allPrimeIds = teamMembers
      .filter((user) => user.primeMember)
      .map((user) => user.primeId);
    
    console.log(req.body);
    console.log(allPrimeIds);
    if(primeId) {
      allPrimeIds.push(primeId);
    }
    console.log(allPrimeIds);

    if (!allPrimeIds.length) {
      return res.status(204).json({ success: true, message: 'No Prime ids sent, user can register normally' });
    } else if (allPrimeIds.every(id => id === '')) {
      return res.status(204).json({ success: true, message: 'Prime ids are empty, user can register normally' });
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
            return res.status(409).json({ success: false, message: `Prime id ${id} already registered for event ${event} for team ${isUserInEvent.teamName}`, memberallowed: isUserInEvent.teamMembers }, ); 
          }
        }
      }
    }
    // check if all prime ids can be registered in the selected events

    return res.status(200).json({ success: true,
      // array of ids
      primeIds: allPrimeIds,
     }); 
}
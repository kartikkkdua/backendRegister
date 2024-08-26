import { Router } from 'express';
import { verifyAndSave } from '../controller/verifyAndSave.controller.js';
import { Team } from '../model/team.model.js';
import { Counter } from '../model/counter.model.js';
import { DrishyaEvent, PersonaEvent, ArenaEvent, InnovationEvent } from '../model/event.model.js';

const router = Router();

router.route('/verifyPaymentAndSave')
  .post(verifyAndSave)

router.route('/eventSave')
  .post(async (req, res) => {
    const { teamName, selectedEvents } = req.body;

    const newTeam = new Team({
      teamName,
      selectedEvents,
    });
    try {
      // Create a new team document (you may need this depending on your logic)
      const newTeam = new Team({ teamName, selectedEvents });
      await newTeam.save();

      // Process each selected event and create documents in the corresponding models
      for (const event of selectedEvents) {
        let counter, eventId;

        switch (event) {
          case 'Drishय':
            counter = await Counter.findOneAndUpdate(
              { eventType: 'drishya' },
              { $inc: { count: 1 } },
              { new: true, upsert: true }
            );

            // Generate the event ID for DrishyaEvent
            eventId = `Drishya${counter.count}`;

            // Create a new document in DrishyaEvent model
            const drishyaEvent = new DrishyaEvent({
              drishyaId: eventId,
              teamId: newTeam._id, // Reference to the newly created team
            });

            await drishyaEvent.save();
            break;

          case 'ARENA 3.0':
            counter = await Counter.findOneAndUpdate(
              { eventType: 'arena' },
              { $inc: { count: 1 } },
              { new: true, upsert: true }
            );

            // Generate the event ID for ArenaEvent
            eventId = `Arena${counter.count}`;

            // Create a new document in ArenaEvent model
            const arenaEvent = new ArenaEvent({
              arenaId: eventId,
              teamId: newTeam._id,
            });

            await arenaEvent.save();
            break;

          case 'INNOVAक्षण':
            counter = await Counter.findOneAndUpdate(
              { eventType: 'innovation' },
              { $inc: { count: 1 } },
              { new: true, upsert: true }
            );

            // Generate the event ID for InnovationEvent
            eventId = `Inno${counter.count}`;

            // Create a new document in InnovationEvent model
            const innovationEvent = new InnovationEvent({
              innovationId: eventId,
              teamId: newTeam._id,
            });

            await innovationEvent.save();
            break;

          case 'PERSONA':
            counter = await Counter.findOneAndUpdate(
              { eventType: 'persona' },
              { $inc: { count: 1 } },
              { new: true, upsert: true }
            );

            // Generate the event ID for PersonaEvent
            eventId = `Persona${counter.count}`;

            // Create a new document in PersonaEvent model
            const personaEvent = new PersonaEvent({
              personaId: eventId,
              teamId: newTeam._id,
            });

            await personaEvent.save();
            break;

          default:
            console.warn(`Unknown event type: ${event}`);
            break;
        }
      }

      res.status(201).json({ success: true, message: 'Team registered and events saved successfully' });

    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }

  })


export default router;
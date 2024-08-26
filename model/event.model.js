import { Schema, model } from 'mongoose';

// Drishya Event Schema
const drishyaEventSchema = new Schema({
  drishyaId: {
    type: String,
    unique: true // Ensure unique event IDs
  },
  teamId: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  }
});

drishyaEventSchema.pre('save', async function (next) {
  const doc = this;

  // Only generate a new ID if it doesn't exist
  if (!doc.drishyaId) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { eventType: 'drishya' }, // Event type for the counter
        { $inc: { count: 1 } },   // Increment count
        { new: true, upsert: true } // Create a new counter document if it doesn't exist
      );
      doc.drishyaId = `Drishya${counter.count}`;
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

export const DrishyaEvent = model('Drishya', drishyaEventSchema);

// Arena Event Schema
const arenaEventSchema = new Schema({
  arenaId: {
    type: String,
    unique: true
  },
  teamId: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  }
});

arenaEventSchema.pre('save', async function (next) {
  const doc = this;

  if (!doc.arenaId) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { eventType: 'arena' },
        { $inc: { count: 1 } },
        { new: true, upsert: true }
      );
      doc.arenaId = `Arena${counter.count}`;
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

export const ArenaEvent = model('Arena', arenaEventSchema);

// Innovation Event Schema
const innovationEventSchema = new Schema({
  innovationId: {
    type: String,
    unique: true
  },
  teamId: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  }
});

innovationEventSchema.pre('save', async function (next) {
  const doc = this;

  if (!doc.innovationId) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { eventType: 'innovation' },
        { $inc: { count: 1 } },
        { new: true, upsert: true }
      );
      doc.innovationId = `Inno${counter.count}`;
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

export const InnovationEvent = model('Innovation', innovationEventSchema);

// Persona Event Schema
const personaEventSchema = new Schema({
  personaId: {
    type: String,
    unique: true
  },
  teamId: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  }
});

personaEventSchema.pre('save', async function (next) {
  const doc = this;

  if (!doc.personaId) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { eventType: 'persona' },
        { $inc: { count: 1 } },
        { new: true, upsert: true }
      );
      doc.personaId = `Persona${counter.count}`;
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

export const PersonaEvent = model('Persona', personaEventSchema);

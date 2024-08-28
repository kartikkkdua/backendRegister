import { Schema, model } from 'mongoose';

// Counter Schema to store the counts
const counterSchema = new Schema({
  eventType: {
    type: String,
    required: true,
    unique: true
  },
  count: {
    type: Number,
    default: 0
  }
});

// Counter Model
export const Counter = model('Counter', counterSchema);


export const initializeCounters = async () => {
  const eventTypes = ['drishya', 'arena', 'innovation', 'persona', 'valorant'];

  for (const eventType of eventTypes) {
    await Counter.updateOne(
      { eventType },
      { $setOnInsert: { count: 0 } },
      { upsert: true }
    );
  }
}

initializeCounters()
  .then(() => console.log('Counters initialized'))
  .catch(err => console.error('Error initializing counters:', err));
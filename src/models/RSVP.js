import mongoose from 'mongoose';

const RSVPSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event ID is required'],
  },
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    maxlength: [100, 'Name cannot be more than 100 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

RSVPSchema.index({ eventId: 1, email: 1 }, { unique: true });

export default mongoose.models.RSVP || mongoose.model('RSVP', RSVPSchema);
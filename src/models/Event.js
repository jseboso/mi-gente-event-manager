import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for this event'],
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description for this event'],
  },
  date: {
    type: Date,
    required: [true, 'Please provide a date for this event'],
  },
  time: {
    type: String,
    required: [true, 'Please provide a time for this event'],
  },
  location: {
    type: String,
    required: [true, 'Please provide a location for this event'],
  },
  imageUrl: {
    type: String,
    default: '/images/placeholder.jpg',
  },
  link: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Event || mongoose.model('Event', EventSchema);
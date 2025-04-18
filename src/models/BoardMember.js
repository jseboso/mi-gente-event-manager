import mongoose from 'mongoose';

const BoardMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    maxlength: [100, 'Name cannot be more than 100 characters'],
  },
  position: {
    type: String,
    required: [true, 'Please provide a position'],
    maxlength: [100, 'Position cannot be more than 100 characters'],
  },
  imageUrl: {
    type: String,
    default: '/images/placeholder.jpg',
  },
  bio: {
    type: String,
    default: '',
  },
  order: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.BoardMember || mongoose.model('BoardMember', BoardMemberSchema);
import { getServerSession } from 'next-auth/next';
import dbConnect from '../../../utils/db';
import RSVP from '../../../models/RSVP';
import nextAuth from '../auth/[...nextauth]';
import { serializeDocument } from '../../../utils/helpers';

export default async function handler(req, res) {
  const { method, query } = req;
  const { eventId } = query;
  
  await dbConnect();
  
  const session = await getServerSession(req, res, nextAuth);
  
  if (!session) {
    return res.status(401).json({ 
      success: false, 
      message: 'Not authenticated' 
    });
  }
  
  switch (method) {
    case 'GET':
      try {
        if (!eventId) {
          return res.status(400).json({ 
            success: false, 
            message: 'Event ID is required' 
          });
        }
        
        const attendees = await RSVP.find({ eventId }).sort({ createdAt: -1 }).lean();
        
        // Serialize attendees
        const serializedAttendees = attendees.map(attendee => serializeDocument(attendee));
        
        res.status(200).json({ success: true, data: serializedAttendees });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
      
    default:
      res.status(405).json({ success: false, message: 'Method not allowed' });
      break;
  }
}
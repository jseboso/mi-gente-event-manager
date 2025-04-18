import dbConnect from '../../../utils/db';
import Event from '../../../models/Event';
import RSVP from '../../../models/RSVP';

export default async function handler(req, res) {
  const { method } = req;
  
  await dbConnect();
  
  switch (method) {
    case 'POST':
      try {
        const { eventId, name, email } = req.body;
        
        if (!eventId || !name || !email) {
          return res.status(400).json({ 
            success: false, 
            message: 'Missing required fields' 
          });
        }
        
        const event = await Event.findById(eventId);
        if (!event) {
          return res.status(404).json({ 
            success: false, 
            message: 'Event not found' 
          });
        }
        
        const existingRSVP = await RSVP.findOne({ eventId, email });
        if (existingRSVP) {
          return res.status(400).json({ 
            success: false, 
            message: 'You have already RSVPed for this event' 
          });
        }
        
        // Create the RSVP
        const rsvp = await RSVP.create({
          eventId,
          name,
          email
        });
        
        res.status(201).json({ success: true, data: rsvp });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
      
    default:
      res.status(405).json({ success: false, message: 'Method not allowed' });
      break;
  }
}
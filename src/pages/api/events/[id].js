import { getServerSession } from 'next-auth/next';
import dbConnect from '../../../utils/db';
import Event from '../../../models/Event';
import nextAuth from '../auth/[...nextauth]';

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;
  
  await dbConnect();
  
  switch (method) {
    case 'GET':
      try {
        const event = await Event.findById(id);
        
        if (!event) {
          return res.status(404).json({ success: false, message: 'Event not found' });
        }
        
        res.status(200).json({ success: true, data: event });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
      
    case 'PUT':
      try {
        const session = await getServerSession(req, res, nextAuth);
        
        if (!session) {
          return res.status(401).json({ 
            success: false, 
            message: 'Not authenticated' 
          });
        }
        
        const event = await Event.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        
        if (!event) {
          return res.status(404).json({ success: false, message: 'Event not found' });
        }
        
        res.status(200).json({ success: true, data: event });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
      
    case 'DELETE':
      try {
        const session = await getServerSession(req, res, nextAuth);
        
        if (!session) {
          return res.status(401).json({ 
            success: false, 
            message: 'Not authenticated' 
          });
        }
        
        const deletedEvent = await Event.findByIdAndDelete(id);
        
        if (!deletedEvent) {
          return res.status(404).json({ success: false, message: 'Event not found' });
        }
        
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
      
    default:
      res.status(405).json({ success: false, message: 'Method not allowed' });
      break;
  }
}
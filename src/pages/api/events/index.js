import { getServerSession } from 'next-auth/next';
import dbConnect from '../../../utils/db';
import Event from '../../../models/Event';
import nextAuth from '../auth/[...nextauth]';

export default async function handler(req, res) {
  const { method } = req;
  
  await dbConnect();
  
  switch (method) {
    case 'GET':
      try {
        const events = await Event.find({}).sort({ date: 1 });
        res.status(200).json({ success: true, data: events });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
      
    case 'POST':
      try {
        const session = await getServerSession(req, res, nextAuth);
        
        console.log('Session in events API:', JSON.stringify(session));
        
        if (!session) {
          return res.status(401).json({ 
            success: false, 
            message: 'Not authenticated' 
          });
        }
        
        const event = await Event.create(req.body);
        res.status(201).json({ success: true, data: event });
      } catch (error) {
        console.error('Error creating event:', error);
        res.status(400).json({ success: false, message: error.message });
      }
      break;
      
    default:
      res.status(405).json({ success: false, message: 'Method not allowed' });
      break;
  }
}
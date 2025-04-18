import { getServerSession } from 'next-auth/next';
import dbConnect from '../../../utils/db';
import BoardMember from '../../../models/BoardMember';
import nextAuth from '../auth/[...nextauth]';

export default async function handler(req, res) {
  const { method } = req;
  
  await dbConnect();
  
  switch (method) {
    case 'GET':
      try {
        const boardMembers = await BoardMember.find({}).sort({ order: 1, name: 1 });
        res.status(200).json({ success: true, data: boardMembers });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
      
    case 'POST':
      try {
        const session = await getServerSession(req, res, nextAuth);
        
        if (!session) {
          return res.status(401).json({ 
            success: false, 
            message: 'Not authenticated' 
          });
        }
        
        const boardMember = await BoardMember.create(req.body);
        res.status(201).json({ success: true, data: boardMember });
      } catch (error) {
        console.error('Error creating board member:', error);
        res.status(400).json({ success: false, message: error.message });
      }
      break;
      
    default:
      res.status(405).json({ success: false, message: 'Method not allowed' });
      break;
  }
}
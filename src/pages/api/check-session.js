import { getServerSession } from 'next-auth/next';
import nextAuth from './auth/[...nextauth]';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, nextAuth);
  
  res.status(200).json({
    authenticated: !!session,
    session: session,
  });
}
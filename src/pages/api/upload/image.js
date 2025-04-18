import { promises as fs } from 'fs';
import path from 'path';
import { IncomingForm } from 'formidable';
import sharp from 'sharp';
import { getServerSession } from 'next-auth/next';
import nextAuth from '../auth/[...nextauth]';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, nextAuth);
    
    if (!session) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authenticated' 
      });
    }

    const uploadsDir = path.join(process.cwd(), 'public/uploads');
    try {
      await fs.access(uploadsDir);
    } catch (error) {
      await fs.mkdir(uploadsDir, { recursive: true });
    }

    const form = new IncomingForm({
      keepExtensions: true,
      multiples: false,
    });

    return new Promise((resolve, reject) => {
      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error('Error parsing form:', err);
          res.status(500).json({ success: false, message: 'Error uploading file' });
          return resolve();
        }
        
        const file = files.file?.[0];
        
        if (!file) {
          res.status(400).json({ success: false, message: 'No file uploaded' });
          return resolve();
        }

        try {
          const fileExtension = path.extname(file.originalFilename);
          const filename = `${Date.now()}${fileExtension}`;
          const relativePath = `/uploads/${filename}`;
          const absolutePath = path.join(process.cwd(), 'public', relativePath);

          // Resize and compress the image
          await sharp(file.filepath)
            .resize(800)
            .jpeg({ quality: 70 })
            .toFile(absolutePath);

          res.status(200).json({ 
            success: true, 
            imageUrl: relativePath 
          });
          
          return resolve();
        } catch (error) {
          console.error('Error processing image:', error);
          res.status(500).json({ success: false, message: 'Error processing image' });
          return resolve();
        }
      });
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}
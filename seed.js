const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function seedAdmin() {
  // Connect to MongoDB
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const usersCollection = db.collection('users');
    
    // Check if admin already exists
    const existingAdmin = await usersCollection.findOne({ 
      email: process.env.ADMIN_EMAIL 
    });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }
    
    // Hash the password
    const hashedPassword = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10);
    
    // Create admin user
    await usersCollection.insertOne({
      name: 'Mi Gente Admin',
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date()
    });
    
    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error seeding admin user:', error);
  } finally {
    await client.close();
  }
}

seedAdmin();
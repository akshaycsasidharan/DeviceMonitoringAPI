import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGO_URI;
const dbName = process.env.DB;

let dbInstance = null;

const connectToMongoDB = async () => {
  if (dbInstance) return dbInstance;

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    dbInstance = client.db(dbName);
    return dbInstance;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

const getDB = () => {
  if (!dbInstance) {
    throw new Error('Database not initialized. Call connectToMongoDB first.');
  }
  return dbInstance;
};

export { connectToMongoDB, getDB };

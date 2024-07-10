import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB;

const generateData = () => {
  const data = [];
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 2);

  for (let i = 0; i < 3; i++) {
    const timestamp = new Date(startDate.getTime() + i * 60 * 1000);

    const analyticalData = {
      timestamp: timestamp,
      metadata: {
        deviceId: Math.random().toString(36).substring(2),
        data: Math.random() < 0.5 ? 0 : 1,
        timestamp: timestamp.getTime(),
      },
    };

    data.push(analyticalData);
  }

  return data;
};

const insertData = async () => {
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const db = client.db(DB_NAME);

    const data = generateData();
    await db.collection("analytics").insertMany(data);

    console.log("Data inserted successfully");
  } finally {
    await client.close();
  }
};

insertData().catch(console.error);

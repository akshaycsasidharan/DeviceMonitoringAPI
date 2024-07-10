import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB;

const generateUptimeData = () => {
  const data = [];
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 2);

  for (let i = 0; i < 3; i++) {
    const timestamp = new Date(startDate.getTime() + i * 60 * 1000);

    const uptimeData = {
      timestamp: timestamp,
      metadata: {
        deviceId: Math.random().toString(36).substring(2),
        data: Math.random() < 0.5 ? "connected" : "disconnected",
        timestamp: timestamp.getTime(),
      },
    };

    if (
      data.length > 0 &&
      data[data.length - 1].metadata.data === uptimeData.metadata.data
    ) {
      uptimeData.metadata.data =
        uptimeData.metadata.data === "connected" ? "disconnected" : "connected";
    }

    data.push(uptimeData);
  }

  return data;
};

const insertUptimeData = async () => {
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const db = client.db(DB_NAME);

    const data = generateUptimeData();
    await db.collection("uptime").insertMany(data);

    console.log("Uptime data inserted successfully");
  } finally {
    await client.close();
  }
};

insertUptimeData().catch(console.error);

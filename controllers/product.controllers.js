import { getDB } from '../connection/connection.js';
import fs from 'fs';
import path from 'path';

// export const getProducts = async (req, res) => {

//   try {
//     const filePath = path.resolve('analytics.json');
//     const data = fs.readFileSync(filePath, 'utf8');
//     const products = JSON.parse(data);
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }

// };

// export const addProduct = async (req, res) => {
//   try {
//     const db = getDB();
//     const product = req.body;
//     const result = await db.collection('EstroTech').insertOne(product);
//     res.status(201).json({ insertedId: result.insertedId });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


export const getAnalyticalData = async (req, res) => {

  try {
    const db = getDB(); 

    const analyticalData = await db.collection('analytics').aggregate([
      {
        $group: {
          _id: { day: { $dayOfMonth: { $toDate: "$timestamp" } }, hour: { $hour: { $toDate: "$timestamp" } } },
          count: { $sum: 1 }
        },
      },
      {
        $group: {
          _id: "$_id.day",
          dataByHour: { $push: { hour: "$_id.hour", count: "$count" } },
          net: { $sum: "$count" }
        },
      },
      {
        $project: {
          dataByHour: 1,
          net: 1,
          avg: { $divide: ["$net", 24] },
          busiestHour: { 
            $arrayElemAt: [
              "$dataByHour", 
              { $indexOfArray: ["$dataByHour.count", { $max: "$dataByHour.count" }] }
            ]
          }
        },
      },
      {
        $unset: "_id"
      },
      {
        $sort: { "_id.day": 1 }
      }
    ]).toArray();

    res.json(analyticalData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch analytical data' });
  }

};


export const getUptimeData = async (req, res) => {

  try {
    const db = getDB();


    const docs = await db.collection('EstroTech').find().sort({ timestamp: 1 }).toArray();


    let uptimeData = [];


    for (let i = 0; i < docs.length; i++) {
      const currentDoc = docs[i];
      const previousDoc = i > 0 ? docs[i - 1] : null;


      if (previousDoc && previousDoc.metadata.data === currentDoc.metadata.data) {
        continue;
      }


      const stateDuration = currentDoc.metadata.timestamp - (previousDoc ? previousDoc.metadata.timestamp : currentDoc.metadata.timestamp);


      const uptimeEntry = {
        timestamp: currentDoc.timestamp,
        state: currentDoc.metadata.data,
        stateDuration: stateDuration
      };

      uptimeData.push(uptimeEntry);
    }

    res.json(uptimeData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch uptime data' });
  }
};



export const getOverallReport = async (req, res) => {

  try {
    const db = getDB(); // Assuming getDB() retrieves the MongoDB client instance

    // Your logic to compute overall report data
    // Example:
    const overallReport = {
      totalAnalyticalData: 50000, // Example total analytical data count
      busiestDays: ['2024-07-01', '2024-06-30', '2024-06-29'],
      quietestDays: ['2024-06-25', '2024-06-26', '2024-07-04'],
      totalUptime: '840 hours',
      totalDowntime: '600 hours'
    };

    res.json(overallReport);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch overall report data' });
  }

};
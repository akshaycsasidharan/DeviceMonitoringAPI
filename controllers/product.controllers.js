import { getDB } from "../connection/connection.js";


export const getAnalyticalData = async (req, res) => {
  try {
    const db = getDB();

    const analyticalData = await db
      .collection("analytics")
      .aggregate([
        {
          $group: {
            _id: {
              day: { $dayOfMonth: { $toDate: "$timestamp" } },
              hour: { $hour: { $toDate: "$timestamp" } },
            },
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: "$_id.day",
            dataByHour: { $push: { hour: "$_id.hour", count: "$count" } },
            net: { $sum: "$count" },
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
                {
                  $indexOfArray: [
                    "$dataByHour.count",
                    { $max: "$dataByHour.count" },
                  ],
                },
              ],
            },
          },
        },
        {
          $unset: "_id",
        },
        {
          $sort: { "_id.day": 1 },
        },
      ])
      .toArray();

    res.json(analyticalData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch analytical data" });
  }
};

export const getUptimeData = async (req, res) => {
  try {
    const db = getDB();

    const docs = await db
      .collection("uptime")
      .find()
      .sort({ timestamp: 1 })
      .toArray();

    let uptimeData = [];

    for (let i = 0; i < docs.length; i++) {
      const currentDoc = docs[i];
      const previousDoc = i > 0 ? docs[i - 1] : null;

      if (
        previousDoc &&
        previousDoc.metadata.data === currentDoc.metadata.data
      ) {
        continue;
      }

      const stateDuration =
        currentDoc.metadata.timestamp -
        (previousDoc
          ? previousDoc.metadata.timestamp
          : currentDoc.metadata.timestamp);

      const uptimeEntry = {
        timestamp: currentDoc.timestamp,
        state: currentDoc.metadata.data,
        duration: stateDuration,
      };

      uptimeData.push(uptimeEntry);
    }

    res.json(uptimeData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch uptime data" });
  }
};

export const getOverallReport = async (req, res) => {
  try {
    const db = getDB();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 2);

    const analyticalData = await db
      .collection("analytics")
      .aggregate([
        {
          $match: {
            timestamp: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ])
      .toArray();

    const totalAnalyticalData = analyticalData.reduce(
      (sum, day) => sum + day.count,
      0
    );
    const averageAnalyticalData = analyticalData.length
      ? totalAnalyticalData / analyticalData.length
      : 0;

    const sortedByCount = [...analyticalData].sort((a, b) => b.count - a.count);
    const busiestDays = sortedByCount.slice(0, 3).map((day) => day._id);
    const quietestDays = sortedByCount
      .slice(-3)
      .map((day) => day._id)
      .reverse();

    // Total uptime and downtime
    const uptimeData = await db
      .collection("uptime")
      .aggregate([
        {
          $match: {
            timestamp: { $gte: startDate },
          },
        },
        {
          $sort: { timestamp: 1 },
        },
      ])
      .toArray();

    let totalUptime = 0;
    let totalDowntime = 0;
    let previousState = null;
    let previousTimestamp = startDate.getTime();

    for (const entry of uptimeData) {
      const currentState = entry.metadata.data;
      const currentTimestamp = new Date(entry.timestamp).getTime();

      if (previousState === null || currentState !== previousState) {
        if (previousState === "connected") {
          totalUptime += currentTimestamp - previousTimestamp;
        } else if (previousState === "disconnected") {
          totalDowntime += currentTimestamp - previousTimestamp;
        }

        previousState = currentState;
        previousTimestamp = currentTimestamp;
      }
    }

    // Handle the final segment after the last entry
    if (previousState === "connected") {
      totalUptime += Date.now() - previousTimestamp;
    } else if (previousState === "disconnected") {
      totalDowntime += Date.now() - previousTimestamp;
    }

    const totalUptimeHours = (totalUptime / (1000 * 60 * 60)).toFixed(2);
    const totalDowntimeHours = (totalDowntime / (1000 * 60 * 60)).toFixed(2);

    const overallReport = {
      totalAnalyticalData,
      averageAnalyticalData,
      busiestDays,
      quietestDays,
      totalUptime: `${totalUptimeHours} hours`,
      totalDowntime: `${totalDowntimeHours} hours`,
    };

    res.json(overallReport);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch overall report data" });
  }
};

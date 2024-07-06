import fs from "fs";

let arr = [];
for (let i = 0; i < 3; i++) {
  let analytics = {
    timestamp: new Date(),
    metadata: {
      deviceId: Math.random().toString(36).substring(2),
      data: Math.random() < 0.5 ? 0 : 1, // 
      timestamp: Date.now()
    }
  };

  let uptimeData = {
    timestamp: new Date(),
    metadata: {
      deviceId: Math.random().toString(36).substring(2),
      data: Math.random() < 0.5 ? "connected" : "disconnected", 
      timestamp: Date.now()
    }
  };

  arr.push(analytics);
  arr.push(uptimeData);
}

const jsonString = JSON.stringify(arr, null, 2);

// Write the JSON string to a file (optional, for verification)
fs.writeFile('analytics.json', jsonString, (err) => {
  if (err) {
    console.error('Error writing file', err);
  } else {
    console.log('Successfully wrote file');
  }
});

import fs from "fs";

let arr = []
for(let i=0;i<20; i++){

   let Analytics = {
       timestamp: {
           $date:new Date()
       },
       metdata:{
           deviceId:Math.random().toString(36).substring(2),
           data:1,
           timestamp:Date.now()
       }
};

arr.push(Analytics)

};


const jsonString = JSON.stringify(arr, null, 2);

// Write the JSON string to a file

fs.writeFile('analytics.json', jsonString, (err) => {
   if (err) {
       console.error('Error writing file', err);
   } else {
       console.log('Successfully wrote file');
   }
});
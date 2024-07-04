const express = require('express');
const mongoose = require('mongoose');
const app = express();

// middleware

app.use(express.json());
app.use(express.urlencoded({extended: false}));

// routes

// app.use("/api/products",productRoute);



app.get('/', (req,res) => {
    res.send("hello from node api");
});

app.post('/api/products', (req,res) => {
    console.log(req.body);
    res.send(req.body);
});


mongoose.connect("mongodb+srv://akshaycs0480:wINRR77scqrwiXq1@backenddb.qb2nwcd.mongodb.net/Node-API?retryWrites=true&w=majority&appName=BackendDB")
    .then( () => {
        console.log("connected to database");
        app.listen(3000, () => {
            console.log('server is running on port 3000');
        });        
    })
    .catch( () => {
        console.log("connection failed");
    })
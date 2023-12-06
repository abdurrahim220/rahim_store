const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./db/connectDB');
require('dotenv').config()

const port = 5000;
app.use(express.json());
app.use(cors())


app.use('/api', require('./routes/categoryRoutes'));

app.get("/",(req,res)=>{
    res.send("Server is running");
})

app.listen(port,()=>{
    connectDB()
    console.log(`server is running on port ${port}`);
})
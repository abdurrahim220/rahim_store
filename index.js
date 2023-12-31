const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const connectDB = require('./db/connectDB');
require('dotenv').config()

const port = 5000;
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json());
app.use(cors())


app.use('/api', require('./routes/categoryRoutes'));
app.use('/api', require('./routes/productsRoutes'));
app.use('/api', require('./routes/stripe'));
app.use('/api', require('./routes/user'));
app.use('/api', require('./routes/order'));

app.get("/api",(req,res)=>{
    res.send("Server is running");
})

app.listen(port,()=>{
    connectDB()
    console.log(`server is running on port ${port}`);
})
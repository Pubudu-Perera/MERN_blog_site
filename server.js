require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const corsOptions = require('./config/corsOptions');
const {logger,logEvents} = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const connectDB = require('./config/dbConn');

const PORT = process.env.PORT || 3500;

connectDB();

app.use(cors(corsOptions));

app.use(cookieParser());

app.use(express.json());

app.use(logger);

app.use('/', express.static(path.join(__dirname,'public','CSS')));

app.use("/", require('./routes/root'));

app.use("/users", require('./routes/userRoutes'));

app.all('*',(req,res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname,'views','404.html'));
    } else if(req.accepts('json')){
        res.json({message : "404 NOT FOUND!"});
    } else{
        res.type('txt').send('Text 404 NOT FOUND');
    }
});

app.use(errorHandler);     

mongoose.connection.once('open',() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log("The server is running on PORT 3500"));
});

mongoose.connection.on('err',(err) => {
    console.log(err);
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
});
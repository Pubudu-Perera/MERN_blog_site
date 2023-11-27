const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3500;

app.use('/', express.static(path.join(__dirname,'public','CSS')));

app.use("/", require('./routes/root'));

app.listen(PORT, () => console.log("The server is running on PORT 3500"));
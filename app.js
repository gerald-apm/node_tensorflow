/* eslint-disable max-len */
const express = require('express');
const logger = require('morgan');
const fs = require('fs');
const http = require('http');
const https = require('https');
const app = express();
const cors = require('cors');
const porthttp = process.env.PORT_HTTP || 5000;
const hostname = require('./utils/localhost');
const indexRouter = require('./routes/index');
const tomatoRouter = require('./routes/tomatopred');
const cornRouter = require('./routes/cornpred');
const potatoRouter = require('./routes/potatopred');
const uploadRouter = require('./routes/upload');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/', indexRouter);
app.use('/predict/tomato', tomatoRouter);
app.use('/predict/corn', cornRouter);
app.use('/predict/potato', potatoRouter);
app.use('/upload', uploadRouter);
app.use('/download', express.static('client-img'));

app.use(cors());

const httpServer = http.createServer(app);

httpServer.listen(porthttp, () => {
    console.log(`Server berjalan pada host ${hostname} dan port ${porthttp}`);
});

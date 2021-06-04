/* eslint-disable max-len */
const express = require('express');
const logger = require('morgan');
const fs = require('fs');
const http = require('http');
const https = require('https');
const app = express();
const cors = require('cors');
const porthttp = process.env.PORT_HTTP || 5000;
const porthttps = process.env.PORT_HTTPS || 5050;
const hostname = require('./utils/localhost');
const indexRouter = require('./routes/index');
const tomatoRouter = require('./routes/tomatopred');
const cornRouter = require('./routes/cornpred');
const potatoRouter = require('./routes/potatopred');
const uploadRouter = require('./routes/upload');
// const privateKey  = fs.readFileSync('credentials/selfsigned.key', 'utf8');
// const certificate = fs.readFileSync('credentials/selfsigned.crt', 'utf8');
// const privateKey = fs.readFileSync('credentials/api.easeplantz.ml/privkey1.pem', 'utf8');
// const certificate = fs.readFileSync('credentials/api.easeplantz.ml/fullchain1.pem', 'utf8');
// const credentials = {key: privateKey, cert: certificate};

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/', indexRouter);
app.use('/predict/tomato', tomatoRouter);
app.use('/predict/corn', cornRouter);
app.use('/predict/potato', potatoRouter);
app.use('/upload', uploadRouter);
app.use('/download', express.static('client-img'));
app.use('/upload', express.static('html'));

app.use(cors());

const httpServer = http.createServer(app);
// const httpsServer = https.createServer(credentials, app);

httpServer.listen(porthttp, () => {
    console.log(`Server berjalan pada host ${hostname} dan port ${porthttp}`);
});

/* httpsServer.listen(porthttps, () => {
    console.log(`Server berjalan pada host ${hostname} dan port ${porthttps}`);
}); */

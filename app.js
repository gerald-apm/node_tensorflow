const express = require('express');
const logger = require('morgan');
const app = express();
const cors = require('cors');
const port = 5000;
const hostname = process.env.NODE_ENV !== 'production' ?
    'localhost' : '34.136.47.193';
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
app.use('/upload', express.static('html'));

app.use(cors());

app.listen(port, () => {
    console.log(`Server berjalan pada host ${hostname} dan port ${port}`);
});

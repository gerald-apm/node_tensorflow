const express = require('express');
const logger = require('morgan');
const app = express();
const cors = require('cors');
const port = 5000;
const indexRouter = require('./routes/index');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/', indexRouter);

app.use(cors());

app.listen(port, () => {
    console.log(`Server berjalan pada port ${port}`);
});

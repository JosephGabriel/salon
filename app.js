const express = require('express');

const app = express();

//eslint-disable-next-line
const morgan = require('morgan');

const serviceRouter = require('./routes/service');

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Middlewares
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/services', serviceRouter);

module.exports = app;

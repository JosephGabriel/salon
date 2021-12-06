const express = require('express');

const app = express();

//eslint-disable-next-line
const morgan = require('morgan');

const globalErrorHandler = require('./controller/error');

const AppError = require('./utils/appError');

const serviceRouter = require('./routes/service');
const userRouter = require('./routes/user');

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Middlewares
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/services', serviceRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Não foi possivel achar: ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

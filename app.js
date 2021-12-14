const express = require('express');

const app = express();

const morgan = require('morgan');

const helmet = require('helmet');

const xss = require('xss-clean');

const hpp = require('hpp');

const rateLimiter = require('express-rate-limit');

const mongoSanitize = require('express-mongo-sanitize');

const globalErrorHandler = require('./controller/error');

const AppError = require('./utils/appError');

const serviceRouter = require('./routes/service');
const userRouter = require('./routes/user');

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimiter({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message:
    'Você ultrapassou o limite de requisições, tente novamente em 1 hora',
});

//Middlewares
app.use(helmet());

app.use(mongoSanitize());

app.use(xss());

app.use(
  hpp({
    whitelist: ['price', 'priceDiscount', 'ratingsAverage'],
  })
);

app.use(express.json({ limit: '50kb' }));
app.use(express.static(`${__dirname}/public`));

app.use('/api', limiter());

app.use('/api/v1/services', serviceRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Não foi possivel achar: ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

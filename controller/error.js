const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Campo inválido ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldDB = (err) => {
  const message = `Campo duplicado: ${err.keyValue.name}, Use outro valor`;
  return new AppError(message, 400);
};

const handleJWTError = (err) =>
  new AppError('Token inválido, Por favor faça login novamente', 401);

const handleJWTExpiredError = (err) =>
  new AppError('Seu token expirou! Por favor faça login novamente', 401);

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Input inválido. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const sendErrorToDevelopment = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorToProduction = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Algo de errado aconteceu!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  console.log(err);

  if (process.env.NODE_ENV === 'development') {
    sendErrorToDevelopment(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.assign(err);
    console.log(err);

    if (error.name === 'CastError') {
      error = handleCastErrorDB(error);
    }

    if (error.name === 'ValidationError') {
      error = handleValidationErrorDB(error);
    }

    if (error.name === 'JsonWebTokenError') {
      error = handleJWTError(error);
    }

    if (error.name === 'TokenExpiredError') {
      error = handleJWTExpiredError(error);
    }

    if (error.code === 11000) {
      error = handleDuplicateFieldDB(error);
    }

    sendErrorToProduction(error, res);
  }
};

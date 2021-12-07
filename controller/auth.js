const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signupToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signupToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }

  user.password = undefined;

  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createSendToken(newUser, 200, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new AppError(
        'Para fazer login é necessário fornecer email e senha válidos',
        400
      )
    );
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || (await user.correctPassword(password, user.password))) {
    return next(new AppError('Email ou senha inválida', 401));
  }

  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError(
        'Você não esta logado! É necessário fazer login para ter acesso',
        401
      )
    );
  }

  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  const freshUser = await User.findOne({ _id: decoded.id });

  if (!freshUser) {
    return next(new AppError('Token inválido', 401));
  }

  if (freshUser.changedPassword(decoded.iat)) {
    return next(
      new AppError(
        'O usúario trocou a senha recentemente, é necessário fazer login novamente',
        401
      )
    );
  }

  req.user = freshUser;

  next();
});

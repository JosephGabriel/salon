const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'O usuário deve ter um nome'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'O usuário deve ter um email'],
    validate: [validator.isEmail, 'Insira um email válido'],
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Por favor insira uma senha'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    minlength: 8,
    required: [true, 'Por favor confirme sua senha'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'As senhas não as mesmas',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.correctPassword = async function (password, userPassword) {
  return await bcrypt.compare(password, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;

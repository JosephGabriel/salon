const mongoose = require('mongoose');
const validator = require('validator');

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

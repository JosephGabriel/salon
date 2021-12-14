const express = require('express');

const router = express.Router();

const authController = require('../controller/auth');
const userController = require('../controller/user');

router.post('/signup', authController.signup);

router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);

router.patch('/resetPassword/:token', authController.resetPassword);

router.delete('/deleteMe', authController.protect, userController.deleteMe);

router.patch('/updateMe', authController.protect, userController.updateMe);

router.patch(
  '/updateMyPassword/',
  authController.protect,
  authController.updatePassword
);

module.exports = router;

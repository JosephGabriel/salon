const express = require('express');

const router = express.Router();

const serviceController = require('../controller/service');
const authController = require('../controller/auth');

router.route('/top-5-services').get(serviceController.aliasTopServices);

router
  .route('/')
  .get(serviceController.getAllServices)
  .post(serviceController.createService);

router
  .route('/:id')
  .get(serviceController.getService)
  .patch(serviceController.updateService)
  .delete(
    authController.protect,
    authController.restricTo('admin'),
    serviceController.deleteService
  );

module.exports = router;

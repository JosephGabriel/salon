const express = require('express');

const router = express.Router();

const serviceController = require('../controller/service');

router
  .route('/')
  .get(serviceController.getAllServices)
  .post(serviceController.createService);

router
  .route('/:id')
  .get(serviceController.getService)
  .patch(serviceController.updateService)
  .delete(serviceController.deleteService);

module.exports = router;

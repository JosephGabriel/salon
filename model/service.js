const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  tags: {
    type: [String],
  },
  description: {
    type: String,
    trim: true,
    required: true,
  },
  tinyDescription: {
    type: String,
    trim: true,
    required: true,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  ratingsAverage: {
    type: Number,
    default: 0,
  },
  ratings: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
  },
  priceDiscount: {
    type: Number,
  },
  category: {
    type: String,
    required: true,
  },
  timeToFinish: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Service = mongoose.model('services', serviceSchema);

module.exports = Service;

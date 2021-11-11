const mongoose = require('mongoose');
const { default: slugify } = require('slugify');

const serviceSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
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
    min: [1, 'A avaliação deve ser maior ou igual a 1.0'],
    max: [5, 'A avaliação deve ser menor ou igual a 5.0'],
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
    validate: {
      validator: function (val) {
        return val < this.price;
      },
      message: 'O Desconto ({VALUE}) não deve ser menor que o valor normal',
    },
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

serviceSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Service = mongoose.model('services', serviceSchema);

module.exports = Service;

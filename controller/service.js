const Service = require('../model/service');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');

exports.aliasTopServices = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  // req.query.fields = 'name,price,description,summary,tags';
  next();
};

exports.getAllServices = catchAsync(async (req, res) => {
  //Executar a query
  const features = new APIFeatures(Service.find(), req.query)
    .filter()
    .limitFields()
    .paginate()
    .sort();
  const services = await features.query;

  res.status(201).json({
    status: 'success',
    results: services.length,
    data: {
      services,
    },
  });
});

exports.getService = catchAsync(async (req, res) => {
  const service = await Service.findById(req.params.id);

  res.status(201).json({
    status: 'success',
    data: {
      service,
    },
  });
});

exports.createService = catchAsync(async (req, res) => {
  const service = await Service.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      service,
    },
  });
});

exports.updateService = catchAsync(async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      service,
    },
  });
});

exports.deleteService = catchAsync(async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id, {
    new: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      service,
    },
  });
});

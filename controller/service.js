const Service = require('../model/service');

exports.getAllServices = async (req, res) => {
  try {
    //Criar uma cópia da query
    const queryObj = { ...req.query };

    //Listar os campos para excluir
    const excludedFields = ['page', 'sort', 'limit', 'fields'];

    //Excluir os campos
    excludedFields.forEach((el) => delete queryObj[el]);

    //Converter para string
    let queryStr = JSON.stringify(queryObj);

    //Criar a string adequada com regex
    queryStr = queryStr.replace(/\b(gt|gte|lte|lt)\b/g, (match) => `$${match}`);

    //Criar a query
    let query = Service.find(JSON.parse(queryStr));

    //Ordenar os campos
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    //Selecionar os campos
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    //Criar a páginação
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('Esta página não existe');
    }

    //Executar a query
    const service = await query;

    res.status(201).json({
      status: 'success',
      data: {
        service,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    res.status(201).json({
      status: 'success',
      data: {
        service,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        service,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        service,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id, {
      new: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        service,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

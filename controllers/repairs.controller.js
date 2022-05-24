const {
  ref,
  uploadBytes,
  getDownloadURL
} = require('firebase/storage');

// utils
const { filterObj } = require('../utils/filterObj');
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');
const { storage } = require('../utils/firebase');

// models
const { Repair } = require('../models/repairs.model');
const { User } = require('../models/user.model');

exports.getAllRepairs = catchAsync(
  async (req, res, next) => {
    const repairs = await Repair.findAll({
      where: { status: 'pending' },
      include: [{ model: User }]
    });

    // Map async:utilizará esta técnica cada vez que necesite algunas operaciones asíncronas dentro de una matriz
    const repairsPromises = repairs.map(async (repair) => {
      // Crea firebase img ref y obtenga la ruta completa
      const imgRef = ref(storage, repair.imgPath);
      const url = await getDownloadURL(imgRef);

      // Actualizar la propiedad profileImgUrl del usuario
      repair.imgPath = url;
      return repair;
    });

    // Resolver cada promesa que nos dio el map ([ Promise { <pending> }, Promise { <pending> } ])
    const repairsResolved = await Promise.all(
      repairsPromises
    );

    res.status(200).json({
      status: 'success',
      data: { repairs: repairsResolved }
    });
  }
);

exports.getRepairById = catchAsync(
  async (req, res, next) => {
    const { repair } = req;

    const imgRef = ref(storage, repair.imgPath);
    const url = await getDownloadURL(imgRef);

    repair.imgPath = url;

    res.status(200).json({
      status: 'success',
      data: { repair }
    });
  }
);

exports.createNewDate = catchAsync(
  async (req, res, next) => {
    const { sessionUser } = req;
    const { date, comments } = req.body;
    // creamos la ref con el storage y la ruta donde esta la img y de como se queremos q se llame en el storage,
    const imgRef = ref(
      storage,
      `repairs/${req.file.originalname}`
    );

    // los bytes q queremos q firebase almacene le pasamos la referencia  y el buffer
    const imgUploaded = await uploadBytes(
      imgRef,
      req.file.buffer
    );

    const newRepair = await Repair.create({
      date,
      computerNumber: Math.floor(Math.random() * 1000),
      comments,
      userId: sessionUser.id,
      imgPath: imgUploaded.metadata.fullPath
    });

    res.status(201).json({
      status: 'success',
      data: { newRepair }
    });
  }
);

exports.updateRepair = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;

    const data = filterObj(req.body, 'status');

    const repair = await Repair.findOne({
      where: { id, status: 'pending' }
    });

    if (!repair) {
      return next(
        new AppError(404, 'repair not found given that id')
      );
    }

    await repair.update({ ...data });

    res.status(204).json({ status: 'success' });
  }
);

exports.deleteRepair = catchAsync(
  async (req, res, next) => {
    const { repair } = req;

    await repair.update({ status: 'cancelled' });

    res.status(204).json({ status: 'success' });
  }
);

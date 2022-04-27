const { Repair } = require('../models/repairs.model');

const repairExist = async (req, res, next) => {
  try {
    const { id } = req.params;

    const repair = await Repair.findOne({
      where: { id }
    });

    if (!repair) {
      return res.status(404).json({
        status: 'error',
        message: 'repair not found given that id'
      });
    }

    req.repair = repair;
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = { repairExist };

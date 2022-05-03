const express = require('express');

// middlewares
const {
  repairExist
} = require('../middlewares/repairs.middlewares');
const {
  createRepairValidator,
  validateResult
} = require('../middlewares/validations.middlewares');

const {
  getAllRepairs,
  getRepairById,
  createNewDate,
  updateRepair,
  deleteRepair
} = require('../controllers/repairs.controller');

const router = express.Router();

router.get('/', getAllRepairs);

router.get('/:id', repairExist, getRepairById);

router.post(
  '/',
  createRepairValidator,
  validateResult,
  createNewDate
);

router.patch('/:id', updateRepair);

router.delete('/:id', repairExist, deleteRepair);

module.exports = { repairRouter: router };

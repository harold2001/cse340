const express = require('express');
const router = new express.Router();
const utilities = require('../utilities/');
const invController = require('../controllers/invController');
const invValidate = require('../utilities/inventory-validation');

router.get('/', utilities.handleErrors(invController.buildVehicleManagement));
router.get(
  '/new/classification',
  utilities.handleErrors(invController.buildAddClassification)
);
router.get(
  '/new/inventory',
  utilities.handleErrors(invController.buildAddInventory)
);

// Route to build inventory by classification view
router.get(
  '/type/:classificationId',
  utilities.handleErrors(invController.buildByClassificationId)
);

router.get(
  '/detail/:itemId',
  utilities.handleErrors(invController.buildByItemId)
);

router.post(
  '/new/classification',
  invValidate.newClassificationRules(),
  invValidate.checkNewClassificationData,
  utilities.handleErrors(invController.createNewClassification)
);

router.post(
  '/new/inventory',
  invValidate.newInventoryRules(),
  invValidate.checkNewInventoryData,
  utilities.handleErrors(invController.createNewInventory)
);

module.exports = router;

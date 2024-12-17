const express = require('express');
const router = new express.Router();
const utilities = require('../utilities/');
const invController = require('../controllers/invController');
const invValidate = require('../utilities/inventory-validation');

router.get(
  '/',
  utilities.checkAdminEmployee,
  utilities.handleErrors(invController.buildVehicleManagement)
);
router.get(
  '/new/classification',
  utilities.checkAdminEmployee,
  utilities.handleErrors(invController.buildAddClassification)
);
router.get(
  '/new/inventory',
  utilities.checkAdminEmployee,
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
  utilities.checkAdminEmployee,
  invValidate.newClassificationRules(),
  invValidate.checkNewClassificationData,
  utilities.handleErrors(invController.createNewClassification)
);

router.post(
  '/new/inventory',
  utilities.checkAdminEmployee,
  invValidate.newInventoryRules(),
  invValidate.checkNewInventoryData,
  utilities.handleErrors(invController.createNewInventory)
);

router.get(
  '/getInventory/:classification_id',
  utilities.checkAdminEmployee,
  utilities.handleErrors(invController.getInventoryJSON)
);

router.get(
  '/edit/:inv_id',
  utilities.checkAdminEmployee,
  utilities.handleErrors(invController.editInventoryView)
);

router.get(
  '/delete/:inv_id',
  utilities.checkAdminEmployee,
  utilities.handleErrors(invController.deleteInventoryView)
);

router.post(
  '/update/',
  utilities.checkAdminEmployee,
  invValidate.newInventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

router.post(
  '/delete/',
  utilities.checkAdminEmployee,
  invValidate.deleteInventoryRules(),
  invValidate.checkDeleteData,
  utilities.handleErrors(invController.deleteInventory)
);

module.exports = router;

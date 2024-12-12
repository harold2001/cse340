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

router.get(
  '/getInventory/:classification_id',
  utilities.handleErrors(invController.getInventoryJSON)
);

router.get(
  '/edit/:inv_id',
  utilities.handleErrors(invController.editInventoryView)
);

router.get(
  '/delete/:inv_id',
  utilities.handleErrors(invController.deleteInventoryView)
);

router.post(
  '/update/',
  invValidate.newInventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

router.post(
  '/delete/',
  invValidate.deleteInventoryRules(),
  invValidate.checkDeleteData,
  utilities.handleErrors(invController.deleteInventory)
);

module.exports = router;

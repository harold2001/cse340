const invModel = require('../models/inventory-model');
const utilities = require('../utilities/');

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className =
    data[0]?.classification_name ??
    (await invModel.getClassificationNameById(classification_id));

  res.render('./inventory/classification', {
    title: className + ' vehicles',
    nav,
    grid,
  });
};

invCont.buildByItemId = async function (req, res, next) {
  const item_id = req.params.itemId;
  const data = await invModel.getInventoryByItemId(item_id);
  const grid = await utilities.buildItemGrid(data);
  let nav = await utilities.getNav();
  res.render('./inventory/classification', {
    title: `${data.inv_year} ${data.inv_make} ${data.inv_model}`,
    nav,
    grid,
  });
};

invCont.buildVehicleManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render('./inventory/management', {
    title: 'Vehicle Management',
    nav,
    errors: null,
  });
};

invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render('./inventory/add-inventory', {
    title: 'Add Inventory',
    nav,
    errors: null,
    selectClassification: await utilities.buildClassificationList(),
  });
};

invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render('./inventory/add-classification', {
    title: 'Add Classification',
    nav,
    errors: null,
  });
};

invCont.createNewClassification = async function (req, res, next) {
  const { classification_name } = req.body;
  const data = await invModel.createNewClassification(classification_name);
  let nav = await utilities.getNav();
  if (data) {
    req.flash(
      'notice',
      `The ${classification_name} classification was successfully added.`
    );
    res.status(201).render('./inventory/management', {
      title: 'Vehicle Management',
      nav,
      errors: null,
    });
  } else {
    req.flash('notice', 'Sorry, the creation failed.');
    res.status(501).render('./inventory/add-classification', {
      title: 'Add Clasification',
      nav,
      errors: null,
    });
  }
};

invCont.createNewInventory = async function (req, res, next) {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
  } = req.body;

  const data = await invModel.createNewInventory(
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color
  );
  let nav = await utilities.getNav();
  if (data) {
    req.flash('notice', `The ${inv_make} ${inv_model} was successfully added.`);
    res.status(201).render('./inventory/management', {
      title: 'Vehicle Management',
      nav,
      errors: null,
    });
  } else {
    req.flash('notice', 'Sorry, the creation failed.');
    res.status(501).render('./inventory/add-inventory', {
      title: 'Add Inventory',
      nav,
      selectClassification: await utilities.buildClassificationList(
        classification_id
      ),
      errors: null,
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    });
  }
};

module.exports = invCont;

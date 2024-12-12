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
  const classificationSelect = await utilities.buildClassificationList();
  res.render('./inventory/management', {
    title: 'Vehicle Management',
    nav,
    errors: null,
    classificationSelect,
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
      classificationSelect: await utilities.buildClassificationList(),
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
      classificationSelect: await utilities.buildClassificationList(),
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error('No data returned'));
  }
};

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryByItemId(inv_id);
  const classificationSelect = await utilities.buildClassificationList(
    itemData.classification_id
  );
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render('./inventory/edit-inventory', {
    title: 'Edit ' + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  });
};

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );

  if (updateResult) {
    const itemName = updateResult.inv_make + ' ' + updateResult.inv_model;
    req.flash('notice', `The ${itemName} was successfully updated.`);
    res.redirect('/inv/');
  } else {
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    );
    const itemName = `${inv_make} ${inv_model}`;
    req.flash('notice', 'Sorry, the insert failed.');
    res.status(501).render('inventory/edit-inventory', {
      title: 'Edit ' + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};

/* ***************************
 *  Build delete inventory view
 * ************************** */
invCont.deleteInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryByItemId(inv_id);
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render('./inventory/delete-confirm', {
    title: 'Delete ' + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  });
};

/* ***************************
 *  Delete Inventory Item
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const { inv_id, inv_make, inv_model, inv_price, inv_year } = req.body;
  const deleteResult = await invModel.deleteInventoryItem(inv_id);

  if (deleteResult) {
    const itemName = inv_make + ' ' + inv_model;
    req.flash('notice', `The ${itemName} was successfully deleted.`);
    res.redirect('/inv/');
  } else {
    const itemName = `${inv_make} ${inv_model}`;
    req.flash('notice', 'Sorry, the delete failed.');
    res.status(501).render('inventory/delete-inventory', {
      title: 'Delete ' + itemName,
      nav,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
    });
  }
};

module.exports = invCont;

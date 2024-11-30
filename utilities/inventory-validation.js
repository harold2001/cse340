const utilities = require('.');
const { body, validationResult } = require('express-validator');
const validate = {};

/*  **********************************
 *  New Classification Validation Rules
 * ********************************* */
validate.newClassificationRules = () => {
  return [
    // Validate classification name: alphabetic characters only, no spaces
    body('classification_name')
      .trim()
      .notEmpty()
      .withMessage('Classification name is required.')
      .matches(/^[A-Za-z]+$/)
      .withMessage('Provide a correct classification name.'),
  ];
};

/* ******************************
 * Check New Classification Data and Return Errors
 * ***************************** */
validate.checkNewClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorsFiltered = errors
      .array()
      .filter(e => e.msg !== 'Invalid value');
    errors.errors = errorsFiltered;

    let nav = await utilities.getNav();
    res.render('inventory/add-classification', {
      errors,
      title: 'Add Classification',
      nav,
      classification_name,
    });
    return;
  }
  next();
};

module.exports = validate;

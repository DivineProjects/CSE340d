const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const validate = {}

/*  **********************************
  *  Classification Data Validation Rules
  * ********************************* */
validate.classificationRules = () => {
    return [
      // classification_name is required and must be string
      body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .matches(/^[A-Za-z]+$/)
        .withMessage("Only alphabetic characters allowed, at least 3 characters long, and no spaces") // on error this message is sent.
        .custom(async (classification_name) => {
          const classificationExists = await invModel.checkExistingClassification(classification_name)
          if (classificationExists){
              throw new Error("Classification already exists. Please use different classification name")
              }
        }),
    ]
  }


/* ******************************
 * Check data and return errors or continue to adding classification
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/add-classification", {
        errors,
        title: "Add Classification",
        nav,
        classification_name,
      })
      return
    }
    next()
  }

/*  **********************************
  *  New Vehicle Data Validation Rules
  * ********************************* */
validate.newVehicleRules = () => {
    return [
      // inv_make: must be alphabetic and non-empty
      body('inv_make')
        .trim()
        .escape()
        .notEmpty()
        .isAlpha()
        .withMessage('Make must only contain alphabetic characters.'),

      // inv_model: must be alphanumeric and non-empty
      body('inv_model')
        .trim()
        .escape()
        .notEmpty()
        .isAlpha()
        .withMessage('Model must contain only alphanumeric characters.'),

      // inv_year: must be a 4-digit number (exactly 4 digits)
      body('inv_year')
        .trim()
        .notEmpty()
        .isLength({ min: 4, max: 4 })
        .isInt({ min: 1880 })
        .withMessage('Year must be a numeric value and exactly 4 digits.'),

      // inv_description: should be at least 10 characters
      body('inv_description')
        .trim()
        .notEmpty()
        .isLength({ min: 10 })
        .notEmpty()
        .withMessage('Description is required.'),

      // inv_image: must be a valid URL
      body('inv_image')
        .trim()
        .isURL()
        .notEmpty()
        .withMessage('Image URL must be valid'),

      // inv_thumbnail: must be a valid URL
      body('inv_thumbnail')
        .trim()
        .isURL()
        .notEmpty()
        .withMessage('Thumbnail URL must be valid.'),

      // inv_price: must be a positive number
      body('inv_price')
        .trim()
        .isFloat({ gt: 0 })
        .notEmpty()
        .withMessage('Price must be a positive number.'),

      // inv_miles: must be a non-negative integer
      body('inv_miles')
        .trim()
        .isInt({ min: 0 })
        .notEmpty()
        .withMessage('Miles must be a non-negative integer.'),

      // inv_color: must be alphabetic and non-empty
      body('inv_color')
        .trim()
        .escape()
        .notEmpty()
        .isAlpha()
        .withMessage('Color must contain only alphabetic characters.'),

      // classification_id: must be a positive integer
      body('classification_id')
        .trim()
        .isInt({ gt: 0 })
        .notEmpty()
        .withMessage('Classification ID must be a positive integer.')
        .custom(async (classification_id) => {
          const classificationExists = await invModel.checkExistingClassificationId(classification_id)
          if (!classificationExists){
              throw new Error("Classification Id does not exist. Please use different classification Id")
              }
        }),
    ]
}


/* ******************************
 * Check data and return errors or continue to New Vehicle registration
 * ***************************** */
validate.checkNewVehicleData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
        let classification = await utilities.buildClassificationList(classification_id)
        res.render("inventory/add-inventory", {
          title: "Add New Vehicle",
          nav,
          classification,
          inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id,
          errors,
        })

      return
    }
    next()
  }



  module.exports = validate



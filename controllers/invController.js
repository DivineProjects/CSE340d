const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  let className = ""
  if (data[0]){
    className = data[0].classification_name
  }
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory by single inventory (ID) view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getInventoryByInvId(inv_id)
  const grid = await utilities.buildInventorySingleGrid(data)
  let nav = await utilities.getNav()
  let vehicleName = "";
  if (data) {
    vehicleName = `${data.inv_make} ${data.inv_model} (${data.inv_year})`
  } 
  res.render("./inventory/vehicle", {
    title: vehicleName,
    nav,
    grid,
  })
}


/* ***************************
 *  Build inventory Management view
 * ************************** */
invCont.buildInvManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors : null,
    classificationSelect,
  })
}

/* ****************************************
*  Deliver add classification view
* *************************************** */
invCont.buildInvClassification = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    })
}


/* ****************************************
*  Add Classification
* *************************************** */
invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body
 
  const regResult = await invModel.registerClassification(
    classification_name
  )

  if (regResult) {
    req.flash(
      "notice-success",
      `Congratulations,  ${classification_name}  class Added successfully`
    )
    nav = await utilities.getNav()
    res.status(201).redirect("/inv")
  } else {
    req.flash("notice", "Sorry, Adding Classification failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    })
  }
}


/* ****************************************
*  Deliver New Inventory view
* *************************************** */
invCont.buildNewInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classification_id = req.body.classification_id || null
  let classification = await utilities.buildClassificationList(classification_id)
  res.render("inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    classification,
    classification_id, 
    errors: null,
  })
}


/* ****************************************
*  Add Classification
* *************************************** */
invCont.addNewVehicle = async function (req, res) {
  let nav = await utilities.getNav()
  const { inv_make, inv_model, inv_year, inv_description, inv_image,
    inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body

  const regResult = await invModel.registerNewVehile(
    inv_make, inv_model, inv_year, inv_description, inv_image,
    inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
  )

  if (regResult) {
    req.flash(
      "notice-success",
      "New Vehicle added sucessfully"
    )
    // res.status(201).render("inventory/add-inventory", {
    //   title: "Add New Inventory",
    //   nav,
    //   errors: null,
    // })
    res.status(201).redirect("/inv")
  } else {
    req.flash("notice", "Sorry, Adding New Vehicle failed.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      errors: null,
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}




module.exports = invCont
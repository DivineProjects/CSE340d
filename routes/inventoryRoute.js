// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const regValidate = require('../utilities/inventory-validation')


// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId)

// Route to build inventory by single Id
router.get("/detail/:invId", invController.buildByInvId)
//Route to build Inventory Management View
router.get("/", invController.buildInvManagement)

// Route to  build classification View
router.get("/add-classification", invController.buildInvClassification)
//Route to Post / add new classification
router.post("/add-classification",
    regValidate.classificationRules(), 
    regValidate.checkClassificationData, 
    utilities.handleErrors(invController.addClassification)
)

// Route to  build New Inventory View
router.get("/add-inventory", invController.buildNewInventory)
router.post("/add-inventory",
    regValidate.newVehicleRules(), 
    regValidate.checkNewVehicleData, 
    utilities.handleErrors(invController.addNewVehicle)
)
// Route to Post New Vehicle


module.exports = router;
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const {isLoggedin, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

//Index route
router.route("/")
.get(wrapAsync(listingController.index)) 
.post(isLoggedin,upload.single('listing[image]'),wrapAsync(listingController.newListingAdd));                                      

//new Route
router.get("/new",isLoggedin,listingController.newForm);

//Show update ,delete route
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedin,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.editListing))
.delete(isLoggedin,isOwner,wrapAsync(listingController.deleteListing));

//edit route
router.get("/:id/edit",isLoggedin,isOwner,wrapAsync(listingController.editForm));

module.exports = router;
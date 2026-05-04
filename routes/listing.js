const express = require('express');
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../models/listing.js');
const router = express.Router({ mergeParams: true });
const Review = require("../models/review.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage })


router
.route("/")
.get( wrapAsync(listingController.index))
.post(isLoggedIn,upload.single("listing[image]"),validateListing, wrapAsync(listingController.createListing));


//new route to display form for creating a new listing
router.get('/new',isLoggedIn, listingController.renderNewForm);

//create edit 
router
.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(validateListing,isLoggedIn, isOwner, upload.single("listing[image]"),wrapAsync(listingController.updateListing))
.delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));




//Edit Route
router.get("/:id/edit", isLoggedIn , isOwner , wrapAsync(listingController.renderEditListing));

module.exports = router;
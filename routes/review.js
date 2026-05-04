const express = require("express");
const router = express.Router({ mergeParams: true });
const listingController = require("../controllers/review.js");

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");


const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

const reviewController = require("../controllers/review.js");

const {validateReview, isLoggedIn ,isReviewAuthor} = require("../middleware.js");


// Add Review
router.post("/", isLoggedIn,validateReview, wrapAsync(reviewController.createReview));

//delete route to remove a review from a listing
router.delete("/:reviewId",isLoggedIn, isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports = router;
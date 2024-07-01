const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync");
const {isLoggedin, validateReview, isAuthor} = require("../middleware.js");
const reviewControllers = require("../controllers/review.js");

//adding review
router.post("/",isLoggedin,validateReview,wrapAsync(reviewControllers.newReview));

//delete review route
router.delete("/:reviewId",isLoggedin,isAuthor,wrapAsync(reviewControllers.deleteReview));

module.exports = router;
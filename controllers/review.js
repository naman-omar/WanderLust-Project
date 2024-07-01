const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.newReview = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = res.locals.currUser._id;
    listing.reviews.push(newReview);
    await listing.save();
    await newReview.save();
    req.flash("success","New Review Added!");
    console.log("new review saved");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteReview = async(req,res)=>{
    let {id,reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, {$pull:{reviews: reviewId}});
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
    console.log("deletion Successful!");
};
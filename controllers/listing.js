const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req,res)=>{
    let allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.newForm = (req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.newListingAdd = async (req,res)=>{
    const response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
    .send();
    let url = req.file.path;
    let filename = req.file.filename;
    let newListing = new Listing(req.body.listing);
    newListing.owner = res.locals.currUser._id;
    newListing.image = {url,filename};
    newListing.geometry = response.body.features[0].geometry;
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
};

module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({path:"reviews",populate: {path: "author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
};

module.exports.editForm = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    let imageUrl = listing.image.url;
    imageUrl = imageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listing,imageUrl});
};

module.exports.editListing = async (req,res)=>{
    let {id} = req.params;
    let newListing = await Listing.findByIdAndUpdate(id, {...req.body.listing},{new:true});
    if(req.file){
        let url = req.file.path;
        let filename = req.file.filename;
        newListing.image = {url,filename};
        await newListing.save();
    }
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};
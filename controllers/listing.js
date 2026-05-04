const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}; 

module.exports.renderNewForm = (req, res) => {
        res.render("listings/new.ejs");
};


module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)   
    .populate({path:"reviews",
      populate:{
        path:"author",
      },
    })
    .populate("owner");
       if(!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
     console.log(listing);
    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next ) => {  
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url, "..", filename);
     const newListing = new Listing(req.body.listing);    
     newListing.owner = req.user._id;
     newListing.image = { url, filename };
     await newListing.save();
     console.log(newListing);
     req.flash("success", "new Listing created successfully");
     res.redirect('/listings');    
    };

module.exports.renderEditListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
      if(!listing) { 
       
        throw new ExpressError(404,"Listing Not Found");
        res.redirect("/listings");
    }
    let originaImagelUrl = listing.image.url;
   originaImagelUrl= originaImagelUrl.replace("/upload", "/upload/w_200");  
  res.render("listings/edit.ejs", { listing, originaImagelUrl });
};


module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    
    if(typeof req.file !== "undefined") {
      let url = req.file.path;
      let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
    }
  req.flash("success", "Listing updated successfully");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deleteListing = await Listing.findByIdAndDelete(id);
  console.log(`Listing with id ${deleteListing} has been deleted`);
  req.flash("success", "Listing Deleted successfully");
  res.redirect("/listings");
};
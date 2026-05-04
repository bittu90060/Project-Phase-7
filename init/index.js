const mongoose = require('mongoose');
const initData = require('./data');
const Listing = require('../models/listing');

const MONGO_URI = 'mongodb://localhost:27017/wanderlust';

main()
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URI);
}

const initDB = async () => {
    await Listing.deleteMany({});

    const updatedData = initData.data.map((obj) => ({
        ...obj,
        owner: "69ebad033c333b5292845ee3"
    }));

    await Listing.insertMany(updatedData);

    console.log("Database Initialized");
};

initDB();
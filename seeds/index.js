const mongoose = require('mongoose');
const cities = require('./cities');

const { places, descriptors } = require('./seedHelpers');

// Models
const Campground = require('./../models/campGround');

// Connect Local Database
connectDb().catch(err => console.log(err));

// Function to connect Local db
async function connectDb() {
  await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {}).then(() => {
    console.log("Database Connected");
  })
}

const sample = arr => arr[Math.floor(Math.random() * arr.length)];

const seedDb = async () => {
    await Campground.deleteMany({});
    for (let i=0; i<50; i++) {
        const randomNum = Math.floor(Math.random() * 212 + 1);
        const price = Math.floor(Math.random() * 20 + 1);
        const camp = new Campground({
            location: `${cities[randomNum].city}, ${cities[randomNum].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: `https://picsum.photos/400?random=${Math.random()}`,
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magnam nam labore architecto tempora deserunt, dolorum incidunt similique quod eos quos modi dolores? Porro ad laudantium sunt aspernatur a provident repellendus.',
            price: price
        })
        await camp.save();
    }
}

seedDb().then( () => {
    mongoose.connection.close();
}
);

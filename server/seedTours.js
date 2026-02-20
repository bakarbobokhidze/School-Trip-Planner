const mongoose = require('mongoose');
const Tour = require('./models/Tour');

const tourData = [
  {
    name: "Sataflia",
    basePrice: 15,
    rating: 4.9,
    duration: "Full Day",
    description: "Explore dinosaur footprints, ancient caves, and stunning glass walkways in this natural wonder.",
    tags: ["Nature", "Science", "Adventure"],
    image: "https://cdn.georgiantravelguide.com/storage/files/sataflia-satafliis-aghkvetili-sataplia-9.jpg"
  },
  {
    name: "Gelati Monastery",
    basePrice: 20,
    rating: 4.8,
    duration: "Half Day",
    description: "UNESCO World Heritage site with breathtaking medieval frescoes and rich Georgian history.",
    tags: ["History", "Culture", "UNESCO"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM5dikgFOsKQBXEzpFV9JYkbRhsZgcDsIdRg&s"
  },
  {
    name: "Signagi",
    basePrice: 40,
    rating: 4.9,
    duration: "Full Day",
    description: "The 'City of Love' with panoramic Alazani Valley views and charming cobblestone streets.",
    tags: ["Culture", "Wine Region", "Views"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRfQqqNoHc9pidFPX5vOqERb4FR4SIZndmHg&s"
  },
  {
    name: "Motsameta",
    basePrice: 10,
    rating: 4.7,
    duration: "Half Day",
    description: "Cliff-edge monastery surrounded by lush forests and the scenic Tskaltsitela River canyon.",
    tags: ["Nature", "History", "Scenic"],
    image: "https://cdn.georgiantravelguide.com/storage/thumbnails/imereti-motsameta-monastery-2.jpg"
  }
];

mongoose.connect("")
  .then(async () => {
    console.log("Connected to MongoDB for seeding...");
    
    await Tour.deleteMany({});

    await Tour.insertMany(tourData);
    
    console.log("✅ ბაზა შეივსო 4 ტურით!");
    process.exit(); 
  })
  .catch(err => {
    console.error("❌ შეცდომა სიდინგისას:", err);
    process.exit(1);
  });

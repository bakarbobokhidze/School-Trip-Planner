const mongoose = require('mongoose');
require('dotenv').config();

const Bus = require('./models/Bus');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to DB for seeding...");
    
    await Bus.deleteMany({});

    const busData = [
      {
        name: "Mercedes Sprinter",
        type: "Minibus",
        capacity: 20,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDWHZTJzm6DSuifwbDkVY37Bap8J1s0T93Fg&s",
        driverName: "გიორგი",
        rating: 4.8,
        pricePerKm: 1.5,
        features: ["AC", "WiFi"]
      },
      {
        name: "Setra S415",
        type: "Coach",
        capacity: 50,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBYePASYWmYnCbRbvINpj7-Ms-qlXmhS-tiA&s",
        driverName: "დათო",
        rating: 4.9,
        pricePerKm: 2.5,
        features: ["AC", "TV", "Toilet", "WiFi"]
      },
      {
        name: "Isuzu Turquoise",
        type: "Midibus",
        capacity: 30,
        image: "https://www.lectura-specs.com/models/renamed/detail_max_retina/touring-motor-choaches-turquoise-isuzu.png",
        driverName: "ლევანი",
        rating: 4.5,
        pricePerKm: 2.0,
        features: ["AC", "Microphone"]
      }
    ];

    await Bus.insertMany(busData);
    console.log("✅ ბაზა შეივსო ავტობუსებით!");
    process.exit();
  })
  .catch(err => console.log(err));
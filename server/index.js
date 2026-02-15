const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
require('dotenv').config();

const Bus = require('./models/Bus');
const Tour = require('./models/Tour');
const Booking = require('./models/Booking');

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const chatHistories = {};

const app = express();
app.use(cors({
  origin: 'http://localhost:8080', 
  credentials: true
}));
app.use(express.json());

app.get('/api/tours', async (req, res) => {
  try {
    const tours = await Tour.find();
    console.log("Tours sent to frontend:", tours.length);
    res.json(tours);
  } catch (err) {
    console.error("Error fetching tours:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

async function getContextFromDB() {
    try {
        const tours = await Tour.find();
        const buses = await Bus.find();
        
        let contextText = "შენ ხარ School Trip Planner-ის ასისტენტი. აი ჩვენი აქტუალური მონაცემები ბაზიდან:\n";
        
        contextText += "ტურები:\n" + tours.map(t => 
            `- ${t.name}: ${t.price}ლ, აღწერა: ${t.description}`
        ).join("\n");
        
        contextText += "\nტრანსპორტი (ავტობუსები):\n" + buses.map(b => 
            `- ${b.name} (${b.capacity} ადგილი)`
        ).join("\n");

        return contextText + "\nუპასუხე მოკლედ და მეგობრულად.";
    } catch (err) {
        console.error("ბაზიდან ინფოს წაკითხვის შეცდომა:", err);
        return "შენ ხარ School Trip Planner-ის ასისტენტი. ამჟამად ბაზასთან კავშირი შეფერხებულია, მაგრამ ეცადე ზოგადად დაეხმარო.";
    }
}

app.get('/api/buses', async (req, res) => {
  try {
    const { capacity } = req.query;
    let query = {};
    if (capacity) {
      query.capacity = { $gte: parseInt(capacity) };
    }
    const buses = await Bus.find(query);
    res.json(buses);
  } catch (err) {
    res.status(500).json({ error: "ვერ მოხერხდა ავტობუსების წამოღება" });
  }
});

async function handleMessage(sender_psid, received_message) {
    const systemInstruction = await getContextFromDB();
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    if (!chatHistories[sender_psid]) {
        chatHistories[sender_psid] = [
            {
                role: "user",
                parts: [{ text: systemInstruction }]
            },
            {
                role: "model",
                parts: [{ text: "გავიგე, მაქვს წვდომა ბაზის მონაცემებთან. მზად ვარ!" }]
            }
        ];
    }

    chatHistories[sender_psid].push({
        role: "user",
        parts: [{ text: received_message }]
    });

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: chatHistories[sender_psid]
            })
        });

        const data = await response.json();

        if (data.candidates && data.candidates[0].content) {
            const responseText = data.candidates[0].content.parts[0].text;
            chatHistories[sender_psid].push({
              role: "model",
              parts: [{ text: responseText }]
            });
            if (chatHistories[sender_psid].length > 10) {
              chatHistories[sender_psid].splice(1, 2);
            }
            callSendAPI(sender_psid, { "text": responseText });
        }
    } catch (error) {
        console.error("Gemini API Error:", error);
        callSendAPI(sender_psid, { "text": "ბოდიში, ტექნიკური ხარვეზია. სცადეთ მოგვიანებით." });
    }
}

app.get('/webhook', (req, res) => {
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
          res.sendStatus(403);
        }
    }
});

app.post('/webhook', (req, res) => {
    let body = req.body;

    if (body.object === 'page') {
        body.entry.forEach(function(entry) {
            if (entry.messaging && entry.messaging[0]) {

                let webhook_event = entry.messaging[0];

                let sender_psid = webhook_event.sender.id;

                if (webhook_event.message && webhook_event.message.text) {
                    handleMessage(sender_psid, webhook_event.message.text);
                }
            }
        });
        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }
});

async function getAllDataForAI() {
    try {
        const tours = await Tour.find();
        const buses = await Bus.find();

        return `
        აქტუალური ინფორმაცია ბაზიდან:
        ტურები: ${JSON.stringify(tours)}
        ავტობუსები: ${JSON.stringify(buses)}
        მნიშვნელოვანი: თუ მომხმარებელს დაჯავშნა უნდა, კითხე: სახელი, ტელეფონი, რომელი ტური, ბავშვების რაოდენობა და თარიღი.
        როცა ყველა ინფორმაციას მოგაწვდის, უთხარი რომ ბუქინგი იგზავნება.
        `;
    } catch (err) {
        return "ინფორმაციის წამოღება ვერ მოხერხდა.";
    }
}

async function createBookingFromAI(bookingData) {
    try {
        const newBooking = new Booking({
            ...bookingData,
            status: 'pending',
            createdAt: new Date()
        });
        await newBooking.save();
        return "ბუქინგი წარმატებით შეიქმნა!";
    } catch (err) {
        return "ბუქინგის შექმნისას დაფიქსირდა შეცდომა.";
    }
}

app.get('/api/admin/bookings', async (req, res) => {
  try {
    console.log("Fetching bookings..."); 

    const bookings = await Booking.find()
      .populate('tourId') 
      .sort({ createdAt: -1 });

    console.log("Bookings found:", bookings.length);
    res.status(200).json(bookings);
  } catch (err) {
    console.error("DETAILED SERVER ERROR:", err); 
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('tourId');
    
    if (!booking) return res.status(404).json({ message: "ბუქინგი ვერ მოიძებნა" });
    
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    const bookingData = {
      ...req.body,
      status: 'pending' 
    };
    const newBooking = new Booking(req.body);
    const savedBooking = await newBooking.save();
    console.log("✅ შეიქმნა ახალი ბუქინგი ID-ით:", savedBooking._id);
    res.status(201).json(savedBooking);
  } catch (err) {
    console.error("ბუქინგის შექმნის შეცდომა:", err);
    res.status(400).json({ error: err.message });
  }
});

app.patch('/api/update-booking/:id', async (req, res) => {
  try {
    const updated = await Booking.findByIdAndUpdate(
      req.params.id, 
      { $set: req.body }, 
      { new: true, strict: false }
    );
    console.log("🔄 ბუქინგი განახლდა:", updated._id);
    res.json(updated);
  } catch (err) {
    console.error("განახლების შეცდომა:", err);
    res.status(400).json({ message: err.message });
  }
});

app.post("/api/auth/google", async (req, res) => {
  const { name, email, image, role } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ 
        name, 
        email, 
        image, 
        role: role || 'member' 
      });
      await user.save();
      console.log("✅ ახალი იუზერი დარეგისტრირდა:", email);
    } else {
      user.image = image;
      await user.save();
      console.log("✅ იუზერი შემოვიდა:", email);
    }

    res.json(user);
  } catch (err) {
    console.error("❌ Auth Error:", err);
    res.status(500).json({ message: "სერვერის შეცდომა ავტორიზაციისას" });
  }
});

app.patch('/api/admin/bookings/:id/status', async (req, res) => {
  try {
    const { status } = req.body; 
    const updated = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/admin/tours', async (req, res) => {
  try {
    const newTour = new Tour(req.body);
    await newTour.save();
    res.status(201).json(newTour);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/admin/tours/:id', async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.json({ message: "ტური წარმატებით წაიშალა" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/tours/:id', async (req, res) => {
  try {
    const updated = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

function callSendAPI(sender_psid, response) {
    let request_body = {
        "recipient": { "id": sender_psid },
        "message": response
    };

    request({
        "uri": "https://graph.facebook.com/v12.0/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err) => {
        if (!err) console.log('პასუხი გაიგზავნა!');
    });
}

//const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

app.post("/api/ai/site-chat", async (req, res) => {
    const { message, history } = req.body;

    try {
        const dbContext = await getAllDataForAI(); 
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

        const sanitizedHistory = (history || []).map(msg => ({
            role: msg.role === "model" ? "model" : "user",
            parts: [{ text: msg.parts[0].text }]
        }));

        const systemPrompt = {
            role: "user",
            parts: [{ text: `
                შენ ხარ SchoolTrip.ge-ს ასისტენტი. 
                ${dbContext}
                
                წესები: 
                - ყოველთვის დათვალე ჯამური ფასი (რაოდენობა * ფასი).
                - ბუქინგისთვის გჭირდება: ტური, რაოდენობა, თარიღი, სახელი, ტელეფონი.
                - როცა ყველაფერი გექნება, დაწერე: [CONFIRMED_BOOKING].
            `}]
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                contents: [
                    systemPrompt, 
                    { role: "model", parts: [{ text: "გავიგე, მზად ვარ!" }] },
                    ...sanitizedHistory, 
                    { role: "user", parts: [{ text: message }] }
                ] 
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error("Gemini API Error:", data.error);
            return res.status(500).json({ error: data.error.message });
        }

        let aiReply = data.candidates[0].content.parts[0].text;

        if (aiReply.includes("[CONFIRMED_BOOKING]")) {
            const newBooking = new Booking({
                customerName: "ჯავშანი ჩატიდან",
                notes: `მომხმარებლის ბოლო მესიჯი: ${message}`,
                status: "pending",
                createdAt: new Date()
            });
            await newBooking.save();
            aiReply = aiReply.replace("[CONFIRMED_BOOKING]", "");
        }

        res.json({ reply: aiReply });
    } catch (err) {
        console.error("SERVER CRASH ERROR:", err);
        res.status(500).json({ error: "შიდა სერვერის შეცდომა" });
    }
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ ბოტი დაუკავშირდა ბაზას'))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 სერვერი მუშაობს ${PORT} პორტზე`));
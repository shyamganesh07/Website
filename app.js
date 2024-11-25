const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Razorpay = require('razorpay');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Simulated Data: 30 Hotels per Location
let hotels = [];
const addHotels = (location, baseId) => {
    for (let i = 1; i <= 30; i++) {
        hotels.push({
            id: baseId + i,
            name: `${location} Hotel ${i}`,
            location: location.toLowerCase(),
            price_per_night: Math.floor(Math.random() * 3000) + 1000, // Price between 1000 and 4000
            availability: Math.random() > 0.2 // 80% chance of being available
        });
    }
};

// Add hotels for each location
addHotels("Ooty", 0);
addHotels("Kodaikanal", 30);
addHotels("Munnar", 60);

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: 'YOUR_KEY_ID', // Replace with your Razorpay Key ID
    key_secret: 'YOUR_KEY_SECRET' // Replace with your Razorpay Key Secret
});

// Search Hotels - POST /searchHotels
app.post('/searchHotels', (req, res) => {
    const { location } = req.body;
    if (!location) {
        return res.status(400).json({ error: 'Location is required' });
    }
    const results = hotels.filter(h => h.location.toLowerCase() === location.toLowerCase() && h.availability);
    res.json(results);
});

// Make Payment - POST /makePayment
app.post('/makePayment', (req, res) => {
    const { hotelId, paymentMethod } = req.body;
    const hotel = hotels.find(h => h.id == hotelId);

    if (hotel) {
        res.json({
            success: true,
            message: `Payment successful! Booking confirmed for ${hotel.name} via ${paymentMethod}.`
        });
    } else {
        res.json({
            success: false,
            message: "Payment failed. Hotel not found."
        });
    }
});

// Razorpay Integration - POST /createOrder
app.post('/createOrder', async (req, res) => {
    const { amount, currency } = req.body; // Amount in smallest currency unit (e.g., paise for INR)

    const options = {
        amount: amount * 100, // Convert to paise (e.g., 2000 INR => 200000 paise)
        currency: currency || "INR", // Default is INR
        receipt: "order_rcptid_11" // Unique identifier for this transaction
    };

    try {
        const order = await razorpay.orders.create(options);
        res.json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency
        });
    } catch (error) {
        res.json({
            success: false,
            message: "Unable to create order",
            error: error.message
        });
    }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

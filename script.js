// Simulated Data: 30 Hotels per Location
const hotels = [];
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

// DOM Elements
const locationInput = document.getElementById("location");
const checkinInput = document.getElementById("checkin");
const checkoutInput = document.getElementById("checkout");
const searchButton = document.getElementById("searchHotels");
const hotelListElement = document.getElementById("hotelList");
const resultsSection = document.getElementById("results");
const payNowButton = document.getElementById("payNow");
const paymentMethodSelect = document.getElementById("paymentMethod");

// Event Listener for Searching Hotels
searchButton.addEventListener("click", function () {
    const location = locationInput.value;
    const checkinDate = checkinInput.value;
    const checkoutDate = checkoutInput.value;

    // Validate inputs
    if (!location || !checkinDate || !checkoutDate) {
        alert("Please fill out all fields!");
        return;
    }

    // Filter hotels based on the selected location and availability
    const availableHotels = hotels.filter(hotel => 
        hotel.location === location.toLowerCase() && hotel.availability
    );

    if (availableHotels.length === 0) {
        alert("No hotels available for the selected location!");
        return;
    }

    // Clear the previous results
    hotelListElement.innerHTML = "";

    // Display available hotels in the results section
    availableHotels.forEach(hotel => {
        const listItem = document.createElement("li");
        listItem.classList.add("hotel-item");
        listItem.innerHTML = `
            <span>${hotel.name}</span>
            <span>₹${hotel.price_per_night}/night</span>
        `;
        hotelListElement.appendChild(listItem);
    });

    // Show the results section
    resultsSection.style.display = "block";
});

// Event Listener for the Pay Now button
payNowButton.addEventListener("click", function () {
    const paymentMethod = paymentMethodSelect.value;
    
    if (paymentMethod === "gpay") {
        const selectedHotel = document.querySelector(".hotel-item.selected");

        if (!selectedHotel) {
            alert("Please select a hotel before proceeding to payment.");
            return;
        }

        const hotelName = selectedHotel.querySelector("span").textContent;
        const amount = selectedHotel.querySelector("span:nth-child(2)").textContent.split("₹")[1];
        const upiId = "ganesh442006@okicici"; // Replace with your UPI ID
        const transactionNote = `Hotel Booking Payment for ${hotelName}`;

        // Construct UPI link
        const upiLink = `upi://pay?pa=${upiId}&pn=HotelBooking&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;

        // Redirect to the UPI payment app (Google Pay, PhonePe, etc.)
        window.location.href = upiLink;
    } else {
        alert("Currently, only Google Pay is supported for payment in this demo.");
    }
});

// Event listener for selecting a hotel
hotelListElement.addEventListener("click", function (event) {
    if (event.target.tagName === "LI") {
        const selectedHotel = event.target;

        // Toggle selection state
        selectedHotel.classList.toggle("selected");

        // Deselect other hotels
        const otherHotels = document.querySelectorAll(".hotel-item");
        otherHotels.forEach(hotel => {
            if (hotel !== selectedHotel) {
                hotel.classList.remove("selected");
            }
        });
    }
});

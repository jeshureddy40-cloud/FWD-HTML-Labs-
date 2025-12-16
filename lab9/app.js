// PUBLIC TRAVEL-LIKE API (tourist spots)
const BASE_URL = "https://api.geoapify.com/v2/places";
const API_KEY = "YOUR_API_KEY_HERE"; // get a free key from geoapify.com

const loadTripsBtn = document.getElementById("loadTripsBtn");
const regionSelect = document.getElementById("regionSelect");
const statusEl = document.getElementById("status");
const tripsContainer = document.getElementById("tripsContainer");

/**
 * Helper: build bounding boxes for different regions
 * (simple demo data, not geographically precise)
 */
function getRegionBounds(region) {
  switch (region) {
    case "europe":
      return "rect:-10.0,55.0,30.0,40.0";
    case "asia":
      return "rect:60.0,55.0,140.0,5.0";
    case "americas":
      return "rect:-130.0,60.0,-30.0,0.0";
    default:
      return "rect:-10.0,55.0,30.0,40.0";
  }
}

/**
 * Async function using fetch + await
 * Fetches places for a given region.
 */
async function fetchTripsByRegion(region) {
  const bounds = getRegionBounds(region);
  const url = `${BASE_URL}?categories=tourism.sights&filter=${bounds}&limit=8&apiKey=${API_KEY}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch trips for region " + region);
  }
  const data = await response.json();
  return data.features || [];
}

/**
 * Promise chaining example:
 * After loading trips, make a second request to fetch more
 * details for the first trip (simulated here).
 */
function fetchExtraTripDetails(trip) {
  // Simulate an additional API call with a Promise
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        rating: (Math.random() * 5).toFixed(1),
        reviews: Math.floor(Math.random() * 500) + 20
      });
    }, 500);
  });
}

/**
 * Render trips in DOM
 */
function renderTrips(trips) {
  tripsContainer.innerHTML = "";

  if (!trips.length) {
    tripsContainer.textContent = "No trips found for this region.";
    return;
  }

  trips.forEach((trip) => {
    const props = trip.properties || {};
    const card = document.createElement("article");
    card.className = "trip-card";

    card.innerHTML = `
      <div class="trip-title">${props.name || "Unknown attraction"}</div>
      <div class="trip-location">
        ${props.city || props.country || "Unknown location"}
      </div>
      <p class="trip-description">
        Category: ${props.categories ? props.categories.join(", ") : "N/A"}
      </p>
      <div class="trip-meta">Loading details…</div>
    `;

    tripsContainer.appendChild(card);

    // Promise chaining: get extra details and then update UI
    fetchExtraTripDetails(trip)
      .then((details) => {
        card.querySelector(".trip-meta").textContent =
          `Rating: ${details.rating} / 5 · ${details.reviews} reviews`;
      })
      .catch(() => {
        card.querySelector(".trip-meta").textContent = "Extra details unavailable.";
      });
  });
}

/**
 * Top-level async handler wiring everything together
 */
async function handleLoadTrips() {
  const region = regionSelect.value;
  statusEl.textContent = "Loading trips…";
  loadTripsBtn.disabled = true;

  try {
    const trips = await fetchTripsByRegion(region); // async/await
    renderTrips(trips);

    statusEl.textContent = `Loaded ${trips.length} trips for ${region}.`;
  } catch (err) {
    statusEl.textContent = "Error loading trips: " + err.message;
    tripsContainer.innerHTML = "";
  } finally {
    loadTripsBtn.disabled = false;
  }
}

loadTripsBtn.addEventListener("click", handleLoadTrips);

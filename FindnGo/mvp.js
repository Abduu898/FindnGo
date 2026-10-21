const cars = [
  { id: "urban-cruiser", name: "Urban Cruiser", type: "city", typeLabel: "City car", city: "Casablanca", price: 225, image: "assets/select-1.png", details: "Automatic · Petrol · 5 seats", badge: "Most popular" },
  { id: "atlas-explorer", name: "Atlas Explorer", type: "suv", typeLabel: "SUV", city: "Marrakech", price: 455, image: "assets/select-2.png", details: "Automatic · Hybrid · 5 seats", badge: "Family favourite" },
  { id: "coast-runner", name: "Coast Runner", type: "van", typeLabel: "Van", city: "Agadir", price: 275, image: "assets/select-3.png", details: "Automatic · Petrol · 7 seats", badge: "Weekend ready" },
  { id: "grand-tourer", name: "Grand Tourer", type: "premium", typeLabel: "Premium", city: "Rabat", price: 625, image: "assets/select-4.png", details: "Automatic · Petrol · 2 seats", badge: "Executive" },
  { id: "desert-line", name: "Desert Line", type: "suv", typeLabel: "SUV", city: "Ouarzazate", price: 395, image: "assets/select-5.png", details: "Automatic · Diesel · 5 seats", badge: "Room to roam" },
];

const formatPrice = (price) => `${price} DH`;
const getFavorites = () => JSON.parse(localStorage.getItem("findngo-favorites") || "[]");
const saveFavorites = (favorites) => localStorage.setItem("findngo-favorites", JSON.stringify(favorites));

function carCard(car) {
  const isFavorite = getFavorites().includes(car.id);
  return `<article class="mvp-car-card" data-car-id="${car.id}">
    <div class="mvp-car-card__image">
      <span>${car.badge}</span>
      <button class="mvp-favorite ${isFavorite ? "is-favorite" : ""}" type="button" aria-label="${isFavorite ? "Remove" : "Add"} ${car.name} ${isFavorite ? "from" : "to"} favorites" data-favorite="${car.id}">
        <i class="${isFavorite ? "ri-heart-fill" : "ri-heart-line"}"></i>
      </button>
      <img src="${car.image}" alt="${car.name}" />
    </div>
    <div class="mvp-car-card__body">
      <div><span class="mvp-kicker">${car.typeLabel} · ${car.city}</span><h3>${car.name}</h3></div>
      <strong>${formatPrice(car.price)}<small>/day</small></strong>
      <p>${car.details}</p>
      <a class="mvp-card-action" href="booking.html?car=${car.id}">Reserve this car <i class="ri-arrow-right-line"></i></a>
    </div>
  </article>`;
}

function showMvpToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("toast--visible");
  clearTimeout(toast.hideTimer);
  toast.hideTimer = setTimeout(() => toast.classList.remove("toast--visible"), 2800);
}

function initFleetPage() {
  const grid = document.getElementById("fleet-grid");
  const filter = document.getElementById("fleet-filter");
  const count = document.getElementById("fleet-count");
  const query = new URLSearchParams(window.location.search);
  filter.value = query.get("type") || "all";

  const render = () => {
    const selected = filter.value;
    const visibleCars = selected === "all" ? cars : cars.filter((car) => car.type === selected);
    count.textContent = `${visibleCars.length} ${visibleCars.length === 1 ? "car" : "cars"} available`;
    grid.innerHTML = visibleCars.map(carCard).join("");
    grid.querySelectorAll("[data-favorite]").forEach((button) => {
      button.addEventListener("click", () => {
        const favorites = getFavorites();
        const id = button.dataset.favorite;
        const nextFavorites = favorites.includes(id) ? favorites.filter((item) => item !== id) : [...favorites, id];
        saveFavorites(nextFavorites);
        render();
        showMvpToast(nextFavorites.includes(id) ? "Saved to your favorites." : "Removed from favorites.");
      });
    });
  };

  filter.addEventListener("change", render);
  render();
}

function initBookingPage() {
  const query = new URLSearchParams(window.location.search);
  const car = cars.find((item) => item.id === query.get("car")) || cars[0];
  document.getElementById("booking-vehicle").innerHTML = `<img src="${car.image}" alt="${car.name}" /><div><span>${car.typeLabel} · ${car.city}</span><strong>${car.name}</strong><small>${car.details}</small></div>`;
  document.getElementById("booking-total").textContent = `${formatPrice(car.price)} / day`;
  document.getElementById("selected-car").value = car.id;

  const form = document.getElementById("mvp-booking-form");
  const start = document.getElementById("mvp-start");
  const end = document.getElementById("mvp-end");
  const today = new Date().toISOString().split("T")[0];
  start.min = today;
  end.min = today;
  start.addEventListener("change", () => { end.min = start.value || today; });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (end.value < start.value) {
      showMvpToast("Return date must be after pick-up date.");
      return;
    }
    form.classList.add("is-complete");
    document.getElementById("booking-confirmation").hidden = false;
    document.getElementById("booking-confirmation-car").textContent = car.name;
    form.querySelector("button[type=submit]").disabled = true;
  });
}

document.querySelectorAll("[data-page]").forEach((button) => {
  button.addEventListener("click", () => { window.location.href = button.dataset.page; });
});

if (document.getElementById("fleet-grid")) initFleetPage();
if (document.getElementById("mvp-booking-form")) initBookingPage();

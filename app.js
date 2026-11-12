let cars = [
  {
    name: "BMW M4",
    price: 500,
    description: "Premium CPM car",
    image: "https://placehold.co/600x350/151515/ffffff?text=BMW+M4"
  }
];

const storeNumber = "923196603839";

function saveCars() {
  localStorage.setItem("eliteCars", JSON.stringify(cars));
}

function showCars(list = cars) {
  const container = document.getElementById("car-list");
  if (!container) return;

  container.innerHTML = "";

  list.forEach((car, index) => {
    container.innerHTML += `
      <div class="car">
        <img src="${car.image}" alt="${car.name}">
        <h3>${car.name}</h3>
        <p>${car.description}</p>
        <h3>PKR ${car.price}</h3>
        <a class="btn" href="https://wa.me/${storeNumber}?text=${encodeURIComponent("I want to order " + car.name)}">
          Order on WhatsApp
        </a>
        <button class="btn" onclick="deleteCar(${index})">Delete</button>
      </div>
    `;
  });
}

function searchCars() {
  const query = document.getElementById("search").value.toLowerCase();
  showCars(cars.filter(car => car.name.toLowerCase().includes(query)));
}

function addCar() {
  const name = document.getElementById("carName").value.trim();
  const price = Number(document.getElementById("carPrice").value);
  const description = document.getElementById("carDescription").value.trim();
  const image = document.getElementById("carImage").value.trim();

  if (!name || !price || !image) {
    alert("Please enter car name, price and image URL.");
    return;
  }

  cars.push({ name, price, description, image });
  saveCars();
  showCars();

  document.getElementById("carName").value = "";
  document.getElementById("carPrice").value = "";
  document.getElementById("carDescription").value = "";
  document.getElementById("carImage").value = "";

  alert("Car added successfully!");
}

function deleteCar(index) {
  if (!confirm("Delete this car?")) return;
  cars.splice(index, 1);
  saveCars();
  showCars();
}

function loadCars() {
  const saved = localStorage.getItem("eliteCars");
  if (saved) cars = JSON.parse(saved);
  showCars();
}

document.addEventListener("DOMContentLoaded", loadCars);

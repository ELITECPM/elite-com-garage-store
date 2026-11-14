const SUPABASE_URL = "https://mokjbshrwitinabzudrt.supabase.co";
const SUPABASE_KEY = "sb_publishable_EBjXonUcfYLRLQQNw1bV0A_kPaSJ0KN";


const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

let allCars = [];
let currentCategory = "All";

async function loadCars() {
  const { data, error } = await supabaseClient
    .from("cars")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Loading cars failed:", error);
    return;
  }

allCars = data || [];
searchCars();
populateBattleCars();
}

function filterCars(category) {
  currentCategory = category;
  searchCars();
}

function searchCars() {
  const carList = document.getElementById("carList");
  const searchInput = document.getElementById("carSearch");

  if (!carList) return;

  const searchText = searchInput
    ? searchInput.value.toLowerCase().trim()
    : "";

  carList.innerHTML = "";

  const filteredCars = allCars.filter(car => {
    const matchesCategory =
      currentCategory === "All" ||
      (car.category || "Trending Cars") === currentCategory;

    const matchesSearch =
      (car.name || "").toLowerCase().includes(searchText);

    return matchesCategory && matchesSearch;
  });

  filteredCars.forEach(car => {
    const card = document.createElement("div");

    const image = document.createElement("img");
    image.src = car.image_url;
    image.alt = car.name;

    const name = document.createElement("h3");
    name.textContent = car.name;

    const oldPrice = document.createElement("p");
    oldPrice.textContent = "PKR " + car.original_price;
    oldPrice.style.textDecoration = "line-through";

    const price = document.createElement("h3");
    price.textContent = "PKR " + car.price;

    const description = document.createElement("p");
    description.textContent = car.description || "";

    const button = document.createElement("button");
   button.textContent = "ADD TO CART";
button.onclick = () => addToCart(car);
    
    card.append(image, name, oldPrice, price, description, button);
    carList.appendChild(card);
  });
}

function orderOnWhatsApp(carName, carPrice) {
  const phone = "923196603839";

  const message = `Hello Elite CPM Garage!

I want to pay for this car: ${carName}
Price: PKR ${carPrice}

Please send me your account details.`;

  window.open(
    `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
    "_blank"
  );
}

loadCars();
let cart = [];

function addToCart(car) {
  cart.push(car);
  updateCart();
  alert("Car added to cart!");
}

function showCart() {
  const box = document.getElementById("cartBox");
  box.style.display =
    box.style.display === "none" ? "block" : "none";
  updateCart();
}

function updateCart() {
  document.getElementById("cartCount").textContent = cart.length;

  const items = document.getElementById("cartItems");
  const total = cart.reduce((sum, car) => sum + Number(car.price), 0);

  items.innerHTML = "";

  cart.forEach((car, index) => {
    const item = document.createElement("p");
    item.textContent = car.name + " - PKR " + car.price;

    const remove = document.createElement("button");
    remove.textContent = "Remove";
    remove.onclick = () => {
      cart.splice(index, 1);
      updateCart();
    };

    item.appendChild(remove);
    items.appendChild(item);
  });

  document.getElementById("cartTotal").textContent = total;
}

function checkoutCart() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const order = cart.map(car =>
    car.name + " - PKR " + car.price
  ).join("\n");

  const total = cart.reduce(
    (sum, car) => sum + Number(car.price), 0
  );

  const message =
    "Hello Elite CPM Garage!\n\nMy order:\n" +
    order + "\n\nTotal: PKR " + total;

  window.open(
    "https://wa.me/923196603839?text=" +
    encodeURIComponent(message),
    "_blank"
  );
}

function chooseOrderMethod() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const choice = confirm(
    "Order through TikTok?\n\nOK = TikTok\nCancel = WhatsApp"
  );

  if (choice) {
    window.open(
      "https://www.tiktok.com/@elitecpmgarage",
      "_blank"
    );
  } else {
    checkoutCart();
  }
}
function populateBattleCars() {
  const first = document.getElementById("carOne");
  const second = document.getElementById("carTwo");

  if (!first || !second) return;

  first.innerHTML = '<option value="">Select First Car</option>';
  second.innerHTML = '<option value="">Select Second Car</option>';

  allCars.forEach(car => {
    const option1 = document.createElement("option");
    option1.value = car.id;
    option1.textContent = car.name;

    const option2 = document.createElement("option");
    option2.value = car.id;
    option2.textContent = car.name;

    first.appendChild(option1);
    second.appendChild(option2);
  });
}

function compareCars() {
  const firstId = document.getElementById("carOne").value;
  const secondId = document.getElementById("carTwo").value;
  const result = document.getElementById("comparisonResult");

  if (!firstId || !secondId) {
    alert("Please select two cars!");
    return;
  }

  if (firstId === secondId) {
    alert("Please select two different cars!");
    return;
  }

  const carA = allCars.find(car => String(car.id) === firstId);
  const carB = allCars.find(car => String(car.id) === secondId);

  if (!carA || !carB) return;

  result.innerHTML = "";

  [carA, carB].forEach(car => {
    const card = document.createElement("div");

    const image = document.createElement("img");
    image.src = car.image_url;
    image.alt = car.name;
    image.style.width = "100%";
    image.style.maxWidth = "250px";

    const name = document.createElement("h3");
    name.textContent = car.name;

    const price = document.createElement("p");
    price.textContent = "Price: PKR " + car.price;

    const original = document.createElement("p");
    original.textContent = "Real Price: PKR " + car.original_price;

    const category = document.createElement("p");
    category.textContent = "Category: " + (car.category || "Not specified");

    const description = document.createElement("p");
    description.textContent = car.description || "No description";

    card.append(image, name, price, original, category, description);
    result.appendChild(card);
  });

  const winner = document.createElement("h3");
  winner.textContent =
    Number(carA.price) <= Number(carB.price)
      ? "🏆 " + carA.name + " has the lower price!"
      : "🏆 " + carB.name + " has the lower price!";

  result.appendChild(winner);
}

const SUPABASE_URL = "https://mokjbshrwitinabzudrt.supabase.co";
const SUPABASE_KEY = "sb_publishable_EBjXonUcfYLRLQQNw1bV0A_kPaSJ0KN";

const SUPABASE_URL = "PASTE_YOUR_EXISTING_SUPABASE_URL";
const SUPABASE_KEY = "PASTE_YOUR_EXISTING_PUBLISHABLE_KEY";

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
    button.textContent = "I WANT TO PAY";
    button.onclick = () => orderOnWhatsApp(car.name, car.price);

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

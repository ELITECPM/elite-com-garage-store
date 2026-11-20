const SUPABASE_URL = "https://mokjbshrwitinabzudrt.supabase.co";
const SUPABASE_KEY = "sb_publishable_EBjXonUcfYLRLQQNw1bV0A_kPaSJ0KN";


const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);


// =====================================
// CARS SYSTEM
// =====================================

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

  if (filteredCars.length === 0) {
    carList.textContent = "No cars found.";
    return;
  }

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

    card.append(
      image,
      name,
      oldPrice,
      price,
      description,
      button
    );

    carList.appendChild(card);
  });
}


// =====================================
// CPM ACCOUNTS SYSTEM
// =====================================

let allAccounts = [];

async function loadAccounts() {
  const accountList = document.getElementById("accountList");

  if (!accountList) return;

  accountList.textContent = "Loading CPM accounts...";

  const { data, error } = await supabaseClient
    .from("accounts")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Loading accounts failed:", error);

    accountList.textContent =
      "Unable to load accounts. Please try again later.";

    return;
  }

  allAccounts = data || [];

  searchAccounts();
}


function searchAccounts() {
  const accountList = document.getElementById("accountList");
  const searchInput = document.getElementById("accountSearch");

  if (!accountList) return;

  const searchText = searchInput
    ? searchInput.value.toLowerCase().trim()
    : "";

  accountList.innerHTML = "";

  const filteredAccounts = allAccounts.filter(account => {
    const name = (account.name || "").toLowerCase();
    const description = (account.description || "").toLowerCase();

    return (
      name.includes(searchText) ||
      description.includes(searchText)
    );
  });

  if (filteredAccounts.length === 0) {
    accountList.textContent = "No CPM accounts available.";
    return;
  }

  filteredAccounts.forEach(account => {
    const card = document.createElement("div");
    card.className = "account-card";

    // ACCOUNT NAME
    const name = document.createElement("h3");
    name.textContent = account.name || "CPM Account";

    // ACCOUNT PRICE
    const price = document.createElement("h3");
    price.textContent = "PKR " + account.price;

    // ACCOUNT DESCRIPTION
    const description = document.createElement("p");
    description.textContent = account.description || "";

    // ACCOUNT VIDEO
    const video = document.createElement("video");

    video.className = "account-video";
    video.controls = true;
    video.playsInline = true;
    video.preload = "metadata";

    if (account.video_url) {
      video.src = account.video_url;
    } else {
      video.hidden = true;

      const noVideo = document.createElement("p");
      noVideo.textContent = "Video not available.";
      card.appendChild(noVideo);
    }

    // ORDER ACCOUNT BUTTON
    const orderButton = document.createElement("button");

    orderButton.textContent = "ORDER ACCOUNT";

    orderButton.onclick = () => {
      orderAccountOnWhatsApp(account.name, account.price);
    };

    // ADD ELEMENTS TO ACCOUNT CARD
    card.append(
      name,
      price,
      description
    );

    if (account.video_url) {
      card.appendChild(video);
    }

    card.appendChild(orderButton);

    accountList.appendChild(card);
  });
}


// =====================================
// ACCOUNT WHATSAPP ORDER
// =====================================

function orderAccountOnWhatsApp(accountName, accountPrice) {
  const phone = "923196603839";

  const message =
    "Hello ELITE CPM GARAGE!\n\n" +
    "I want to order this CPM account:\n" +
    "Account: " + accountName + "\n" +
    "Price: PKR " + accountPrice + "\n\n" +
    "Please send me the payment details.";

  window.open(
    "https://wa.me/" + phone +
    "?text=" + encodeURIComponent(message),
    "_blank"
  );
}


// =====================================
// CAR WHATSAPP ORDER
// =====================================

function orderOnWhatsApp(carName, carPrice) {
  const phone = "923196603839";

  const message = `Hello ELITE CPM GARAGE!

I want to pay for this car: ${carName}
Price: PKR ${carPrice}

Please send me your account details.`;

  window.open(
    `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
    "_blank"
  );
}


// =====================================
// SHOPPING CART
// =====================================

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

  const total = cart.reduce(
    (sum, car) => sum + Number(car.price),
    0
  );

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


// =====================================
// CHECKOUT
// =====================================

function checkoutCart() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const order = cart.map(car =>
    car.name + " - PKR " + car.price
  ).join("\n");

  const total = cart.reduce(
    (sum, car) => sum + Number(car.price),
    0
  );

  const message =
    "Hello ELITE CPM GARAGE!\n\nMy order:\n" +
    order + "\n\nTotal: PKR " + total;

  window.open(
    "https://wa.me/923196603839?text=" +
    encodeURIComponent(message),
    "_blank"
  );
}


// =====================================
// CHOOSE ORDER METHOD
// =====================================

function chooseOrderMethod() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const popup = document.createElement("div");

  popup.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 99999;
  `;

  popup.innerHTML = `
    <div style="
      background: #191919;
      padding: 25px;
      border-radius: 15px;
      text-align: center;
      width: 85%;
      max-width: 350px;
      border: 1px solid #e5b83f;
    ">

      <h2 style="color:#ffd76a; margin-bottom:20px;">
        Choose Order Method
      </h2>

      <button id="zbWhatsApp" style="
        display:block;
        width:100%;
        padding:14px;
        margin-bottom:12px;
        background:#25D366;
        color:white;
        border:0;
        border-radius:8px;
        font-weight:bold;
      ">WhatsApp</button>

      <button id="zbTikTok" style="
        display:block;
        width:100%;
        padding:14px;
        background:#333;
        color:white;
        border:0;
        border-radius:8px;
        font-weight:bold;
      ">TikTok</button>

    </div>
  `;

  document.body.appendChild(popup);

  popup.querySelector("#zbWhatsApp").onclick = function() {
    popup.remove();
    checkoutCart();
  };

  popup.querySelector("#eliteTikTok").onclick = function() {
    popup.remove();

    window.open(
      "https://www.tiktok.com/@elitecpmgarage",
      "_blank"
    );
  };
}


// =====================================
// WEBSITE STARTUP
// =====================================

document.addEventListener("DOMContentLoaded", () => {
  loadCars();
  loadAccounts();
});

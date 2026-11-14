const SUPABASE_URL = "https://mokjbshrwitinabzudrt.supabase.co";
const SUPABASE_KEY = "sb_publishable_EBjXonUcfYLRLQQNw1bV0A_kPaSJ0KN";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

async function loadCars() {
  const { data, error } = await supabaseClient
    .from("cars")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  const container = document.getElementById("carList");
  if (!container) return;

  container.innerHTML = "";

  data.forEach(car => {
    const card = document.createElement("div");

    const image = document.createElement("img");
    image.src = car.image_url;
    image.alt = car.name;
    image.style.width = "100%";

    const name = document.createElement("h3");
    name.textContent = car.name;

   const oldPrice = document.createElement("p");
oldPrice.textContent = "PKR " + car.original_price;
oldPrice.style.textDecoration = "line-through";
oldPrice.style.color = "#999";

const price = document.createElement("h3");
price.textContent = "PKR " + car.price;
price.style.color = "#00ff99";
    const description = document.createElement("p");
    description.textContent = car.description || "";

    const button = document.createElement("button");
    button.textContent = "I WANT TO PAY";
    button.onclick = () => orderOnWhatsApp(car.name, car.price);

  card.append(image, name, oldPrice, price, description, button);
    container.appendChild(card);
  });
}

function orderOnWhatsApp(carName, carPrice) {
  const phone = "923196603839";
  const message = `Hello Elite CPM Garage! I have paid for ${carName}. Price: PKR ${carPrice}. Please verify my payment. I will attach my payment screenshot here.`;

  window.open(
    `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
    "_blank"
  );
}

loadCars();

const SUPABASE_URL = "YOUR_PROJECT_URL";
const SUPABASE_KEY = "YOUR_PUBLISHABLE_KEY";

const db = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// Admin login
async function loginAdmin() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await db.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    document.getElementById("message").textContent = error.message;
    return;
  }

  document.getElementById("login").hidden = true;
  document.getElementById("dashboard").hidden = false;

  loadCars();
}

// Add a car
async function addCar() {
  const name = document.getElementById("carName").value;
  const price = Number(document.getElementById("carPrice").value);
  const description = document.getElementById("carDescription").value;
  const image_url = document.getElementById("carImage").value;

  const { error } = await db.from("cars").insert([{
    name,
    price,
    description,
    image_url
  }]);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Car added successfully!");
  loadCars();
}

// Show cars
async function loadCars() {
  const { data, error } = await db
    .from("cars")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    alert(error.message);
    return;
  }

  const container = document.getElementById("adminCars");
  container.innerHTML = "";

  data.forEach(car => {
    const item = document.createElement("div");
    item.textContent = `${car.name} - PKR ${car.price}`;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "DELETE";
    deleteButton.onclick = () => deleteCar(car.id);

    item.appendChild(deleteButton);
    container.appendChild(item);
  });
}

// Delete a car
async function deleteCar(id) {
  if (!confirm("Delete this car?")) return;

  const { error } = await db.from("cars").delete().eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  loadCars();
}

// Logout
async function logoutAdmin() {
  await db.auth.signOut();
  location.reload();
}

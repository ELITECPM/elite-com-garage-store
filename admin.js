const SUPABASE_URL = "https://mokjbshrwitinabzudrt.supabase.co";
const SUPABASE_KEY = "sb_publishable_EBjXonUcfYLRLQQNw1bV0A_kPaSJ0KN";

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
  const name = document.getElementById("carName").value.trim();
  const price = Number(document.getElementById("carPrice").value);
  const originalPrice = Number(document.getElementById("originalPrice").value);
  const description = document.getElementById("carDescription").value.trim();
  const category = document.getElementById("carCategory").value;
  const file = document.getElementById("carImageFile").files[0];

  if (!name || !price || !originalPrice || !file) {
    alert("Enter car name, both prices and select a photo.");
    return;
  }

  if (originalPrice < price) {
    alert("Real price must be greater than or equal to discounted price.");
    return;
  }

  const extension = file.name.split(".").pop();
  const filePath = `${Date.now()}.${extension}`;

  const { error: uploadError } = await db.storage
    .from("car-images")
    .upload(filePath, file, {
      contentType: file.type,
      upsert: false
    });

  if (uploadError) {
    alert("Photo upload failed: " + uploadError.message);
    return;
  }

  const { data: imageData } = db.storage
    .from("car-images")
    .getPublicUrl(filePath);

const { error } = await db.from("cars").insert([{
    name,
    price,
    original_price: originalPrice,
    description,
    category,
    image_url: imageData.publicUrl,
    is_active: true
}]);

  if (error) {
    alert("Car save failed: " + error.message);
    return;
  }

  alert("Car and both prices added successfully!");
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

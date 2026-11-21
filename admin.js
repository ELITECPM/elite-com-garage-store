const SUPABASE_URL = "https://mokjbshrwitinabzudrt.supabase.co";
const SUPABASE_KEY = "sb_publishable_EBjXonUcfYLRLQQNw1bV0A_kPaSJ0KN";


const db = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// ============================
// ADMIN LOGIN
// ============================

async function loginAdmin() {
  const email = document.getElementById("email").value.trim();
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
  loadAccounts();
}

// ============================
// ADD CAR WITH TWO PHOTOS
// ============================

async function addCar() {
  const name = document.getElementById("carName").value.trim();
  const price = Number(document.getElementById("carPrice").value);
  const originalPrice = Number(document.getElementById("originalPrice").value);
  const description = document.getElementById("carDescription").value.trim();
  const category = document.getElementById("carCategory").value;

  const file1 = document.getElementById("carImageFile").files[0];
  const file2 = document.getElementById("carImageFile2").files[0];

  if (!name || !price || !originalPrice || !file1) {
    alert("Enter car name, both prices and select the first photo.");
    return;
  }

  if (price <= 0 || originalPrice <= 0) {
    alert("Prices must be greater than zero.");
    return;
  }

  if (originalPrice < price) {
    alert("Real price must be greater than or equal to discounted price.");
    return;
  }

  if (!file1.type.startsWith("image/")) {
    alert("Please select a valid first image.");
    return;
  }

  if (file2 && !file2.type.startsWith("image/")) {
    alert("Please select a valid second image.");
    return;
  }

  const uploadPhoto = async (file, suffix) => {
    if (!file) return null;

    const extension = file.name.split(".").pop();

    const filePath =
      `${Date.now()}-${suffix}-${Math.random().toString(36).slice(2)}.${extension}`;

    const { error } = await db.storage
      .from("car-images")
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false
      });

    if (error) throw error;

    const { data } = db.storage
      .from("car-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  try {
    const imageUrl = await uploadPhoto(file1, "first");
    const secondImageUrl = await uploadPhoto(file2, "second");

    const { error } = await db.from("cars").insert([{
      name,
      price,
      original_price: originalPrice,
      description,
      category,
      image_url: imageUrl,
      second_image_url: secondImageUrl,
      is_active: true
    }]);

    if (error) throw error;

    alert("Car added successfully with photos!");

    document.getElementById("carName").value = "";
    document.getElementById("carPrice").value = "";
    document.getElementById("originalPrice").value = "";
    document.getElementById("carDescription").value = "";
    document.getElementById("carImageFile").value = "";
    document.getElementById("carImageFile2").value = "";

    loadCars();

  } catch (error) {
    alert("Car upload failed: " + error.message);
  }
}

// ============================
// LOAD CARS
// ============================

async function loadCars() {
  console.log("UPDATED ADMIN PRICE EDITING VERSION LOADED");

  const { data, error } = await db
    .from("cars")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    alert("Loading cars failed: " + error.message);
    return;
  }

  const container = document.getElementById("adminCars");

  if (!container) return;

  container.innerHTML = "";

  (data || []).forEach(car => {
    const item = document.createElement("div");
    item.className = "admin-car-item";

    const name = document.createElement("h3");
    name.textContent = car.name;

    const originalLabel = document.createElement("label");
    originalLabel.textContent = "Real Price (Old Price)";

    const originalInput = document.createElement("input");
    originalInput.type = "number";
    originalInput.min = "1";
    originalInput.value = car.original_price ?? "";

    const priceLabel = document.createElement("label");
    priceLabel.textContent = "Discounted Price (New Price)";

    const priceInput = document.createElement("input");
    priceInput.type = "number";
    priceInput.min = "1";
    priceInput.value = car.price ?? "";

    const saveButton = document.createElement("button");
    saveButton.textContent = "SAVE PRICE";
    saveButton.className = "btn";

    saveButton.onclick = () => {
      updateCarPrice(
        car.id,
        originalInput.value,
        priceInput.value,
        saveButton
      );
    };

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "DELETE";
    deleteButton.onclick = () => deleteCar(car.id);

    item.append(
      name,
      originalLabel,
      originalInput,
      priceLabel,
      priceInput,
      saveButton,
      deleteButton
    );

    container.appendChild(item);
  });
}

// ============================
// UPDATE CAR PRICE
// ============================

async function updateCarPrice(id, originalValue, priceValue, button) {
  const originalPrice = Number(originalValue);
  const price = Number(priceValue);

  if (
    !originalValue ||
    !priceValue ||
    !Number.isFinite(originalPrice) ||
    !Number.isFinite(price) ||
    originalPrice <= 0 ||
    price <= 0
  ) {
    alert("Please enter valid prices greater than zero.");
    return;
  }

  if (originalPrice < price) {
    alert("Real price must be greater than or equal to discounted price.");
    return;
  }

  button.disabled = true;
  button.textContent = "SAVING...";

  const { error } = await db
    .from("cars")
    .update({
      original_price: originalPrice,
      price: price
    })
    .eq("id", id);

  button.disabled = false;
  button.textContent = "SAVE PRICE";

  if (error) {
    alert("Price update failed: " + error.message);
    return;
  }

  alert("Car price updated successfully!");

  loadCars();
}

// ============================
// DELETE CAR
// ============================

async function deleteCar(id) {
  if (!confirm("Delete this car?")) return;

  const { error } = await db
    .from("cars")
    .delete()
    .eq("id", id);

  if (error) {
    alert("Car deletion failed: " + error.message);
    return;
  }

  alert("Car deleted successfully!");

  loadCars();
}

// ============================
// ADD CPM ACCOUNT
// ============================

async function addAccount() {
  const name = document.getElementById("accountName").value.trim();
  const price = Number(document.getElementById("accountPrice").value);
  const description = document.getElementById("accountDescription").value.trim();
  const file = document.getElementById("accountVideoFile").files[0];

  if (!name || !price || price <= 0 || !file) {
    alert("Enter account name, a valid price and select a video.");
    return;
  }

  if (!file.type.startsWith("video/")) {
    alert("Please select a valid video file.");
    return;
  }

  const extension = file.name.split(".").pop();

  const filePath =
    `${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;

  const { error: uploadError } = await db.storage
    .from("account-videos")
    .upload(filePath, file, {
      contentType: file.type,
      upsert: false
    });

  if (uploadError) {
    alert("Video upload failed: " + uploadError.message);
    return;
  }

  const { data: videoData } = db.storage
    .from("account-videos")
    .getPublicUrl(filePath);

  const { error } = await db.from("accounts").insert([{
    name,
    price,
    description,
    video_url: videoData.publicUrl,
    is_active: true
  }]);

  if (error) {
    alert("Account save failed: " + error.message);
    return;
  }

  alert("CPM Account added successfully!");

  document.getElementById("accountName").value = "";
  document.getElementById("accountPrice").value = "";
  document.getElementById("accountDescription").value = "";
  document.getElementById("accountVideoFile").value = "";

  loadAccounts();
}

// ============================
// LOAD ACCOUNTS
// ============================

async function loadAccounts() {
  const { data, error } = await db
    .from("accounts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    alert("Loading accounts failed: " + error.message);
    return;
  }

  const container = document.getElementById("adminAccounts");

  if (!container) return;

  container.innerHTML = "";

  (data || []).forEach(account => {
    const item = document.createElement("div");

    const name = document.createElement("h3");
    name.textContent = account.name;

    const price = document.createElement("p");
    price.textContent = "PKR " + account.price;

    const description = document.createElement("p");
    description.textContent = account.description || "";

    const video = document.createElement("video");
    video.src = account.video_url;
    video.controls = true;
    video.playsInline = true;
    video.style.width = "100%";
    video.style.maxWidth = "350px";

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "DELETE ACCOUNT";
    deleteButton.onclick = () => deleteAccount(account.id);

    item.append(
      name,
      price,
      description,
      video,
      deleteButton
    );

    container.appendChild(item);
  });
}

// ============================
// DELETE ACCOUNT
// ============================

async function deleteAccount(id) {
  if (!confirm("Delete this account?")) return;

  const { error } = await db
    .from("accounts")
    .delete()
    .eq("id", id);

  if (error) {
    alert("Account deletion failed: " + error.message);
    return;
  }

  alert("Account deleted successfully!");

  loadAccounts();
}

// ============================
// ADMIN LOGOUT
// ============================

async function logoutAdmin() {
  await db.auth.signOut();
  location.reload();
}



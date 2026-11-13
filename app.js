const SUPABASE_URL = "https://mokjbshrwitinabzudrt.supabase.co/rest/v1/";
const SUPABASE_KEY = "sb_publishable_EBjXonUcfYLRLQQNw1bV0A_kPaSJ0KN";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

console.log("Elite CPM Garage connected!");
function orderOnWhatsApp(carName, carPrice) {
  const phone = "923196603839";

  const message =
    `Hello Elite CPM Garage! I have paid for ${carName}. ` +
    `Price: PKR ${carPrice}. Please verify my payment. ` +
    `I will attach my payment screenshot here.`;

  const url =
    `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank");
}

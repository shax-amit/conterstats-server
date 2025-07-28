const container = document.getElementById("wishlistItems");

// שליפת הנתונים מה־localStorage
const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

// פונקציה להצגת פריטים בדף
function renderWishlist(items) {
  container.innerHTML = "";

  items.forEach((item) => {
    const section = document.createElement("section");
    section.className = "wishlist-row";
    section.dataset.name = item.name;
    section.dataset.price = item.price;
    section.dataset.condition = item.condition;

    section.innerHTML = `
      <span>${item.name}</span>
      <img src="${item.imageUrl || `assets/icons/${item.category || 'knife'}.png`}" 
           alt="${item.name}" 
           style="width: 40px" />
      <span>${item.price}$</span>
      <span>added to wishlist</span>
      <span class="condition-tag">${item.condition}</span>
      <button class="remove-btn" style="margin-left: 1rem;">🗑️</button>
    `;

    const removeBtn = section.querySelector(".remove-btn");
    removeBtn.addEventListener("click", () => {
      removeFromWishlist(item._id);
    });

    container.appendChild(section);
  });
}

// הסרה מה־wishlist לפי ID
function removeFromWishlist(id) {
  const updated = wishlist.filter((item) => item._id !== id);
  localStorage.setItem("wishlist", JSON.stringify(updated));
  renderWishlist(updated);
}

// התחלה
renderWishlist(wishlist);

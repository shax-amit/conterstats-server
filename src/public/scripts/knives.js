const token = localStorage.getItem("token");
const itemList = document.getElementById("itemList");
let itemsData = [];

const WISHLIST_KEY = "wishlist";

// קריאת פריטים מהשרת (knives)
fetch("https://conterstats-server.onrender.com/api/items?category=Knives", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((res) => res.json())
  .then((data) => {
    itemsData = data;
    renderItems(itemsData);
  })
  .catch((err) => {
    console.error("שגיאה בשליפת הנתונים:", err);
  });

// פונקציות ל־wishlist ב־localStorage
function loadWishlist() {
  return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
}

function saveWishlist(wishlist) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
}

function toggleWishlist(item) {
  const wishlist = loadWishlist();
  const index = wishlist.findIndex((x) => x._id === item._id);

  if (index === -1) {
    wishlist.push(item);
  } else {
    wishlist.splice(index, 1);
  }

  saveWishlist(wishlist);
}

// הצגת הפריטים בדף
function renderItems(items) {
  itemList.innerHTML = "";
  const currentWishlist = loadWishlist();

  items.forEach((item) => {
    const row = document.createElement("section");
    row.className = "knife-row";
    row.dataset.name = item.name;
    row.dataset.price = item.price;
    row.dataset.condition = item.condition;
    row.style.display = "flex";
    row.style.justifyContent = "space-between";
    row.style.alignItems = "center";
    row.style.padding = "1rem";
    row.style.borderBottom = "1px solid #ddd";
    row.style.background = "#f9f9f9";

    const isInWishlist = currentWishlist.some((x) => x._id === item._id);

    row.innerHTML = `
      <span>${item.name}</span>
      <img src="${item.imageUrl || '/assets/icons/knife.png'}" alt="${item.name}" style="width: 40px" />
      <span>${item.price}$</span>
      <span style="font-weight: bold; font-family: monospace">${item.condition}</span>
      <button class="wishlist-btn ${isInWishlist ? "added" : ""}">
        ${isInWishlist ? "✓" : "♡"}
      </button>
    `;

    const btn = row.querySelector(".wishlist-btn");
    btn.addEventListener("click", () => {
      const added = btn.classList.contains("added");

      if (added) {
        btn.textContent = "♡";
        btn.classList.remove("added");
        btn.style.opacity = "1";
      } else {
        btn.textContent = "✓";
        btn.classList.add("added");
        btn.style.opacity = "0.6";
      }

      toggleWishlist(item);
    });

    itemList.appendChild(row);
  });
}

// פונקציית מיון
window.sortItems = function (criterion) {
  const sorted = [...itemsData];

  sorted.sort((a, b) => {
    if (criterion === "price") {
      return a.price - b.price;
    } else {
      return a[criterion].localeCompare(b[criterion]);
    }
  });

  renderItems(sorted);
};

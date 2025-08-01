document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(sessionStorage.getItem("user") || "null");
  if (!user || (user.role !== "employee" && user.role !== "admin")) {
    window.location.href = "index.html";
    return;
  }
  const tableBody = document.querySelector("#users-table tbody");
  try {
    const token = sessionStorage.getItem("token");
    const res = await fetch("https://conterstats.onrender.com/api/users", {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed to fetch users");
    const users = await res.json();
    tableBody.innerHTML = users.map(u => `
      <tr>
        <td>${u.email}</td>
        <td>
          <a href="user-details.html?id=${u._id}"><button class="edit-btn">User Details</button></a>
          <a href="user-wishlist.html?id=${u._id}"><button class="wishlist-btn">Wishlist</button></a>
          <a href="user-orders.html?id=${u._id}"><button class="edit-btn">Orders</button></a>
        </td>
      </tr>
    `).join("");
  } catch (err) {
    tableBody.innerHTML = `<tr><td colspan='2'>${err.message}</td></tr>`;
  }
}); 
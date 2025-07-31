document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  if (!form || !emailInput || !passwordInput) {
    console.error("Login form or inputs not found");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const res = await fetch("https://conterstats.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.error || "Login failed. Please check your credentials.");
        return;
      }

      // שמירה ב-localStorage
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("user", JSON.stringify(data.user));

      // הפנייה לפי תפקיד
      if (data.user.role === "admin") {
        window.location.href = "admin-home.html";
      } else {
        window.location.href = "index.html";
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("An unexpected error occurred. Please try again later.");
    }
  });
});

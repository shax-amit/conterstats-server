// Wishlist functionality
class WishlistManager {
  constructor() {
    this.wishlistItems = [];
    this.init();
  }

  async init() {
    await this.loadWishlist();
    this.setupEventListeners();
  }

  async loadWishlist() {
    const loadingEl = document.getElementById('loading');
    const errorEl = document.getElementById('error');
    const itemsEl = document.getElementById('wishlist-items');
    // DEBUG: Print user and token
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const token = localStorage.getItem('token');
    console.log('[DEBUG] user:', user);
    console.log('[DEBUG] token:', token);
    // const emptyEl = document.getElementById('empty-wishlist'); // Removed unused variable
    // const actionsEl = document.getElementById('wishlist-actions'); // Removed unused variable

    try {
      loadingEl.classList.remove('hidden');
      errorEl.classList.add('hidden');

      if (!token) {
        throw new Error('Please login to view your wishlist');
      }

      const response = await fetch('https://conterstats.onrender.com/api/wishlist', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // DEBUG: Print API response
      const debugText = await response.clone().text();
      console.log('[DEBUG] /api/wishlist response:', debugText);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please login to view your wishlist');
        }
        throw new Error('Failed to load wishlist');
      }

      let loaded = JSON.parse(debugText);
      this.wishlistItems = Array.isArray(loaded) ? loaded.filter(item => item.item) : [];
      this.renderWishlist();

    } catch (error) {
      errorEl.textContent = error.message;
      errorEl.classList.remove('hidden');
      itemsEl.classList.add('hidden');
    } finally {
      loadingEl.classList.add('hidden');
    }
  }

  renderWishlist() {
    const itemsEl = document.getElementById('wishlist-items');
    // const emptyEl = document.getElementById('empty-wishlist'); // Removed unused variable
    // const actionsEl = document.getElementById('wishlist-actions'); // Removed unused variable

    if (this.wishlistItems.length === 0) {
      itemsEl.classList.add('hidden');
      // emptyEl.classList.remove('hidden'); // Removed unused variable
      // actionsEl.classList.add('hidden'); // Removed unused variable
      return;
    }

    itemsEl.classList.remove('hidden');
    // emptyEl.classList.add('hidden'); // Removed unused variable
    // actionsEl.classList.remove('hidden'); // Removed unused variable

    itemsEl.innerHTML = this.wishlistItems.map(item => {
      const it = item.item || {};
      // Use the item ObjectId for removal, fallback to 'null' if missing
      const removeId = it._id ? it._id : 'null';
      const base = `assets/items/${toSlug(it.name||'')}`;
      const imageSrc = it.imageUrl && it.imageUrl.trim() ? it.imageUrl : `${base}.png`;
      return `
        <div class="wishlist-item" data-id="${removeId}">
          <div class="item-info">
            <h3>${it.name || 'Unknown Item'}</h3>
            <p class="category">${it.category || ''}</p>
            <p class="price">$${it.price != null ? it.price : 'N/A'}</p>
            ${it.imageUrl ? `<img src="${imageSrc}" onerror="this.onerror=null;this.src='${base}.jpg'" alt="${it.name}" class="item-image" />` : ''}
          </div>
          <div class="item-actions">
            <button class="remove-btn" onclick="wishlistManager.removeItem('${removeId}')">Remove</button>
          </div>
        </div>
      `;
    }).join('');
  }

  async removeItem(itemId) {
    if (!itemId) {
      this.showMessage('Invalid item id', 'error');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://conterstats.onrender.com/api/wishlist/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to remove item from wishlist');
      }

      // Remove from local array and re-render
      this.wishlistItems = this.wishlistItems.filter(item => {
        const it = item.item || {};
        const removeId = it._id ? it._id : 'null';
        return removeId !== itemId;
      });
      this.renderWishlist();
      
      this.showMessage('Item removed from wishlist', 'success');

    } catch (error) {
      this.showMessage(error.message, 'error');
    }
  }

  async createOrderFromWishlist() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://conterstats.onrender.com/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: this.wishlistItems.map(entry => ({
            itemId: entry.item?._id,
            quantity: 1
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      // const order = await response.json(); // Removed unused variable
      this.showMessage('Order created successfully!', 'success');
      
      // Clear wishlist after successful order
      this.wishlistItems = [];
      this.renderWishlist();

      // Redirect to orders page
      setTimeout(() => {
        window.location.href = 'orders.html';
      }, 2000);

    } catch (error) {
      this.showMessage(error.message, 'error');
    }
  }

  async clearWishlist() {
    if (!confirm('Are you sure you want to clear your entire wishlist?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://conterstats.onrender.com/api/wishlist', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to clear wishlist');
      }

      this.wishlistItems = [];
      this.renderWishlist();
      this.showMessage('Wishlist cleared successfully!', 'success');

    } catch (error) {
      this.showMessage(error.message, 'error');
    }
  }

  /**
   * Navigate user to payment page with all current wishlist item ids
   */
  gotoPayment() {
    if (this.wishlistItems.length === 0) {
      this.showMessage('Your wishlist is empty', 'error');
      return;
    }

    // Collect item ids (filter out undefined/null just in case)
    const ids = this.wishlistItems
      .map((entry) => entry.item?._id)
      .filter(Boolean);

    if (!ids.length) {
      this.showMessage('No valid items to purchase', 'error');
      return;
    }

    // Redirect to payment page with ids param
    window.location.href = `payment.html?items=${ids.join(',')}`;
  }

  /**
   * Bind click handler to "Buy All" button
   */
  setupEventListeners() {
    const buyAllBtn = document.getElementById('buy-all-btn');
    // אם המשתמש הוא אדמין – הסתר את הכפתור לחלוטין
    const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
    if (currentUser?.role === 'admin') {
      if (buyAllBtn) buyAllBtn.style.display = 'none';
      return; // אל תקשור מאזין
    }

    if (buyAllBtn) {
      buyAllBtn.addEventListener('click', () => this.gotoPayment());
    }
  }

  /**
   * Toast helper for success / error / info messages
   */
  showMessage(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, 50);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  }
}
// Helper slug (reuse logic)
function toSlug(name){return name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');}

// Initialize the manager
window.wishlistManager = new WishlistManager();
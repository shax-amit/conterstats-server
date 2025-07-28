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
    const emptyEl = document.getElementById('empty-wishlist');
    const actionsEl = document.getElementById('wishlist-actions');

    try {
      loadingEl.classList.remove('hidden');
      errorEl.classList.add('hidden');

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login to view your wishlist');
      }

      const response = await fetch('/api/wishlist', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please login to view your wishlist');
        }
        throw new Error('Failed to load wishlist');
      }

      this.wishlistItems = await response.json();
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
    const emptyEl = document.getElementById('empty-wishlist');
    const actionsEl = document.getElementById('wishlist-actions');

    if (this.wishlistItems.length === 0) {
      itemsEl.classList.add('hidden');
      emptyEl.classList.remove('hidden');
      actionsEl.classList.add('hidden');
      return;
    }

    itemsEl.classList.remove('hidden');
    emptyEl.classList.add('hidden');
    actionsEl.classList.remove('hidden');

    itemsEl.innerHTML = this.wishlistItems.map(item => `
      <div class="wishlist-item" data-id="${item._id}">
        <div class="item-info">
          <h3>${item.name}</h3>
          <p class="category">${item.category}</p>
          <p class="price">$${item.price || 'N/A'}</p>
        </div>
        <div class="item-actions">
          <button class="remove-btn" onclick="wishlistManager.removeItem('${item._id}')">
            Remove
          </button>
        </div>
      </div>
    `).join('');
  }

  async removeItem(itemId) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/wishlist/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to remove item from wishlist');
      }

      // Remove from local array and re-render
      this.wishlistItems = this.wishlistItems.filter(item => item._id !== itemId);
      this.renderWishlist();
      
      this.showMessage('Item removed from wishlist', 'success');

    } catch (error) {
      this.showMessage(error.message, 'error');
    }
  }

  async createOrderFromWishlist() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: this.wishlistItems.map(item => ({
            itemId: item._id,
            quantity: 1
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const order = await response.json();
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
      const response = await fetch('/api/wishlist', {
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
      this.showMessage('Wishlist cleared successfully', 'success');

    } catch (error) {
      this.showMessage(error.message, 'error');
    }
  }

  setupEventListeners() {
    document.getElementById('create-order-btn').addEventListener('click', () => {
      this.createOrderFromWishlist();
    });

    document.getElementById('clear-wishlist-btn').addEventListener('click', () => {
      this.clearWishlist();
    });
  }

  showMessage(message, type = 'info') {
    // Create a simple toast notification
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }
}

// Initialize wishlist manager
const wishlistManager = new WishlistManager();

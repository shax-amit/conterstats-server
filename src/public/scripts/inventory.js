// Add this mapping at the very top of the file, outside the class
const CATEGORY_MAP = {
  pistol: "Pistol",
  knives: "Knives",
  rifle: "Rifle",
  gloves: "Gloves",
  midtier: "Mid-Tier"
};

// Inventory management with CRUD operations
class InventoryManager {
  constructor() {
    this.items = [];
    this.filteredItems = [];
    this.currentUser = null;
    this.init();
  }

  async init() {
    await this.checkAuth();
    await this.loadItems();

    // --- Category filter from URL ---
    const params = new URLSearchParams(window.location.search);
    const urlCategory = params.get('category');
    if (urlCategory && CATEGORY_MAP[urlCategory]) {
      document.getElementById('category-filter').value = CATEGORY_MAP[urlCategory];
    }
    this.filterItems();
    // --- End category filter block ---

    this.setupEventListeners();
  }

  async checkAuth() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Decode JWT to get user info (basic implementation)
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.currentUser = {
          id: payload.id,
          email: payload.email,
          role: payload.role
        };
        
        // Show admin controls if user is admin
        if (this.currentUser.role === 'admin') {
          document.getElementById('admin-controls').style.display = 'block';
          document.getElementById('admin-add-text').style.display = 'inline';
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }

  async loadItems() {
    const loadingEl = document.getElementById('loading');
    const errorEl = document.getElementById('error');
    const tableEl = document.getElementById('inventory-table');
    // const emptyEl = document.getElementById('empty-inventory'); // Removed unused variable

    try {
      loadingEl.classList.remove('hidden');
      errorEl.classList.add('hidden');

      const response = await fetch('/api/items');
      
      if (!response.ok) {
        throw new Error('Failed to load inventory');
      }

      this.items = await response.json();
      this.filteredItems = [...this.items];
      this.renderItems();

    } catch (error) {
      errorEl.textContent = error.message;
      errorEl.classList.remove('hidden');
      tableEl.classList.add('hidden');
    } finally {
      loadingEl.classList.add('hidden');
    }
  }

  renderItems() {
    const tbody = document.querySelector('#items-table tbody');
    const tableEl = document.getElementById('inventory-table');
    // const emptyEl = document.getElementById('empty-inventory'); // Removed unused variable

    if (this.filteredItems.length === 0) {
      tableEl.classList.add('hidden');
      // emptyEl.classList.remove('hidden'); // Removed unused variable
      return;
    }

    tableEl.classList.remove('hidden');
    // emptyEl.classList.add('hidden'); // Removed unused variable

    tbody.innerHTML = this.filteredItems.map(item => `
      <tr data-id="${item._id}">
        <td>${item.category}</td>
        <td>${item.name}</td>
        <td>${item.condition}</td>
        <td>$${item.price || 'N/A'}</td>
        <td>
          <button class="wishlist-btn" onclick="inventoryManager.addToWishlist('${item._id}')">
            Add to Wishlist
          </button>
          ${this.currentUser?.role === 'admin' ? `
            <button class="edit-btn" onclick="inventoryManager.editItem('${item._id}')">
              Edit
            </button>
            <button class="delete-btn" onclick="inventoryManager.deleteItem('${item._id}')">
              Delete
            </button>
          ` : ''}
        </td>
      </tr>
    `).join('');
  }

  filterItems() {
    const categoryFilter = document.getElementById('category-filter').value;
    const searchTerm = document.getElementById('search-input').value.toLowerCase();

    this.filteredItems = this.items.filter(item => {
      const matchesCategory = !categoryFilter || item.category === categoryFilter;
      const matchesSearch = !searchTerm || 
        item.name.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm);
      
      return matchesCategory && matchesSearch;
    });

    this.renderItems();
  }

  async addToWishlist(itemId) {
    const token = localStorage.getItem('token');
    if (!token) {
      this.showMessage('Please login to add items to wishlist', 'error');
      return;
    }

    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ itemId })
      });

      if (!response.ok) {
        throw new Error('Failed to add item to wishlist');
      }

      this.showMessage('Item added to wishlist!', 'success');

    } catch (error) {
      this.showMessage(error.message, 'error');
    }
  }

  async deleteItem(itemId) {
    if (!this.currentUser || this.currentUser.role !== 'admin') {
      this.showMessage('Admin access required', 'error');
      return;
    }

    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      // Remove from local array and re-render
      this.items = this.items.filter(item => item._id !== itemId);
      this.filterItems();
      
      this.showMessage('Item deleted successfully', 'success');

    } catch (error) {
      this.showMessage(error.message, 'error');
    }
  }

  editItem(/* itemId */) { // Removed unused parameter
    // TODO: Implement edit functionality
    this.showMessage('Edit functionality coming soon!', 'info');
  }

  async addItem(formData) {
    if (!this.currentUser || this.currentUser.role !== 'admin') {
      this.showMessage('Admin access required', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to add item');
      }

      const newItem = await response.json();
      this.items.push(newItem);
      this.filterItems();
      
      this.showMessage('Item added successfully', 'success');
      this.closeModal();

    } catch (error) {
      this.showMessage(error.message, 'error');
    }
  }

  openModal() {
    const modal = document.getElementById('add-item-modal');
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
  }

  closeModal() {
    const modal = document.getElementById('add-item-modal');
    modal.classList.add('hidden');
    modal.style.display = 'none';
    document.getElementById('add-item-form').reset();
  }

  setupEventListeners() {
    // Filter and search
    document.getElementById('category-filter').addEventListener('change', () => {
      this.filterItems();
    });

    document.getElementById('search-input').addEventListener('input', () => {
      this.filterItems();
    });

    // Admin controls
    document.getElementById('add-item-btn').addEventListener('click', () => {
      this.openModal();
    });

    // Modal controls
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.closeModal();
      });
    }

    const addItemForm = document.getElementById('add-item-form');
    if (addItemForm) {
      addItemForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
          name: document.getElementById('item-name').value,
          category: document.getElementById('item-category').value,
          price: parseFloat(document.getElementById('item-price').value)
        };

        this.addItem(formData);
      });
    }

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
      const modal = document.getElementById('add-item-modal');
      if (e.target === modal) {
        this.closeModal();
      }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModal();
      }
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

// Initialize inventory manager
// eslint-disable-next-line no-unused-vars
const inventoryManager = new InventoryManager(); 
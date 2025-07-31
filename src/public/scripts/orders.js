// Orders functionality
class OrdersManager {
  constructor() {
    this.orders = [];
    this.init();
  }

  async init() {
    await this.loadOrders();
    this.setupEventListeners();
  }

  async loadOrders() {
    const loadingEl = document.getElementById('loading');
    const errorEl = document.getElementById('error');
    const ordersEl = document.getElementById('orders-list');
    // eslint-disable-next-line no-unused-vars
    const emptyEl = document.getElementById('empty-orders');
    const summaryEl = document.getElementById('order-summary');

    try {
      loadingEl.classList.remove('hidden');
      errorEl.classList.add('hidden');

      const token = sessionStorage.getItem('token');
      if (!token) {
        throw new Error('Please login to view your orders');
      }

      const response = await fetch('https://conterstats.onrender.com/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please login to view your orders');
        }
        throw new Error('Failed to load orders');
      }

      this.orders = await response.json();
      this.renderOrders();
      this.renderOrderSummary();

    } catch (error) {
      errorEl.textContent = error.message;
      errorEl.classList.remove('hidden');
      ordersEl.classList.add('hidden');
      summaryEl.classList.add('hidden');
    } finally {
      loadingEl.classList.add('hidden');
    }
  }

  renderOrders() {
    const ordersEl = document.getElementById('orders-list');
    const emptyEl = document.getElementById('empty-orders');

    if (this.orders.length === 0) {
      ordersEl.classList.add('hidden');
      emptyEl.classList.remove('hidden');
      return;
    }

    ordersEl.classList.remove('hidden');
    emptyEl.classList.add('hidden');

    ordersEl.innerHTML = this.orders.map(order => `
      <div class="order-item" data-id="${order._id}">
        <div class="order-header">
          <h3>Order #${order._id.slice(-8)}</h3>
          <span class="order-date">${new Date(order.purchaseDate).toLocaleDateString()}</span>
          <span class="order-status">${order.status || 'Completed'}</span>
        </div>
        <div class="order-items">
          ${order.items.map(item => `
            <div class="order-item-detail">
              <span class="item-name">${item.name}</span>
              <span class="item-quantity">x${item.quantity}</span>
              <span class="item-price">$${item.price || 'N/A'}</span>
            </div>
          `).join('')}
        </div>
        <div class="order-footer">
          <span class="order-total">Total: $${this.calculateOrderTotal(order)}</span>
          <button class="cancel-btn" onclick="ordersManager.cancelOrder('${order._id}')" 
                  ${order.status === 'Cancelled' ? 'disabled' : ''}>
            ${order.status === 'Cancelled' ? 'Cancelled' : 'Cancel Order'}
          </button>
        </div>
      </div>
    `).join('');
  }

  renderOrderSummary() {
    const summaryEl = document.getElementById('order-summary');
    const summaryStatsEl = document.getElementById('summary-stats');

    if (this.orders.length === 0) {
      summaryEl.classList.add('hidden');
      return;
    }

    summaryEl.classList.remove('hidden');

    const totalOrders = this.orders.length;
    const totalSpent = this.orders.reduce((sum, order) => sum + this.calculateOrderTotal(order), 0);
    const averageOrder = totalSpent / totalOrders;

    summaryStatsEl.innerHTML = `
      <div class="summary-stat">
        <span class="stat-label">Total Orders:</span>
        <span class="stat-value">${totalOrders}</span>
      </div>
      <div class="summary-stat">
        <span class="stat-label">Total Spent:</span>
        <span class="stat-value">$${totalSpent.toFixed(2)}</span>
      </div>
      <div class="summary-stat">
        <span class="stat-label">Average Order:</span>
        <span class="stat-value">$${averageOrder.toFixed(2)}</span>
      </div>
    `;
  }

  calculateOrderTotal(order) {
    return order.items.reduce((sum, item) => {
      return sum + ((item.price || 0) * item.quantity);
    }, 0);
  }

  async cancelOrder(orderId) {
    if (!confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`https://conterstats.onrender.com/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to cancel order');
      }

      // Remove order from local array
      this.orders = this.orders.filter(o => o._id !== orderId);
      this.renderOrders();
      this.renderOrderSummary();

      this.showMessage('Order cancelled successfully', 'success');

    } catch (error) {
      this.showMessage(error.message, 'error');
    }
  }

  setupEventListeners() {
    // Add any additional event listeners here
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

// Initialize orders manager
// eslint-disable-next-line no-unused-vars
const ordersManager = new OrdersManager(); 
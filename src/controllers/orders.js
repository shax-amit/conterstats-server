import Order from "../models/order.js";
import Item from "../models/item.js";
import Wishlist from "../models/wishlist.js";

// Get all orders for the logged-in user
export const getUserOrders = async (req, res, next) => {
  try {
    // If admin provided userId param -> override
    let targetUserId = req.user.id;
    if (req.user.role === 'admin' && req.query.userId) {
      targetUserId = req.query.userId;
    }

    const orders = await Order.find({ userId: targetUserId })
      .populate('items.itemId')
      .sort({ purchaseDate: -1 });

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// Create a new order
export const createOrder = async (req, res, next) => {
  try {
    const { items, cardNumber, expiry } = req.body;
    const userId = req.user.id;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Order must contain at least one item" });
    }

    // Validate items and get their details
    const orderItems = [];
    let totalAmount = 0;

    for (const orderItem of items) {
      const item = await Item.findById(orderItem.itemId);
      if (!item) {
        return res.status(404).json({ error: `Item ${orderItem.itemId} not found` });
      }

      orderItems.push({
        itemId: item._id,
        name: item.name,
        price: item.price || 0,
        quantity: orderItem.quantity || 1
      });

      totalAmount += (item.price || 0) * (orderItem.quantity || 1);
    }

    // basic validation for card
    if (!cardNumber || !expiry) {
      return res.status(400).json({ error: 'Payment details are required' });
    }

    const last4 = String(cardNumber).replace(/\D/g, '').slice(-4);

    const order = new Order({
      userId,
      items: orderItems,
      totalAmount,
      purchaseDate: new Date(),
      cardLast4: last4,
      cardExpiry: expiry,
    });

    await order.save();

    // Clear wishlist if order was created from wishlist
    if (req.body.fromWishlist) {
      await Wishlist.deleteMany({ userId });
    }

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

// Get a specific order by ID
export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({ _id: id, userId })
      .populate('items.itemId');

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

// Cancel an order
export const cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({ _id: id, userId });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.status === 'Cancelled') {
      return res.status(400).json({ error: "Order is already cancelled" });
    }

    order.status = 'Cancelled';
    await order.save();

    res.json({ message: "Order cancelled successfully" });
  } catch (error) {
    next(error);
  }
}; 
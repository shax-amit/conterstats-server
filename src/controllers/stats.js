import mongoose from "mongoose";
import Order from "../models/order.js";

/*  GET /api/stats/top-items?limit=10
    מחזיר את N-הפריטים הנמכרים ביותר כולל סך היחידות והמכירות */
export const topItems = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 10;

    const pipeline = [
      { $unwind: "$items" },
      { $group: {
          _id:   "$items.item",
          totalSold: { $sum: "$items.quantity" },
          revenue:   { $sum: { $multiply: ["$items.quantity", "$items.unit_price"] } }
        }},
      { $sort: { totalSold: -1 } },
      { $limit: limit },
      { $lookup: {
          from: "items",
          localField: "_id",
          foreignField: "_id",
          as: "item"
        }},
      { $unwind: "$item" },
      { $project: {
          _id: 0,
          itemId: "$item._id",
          name:   "$item.name",
          totalSold: 1,
          revenue: 1,
          category: "$item.category",
          condition: "$item.condition",
          imageUrl: "$item.imageUrl"
        }}
    ];

    const result = await Order.aggregate(pipeline);
    return res.json(result);
  } catch (err) { next(err); }
};

/*  GET /api/stats/users/:id/summary
    GET /api/stats/me/summary
    מסכם הזמנות למשתמש בודד (סה״כ הזמנות, הוצאה כוללת, ותאריך אחרון) */
export const ordersSummaryByUser = async (req, res, next) => {
  try {
    const targetUid = req.params.id ?? req.user.id;   // requireAuth מוסיף req.user
    const uidObj = new mongoose.Types.ObjectId(targetUid);

    const summary = await Order.aggregate([
      { $match: { user: uidObj } },
      { $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent:  { $sum: "$total_price" },
          lastOrder:   { $max: "$purchaseDate" }
        }},
      { $project: {
          _id: 0,
          totalOrders: 1,
          totalSpent: 1,
          lastOrderDate: "$lastOrder"
        }}
    ]);

    return res.json(summary[0] ?? { totalOrders: 0, totalSpent: 0, lastOrderDate: null });
  } catch (err) { next(err); }
};

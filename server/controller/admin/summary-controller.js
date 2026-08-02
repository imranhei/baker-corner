import Sale from "../../models/Sale.js";
import Item from "../../models/Item.js";
import Category from "../../models/Category.js";
import mongoose from "mongoose";

export const getSummary = async (req, res) => {
  try {
    const { period, from, to, category, item } = req.query;

    let startDate;
    let endDate = new Date();
    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const categoryFilter = category
  ? [
      {
        $lookup: {
          from: "items",
          localField: "item",
          foreignField: "_id",
          as: "itemData",
        },
      },

      {
        $unwind: "$itemData",
      },

      {
        $match: {
          "itemData.category": new mongoose.Types.ObjectId(category),
        },
      },
    ]
  : [];

    switch (period) {
      case "thisMonth":
        startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
        break;

      case "lastMonth":
        startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 1, 1);
        endDate = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
        break;

      case "thisYear":
        startDate = new Date(endDate.getFullYear(), 0, 1);
        break;

      case "lastYear":
        startDate = new Date(endDate.getFullYear() - 1, 0, 1);
        endDate = new Date(endDate.getFullYear() - 1, 11, 31);
        break;

      default:
        if (from && to) {
          startDate = new Date(from);
          endDate = new Date(to);
        }
    }

    const match = {};

    if (startDate) {
      match.date = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    if (item) {
      match.item = item;
    }

    const cards = await Sale.aggregate([
      {
        $match: match,
      },

      ...categoryFilter,
      {
        $group: {
          _id: null,

          totalRevenue: {
            $sum: {
              $multiply: ["$quantity", "$price"],
            },
          },

          totalQuantitySold: {
            $sum: "$quantity",
          },

          totalTransactions: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,

          totalRevenue: 1,

          totalQuantitySold: 1,

          totalTransactions: 1,

          averageOrderValue: {
            $cond: [
              {
                $eq: ["$totalTransactions", 0],
              },
              0,
              {
                $divide: ["$totalRevenue", "$totalTransactions"],
              },
            ],
          },
        },
      },
    ]);

    const revenueChart = await Sale.aggregate([
      {
        $match: match,
      },

      ...categoryFilter,

      {
        $group: {
          _id: {
            $cond: [
              {
                $eq: [period, "thisYear"],
              },

              // group by month
              {
                month: {
                  $month: "$date",
                },
                year: {
                  $year: "$date",
                },
              },

              // group by day
              {
                day: {
                  $dayOfMonth: "$date",
                },
                month: {
                  $month: "$date",
                },
                year: {
                  $year: "$date",
                },
              },
            ],
          },

          revenue: {
            $sum: {
              $multiply: ["$quantity", "$price"],
            },
          },
        },
      },

      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
          "_id.day": 1,
        },
      },
    ]);

    const formattedRevenueChart = revenueChart.map((item) => {
      if (period === "thisYear") {
        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        return {
          label: monthNames[item._id.month - 1],

          revenue: item.revenue,
        };
      }

      return {
        label: `${item._id.day}/${item._id.month}`,

        revenue: item.revenue,
      };
    });

    const categoryChart = await Sale.aggregate([
      {
        $match: match,
      },

      ...categoryFilter,

      // Get Item information
      {
        $lookup: {
          from: "items",
          localField: "item",
          foreignField: "_id",
          as: "itemData",
        },
      },

      {
        $unwind: "$itemData",
      },

      // Get Category information
      {
        $lookup: {
          from: "categories",
          localField: "itemData.category",
          foreignField: "_id",
          as: "categoryData",
        },
      },

      {
        $unwind: "$categoryData",
      },

      // Group by category
      {
        $group: {
          _id: "$categoryData.name",

          revenue: {
            $sum: {
              $multiply: ["$quantity", "$price"],
            },
          },

          quantity: {
            $sum: "$quantity",
          },
        },
      },

      {
        $sort: {
          revenue: -1,
        },
      },

      {
        $project: {
          _id: 0,
          name: "$_id",
          revenue: 1,
          quantity: 1,
        },
      },
    ]);

    const topItems = await Sale.aggregate([
      {
        $match: match,
      },

      ...categoryFilter,

      // Join Item collection
      {
        $lookup: {
          from: "items",
          localField: "item",
          foreignField: "_id",
          as: "itemData",
        },
      },

      {
        $unwind: "$itemData",
      },

      // Group sales by item
      {
        $group: {
          _id: "$itemData._id",

          name: {
            $first: "$itemData.name",
          },

          quantity: {
            $sum: "$quantity",
          },

          revenue: {
            $sum: {
              $multiply: ["$quantity", "$price"],
            },
          },
        },
      },

      // Highest selling first
      {
        $sort: {
          quantity: -1,
        },
      },

      // Only top 10 items
      {
        $limit: 10,
      },

      {
        $project: {
          _id: 0,
          name: 1,
          quantity: 1,
          revenue: 1,
        },
      },
    ]);

    const recentSales = await Sale.aggregate([
      {
        $match: match,
      },

      ...categoryFilter,

      // Join Item
      {
        $lookup: {
          from: "items",
          localField: "item",
          foreignField: "_id",
          as: "itemData",
        },
      },

      {
        $unwind: "$itemData",
      },

      // Join Category
      {
        $lookup: {
          from: "categories",
          localField: "itemData.category",
          foreignField: "_id",
          as: "categoryData",
        },
      },

      {
        $unwind: {
          path: "$categoryData",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $project: {
          _id: 1,

          date: 1,

          item: "$itemData.name",

          category: {
            $ifNull: ["$categoryData.name", "Uncategorized"],
          },

          quantity: 1,

          price: 1,

          total: {
            $multiply: ["$quantity", "$price"],
          },
        },
      },

      {
        $sort: {
          date: -1,
        },
      },

      {
        $skip: skip,
      },

      {
        $limit: limit,
      },
    ]);

    const totalSales = await Sale.countDocuments(match);

    res.status(200).json({
      success: true,

      cards: cards.length
        ? cards[0]
        : {
            totalRevenue: 0,
            totalQuantitySold: 0,
            totalTransactions: 0,
            averageOrderValue: 0,
          },

      revenueChart: formattedRevenueChart,

      categoryChart,

      topItems,

      recentSales,

      pagination: {
        total: totalSales,
        page,
        limit,
        totalPages: Math.ceil(totalSales / limit),
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

import Sale from "../../models/Sale.js";
import Item from "../../models/Item.js";
import Category from "../../models/Category.js";
import mongoose from "mongoose";

export const getSummary = async (req, res) => {
  try {
    const { month, year, category } = req.query;

    const selectedMonth = Number(month) || new Date().getMonth() + 1;
    const selectedYear = Number(year) || new Date().getFullYear();
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 10, 1);
    const skip = (page - 1) * limit;

    if (selectedMonth < 1 || selectedMonth > 12) {
      return res.status(400).json({
        success: false,
        message: "Invalid month",
      });
    }

    if (selectedYear < 2000 || selectedYear > 2100) {
      return res.status(400).json({
        success: false,
        message: "Invalid year",
      });
    }

    const startDate = new Date(
      Date.UTC(selectedYear, selectedMonth - 1, 1, 0, 0, 0, 0),
    );

    const endDate = new Date(
      Date.UTC(selectedYear, selectedMonth, 1, 0, 0, 0, 0),
    );

    const match = {
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    };

    const categoryFilter = [];

    if (category) {
      categoryFilter.push(
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
      );
    }

    const cards = await Sale.aggregate([
      {
        $match: match,
      },

      ...categoryFilter,
      {
        $lookup: {
          from: "stocks",

          localField: "item",

          foreignField: "item",

          as: "stockData",
        },
      },

      {
        $unwind: {
          path: "$stockData",

          preserveNullAndEmptyArrays: true,
        },
      },

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

          totalProfit: {
            $sum: {
              $multiply: [
                {
                  $subtract: [
                    "$price",

                    {
                      $ifNull: ["$stockData.avgPurchasePrice", 0],
                    },
                  ],
                },

                "$quantity",
              ],
            },
          },
        },
      },

      {
        $project: {
          _id: 0,

          totalRevenue: {
            $round: ["$totalRevenue", 2],
          },

          totalQuantitySold: 1,

          totalTransactions: 1,

          totalProfit: {
            $round: ["$totalProfit", 2],
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

          revenue: {
            $sum: {
              $multiply: ["$quantity", "$price"],
            },
          },
        },
      },

      {
        $sort: {
          "_id.day": 1,
        },
      },

      {
        $project: {
          _id: 0,

          day: "$_id.day",

          label: {
            $concat: [
              {
                $toString: "$_id.day",
              },

              " ",

              {
                $arrayElemAt: [
                  [
                    "",
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
                  ],

                  "$_id.month",
                ],
              },
            ],
          },

          revenue: {
            $round: ["$revenue", 2],
          },
        },
      },
    ]);

    const categoryChart = await Sale.aggregate([
      {
        $match: match,
      },

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

      /*
      |--------------------------------------------------------------------------
      | Apply category filter
      |--------------------------------------------------------------------------
      */

      ...(category
        ? [
            {
              $match: {
                "itemData.category": new mongoose.Types.ObjectId(category),
              },
            },
          ]
        : []),

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
        $group: {
          _id: {
            $ifNull: ["$categoryData.name", "Uncategorized"],
          },

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

          revenue: {
            $round: ["$revenue", 2],
          },

          quantity: 1,
        },
      },
    ]);

    const topItems = await Sale.aggregate([
      {
        $match: match,
      },

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

      ...(category
        ? [
            {
              $match: {
                "itemData.category": new mongoose.Types.ObjectId(category),
              },
            },
          ]
        : []),

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

      {
        $sort: {
          quantity: -1,
        },
      },

      {
        $limit: 10,
      },

      {
        $project: {
          _id: 0,

          name: 1,

          quantity: 1,

          revenue: {
            $round: ["$revenue", 2],
          },
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
          as: "item",
        },
      },
      {
        $unwind: "$item",
      },

      // Category
      {
        $lookup: {
          from: "categories",
          localField: "item.category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },

      // Stock
      {
        $lookup: {
          from: "stocks",
          localField: "item._id",
          foreignField: "item",
          as: "stock",
        },
      },
      {
        $unwind: {
          path: "$stock",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $project: {
          _id: 1,
          date: 1,

          item: "$item.name",

          category: "$category.name",

          quantity: 1,

          purchasePrice: {
            $ifNull: ["$stock.avgPurchasePrice", 0],
          },

          sellingPrice: "$price",

          purchaseTotal: {
            $multiply: [
              "$quantity",
              {
                $ifNull: ["$stock.avgPurchasePrice", 0],
              },
            ],
          },

          saleTotal: {
            $multiply: ["$quantity", "$price"],
          },

          profit: {
            $subtract: [
              {
                $multiply: ["$quantity", "$price"],
              },
              {
                $multiply: [
                  "$quantity",
                  {
                    $ifNull: ["$stock.avgPurchasePrice", 0],
                  },
                ],
              },
            ],
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

      month: selectedMonth,

      year: selectedYear,

      cards: cards.length
        ? cards[0]
        : {
            totalRevenue: 0,

            totalQuantitySold: 0,

            totalTransactions: 0,

            totalProfit: 0,
          },

      revenueChart,

      categoryChart,

      topItems,
    });
  } catch (error) {
    console.error("Get Summary Error:", error);

    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const getRecentSales = async (req, res) => {
  try {
    const { month, year, category } = req.query;

    const selectedMonth = Number(month) || new Date().getMonth() + 1;

    const selectedYear = Number(year) || new Date().getFullYear();

    const page = Math.max(Number(req.query.page) || 1, 1);

    const limit = Math.max(Number(req.query.limit) || 10, 1);

    const skip = (page - 1) * limit;

    /*
    |--------------------------------------------------------------------------
    | Month boundaries
    |--------------------------------------------------------------------------
    */

    const startDate = new Date(Date.UTC(selectedYear, selectedMonth - 1, 1));

    const endDate = new Date(Date.UTC(selectedYear, selectedMonth, 1));

    const match = {
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    };

    /*
    |--------------------------------------------------------------------------
    | Category filter
    |--------------------------------------------------------------------------
    */

    const categoryStages = [];

    if (category) {
      categoryStages.push({
        $match: {
          "item.category": new mongoose.Types.ObjectId(category),
        },
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Recent Sales
    |--------------------------------------------------------------------------
    */

    const result = await Sale.aggregate([
      {
        $match: match,
      },

      /*
      |--------------------------------------------------------------------------
      | Item
      |--------------------------------------------------------------------------
      */

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

      /*
      |--------------------------------------------------------------------------
      | Category filter
      |--------------------------------------------------------------------------
      */

      ...(category
        ? [
            {
              $match: {
                "itemData.category": new mongoose.Types.ObjectId(category),
              },
            },
          ]
        : []),

      /*
      |--------------------------------------------------------------------------
      | Category
      |--------------------------------------------------------------------------
      */

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

      /*
      |--------------------------------------------------------------------------
      | Stock
      |--------------------------------------------------------------------------
      */

      {
        $lookup: {
          from: "stocks",

          localField: "itemData._id",

          foreignField: "item",

          as: "stockData",
        },
      },

      {
        $unwind: {
          path: "$stockData",

          preserveNullAndEmptyArrays: true,
        },
      },

      /*
      |--------------------------------------------------------------------------
      | Data + pagination
      |--------------------------------------------------------------------------
      */

      {
        $facet: {
          data: [
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

            {
              $project: {
                _id: 1,

                date: 1,

                item: "$itemData.name",

                category: "$categoryData.name",

                quantity: 1,

                purchasePrice: {
                  $ifNull: ["$stockData.avgPurchasePrice", 0],
                },

                sellingPrice: "$price",

                purchaseTotal: {
                  $multiply: [
                    "$quantity",

                    {
                      $ifNull: ["$stockData.avgPurchasePrice", 0],
                    },
                  ],
                },

                saleTotal: {
                  $multiply: ["$quantity", "$price"],
                },

                profit: {
                  $subtract: [
                    {
                      $multiply: ["$quantity", "$price"],
                    },

                    {
                      $multiply: [
                        "$quantity",

                        {
                          $ifNull: ["$stockData.avgPurchasePrice", 0],
                        },
                      ],
                    },
                  ],
                },
              },
            },
          ],

          total: [
            {
              $count: "count",
            },
          ],
        },
      },
    ]);

    const salesData = result[0]?.data || [];

    const total = result[0]?.total?.[0]?.count || 0;

    /*
    |--------------------------------------------------------------------------
    | Response
    |--------------------------------------------------------------------------
    */

    res.status(200).json({
      success: true,

      recentSales: salesData,

      pagination: {
        total,

        page,

        limit,

        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get Recent Sales Error:", error);

    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

const { Revenue, RevenueCategory } = require("../../Model");

const createRevenue = async (req, res) => {
  try {
    const { amount, month, year, tenant, categoryId, description, note } = req.body;

    if (!amount || !month || !year || !tenant || !categoryId) {
      return res.status(400).json({
        message: "Amount, month, year, tenant, and categoryId are required",
      });
    }

    // Validate category exists and belongs to tenant
    const category = await RevenueCategory.findOne({
      where: {
        id: parseInt(categoryId),
        tenant,
      },
    });

    if (!category) {
      return res.status(400).json({
        message: "Invalid category or category does not belong to the specified tenant",
      });
    }

    const newRevenue = await Revenue.create({
      amount: parseFloat(amount),
      month,
      year: parseInt(year),
      tenant,
      categoryId: parseInt(categoryId),
      description: description || null,
      note: note || null,
    });

    const revenueWithCategory = await Revenue.findByPk(newRevenue.id, {
      include: [
        {
          model: RevenueCategory,
          as: "category",
        },
      ],
    });

    return res.status(200).json({
      message: "Revenue created successfully",
      data: revenueWithCategory,
    });
  } catch (error) {
    console.error("Error creating revenue:", error);
    return res.status(500).json({
      message: "Something went wrong",
      data: error.message,
    });
  }
};

module.exports = { createRevenue };



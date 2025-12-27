const { Revenue, RevenueCategory } = require("../../Model");

const updateRevenue = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, month, year, tenant, categoryId, description, note } = req.body;

    const revenue = await Revenue.findByPk(id);
    if (!revenue) {
      return res.status(404).json({ message: "Revenue not found" });
    }

    // Validate category if provided
    if (categoryId) {
      const category = await RevenueCategory.findOne({
        where: {
          id: parseInt(categoryId),
          tenant: tenant || revenue.tenant,
        },
      });

      if (!category) {
        return res.status(400).json({
          message: "Invalid category or category does not belong to the specified tenant",
        });
      }
    }

    await revenue.update({
      ...(amount && { amount: parseFloat(amount) }),
      ...(month && { month }),
      ...(year && { year: parseInt(year) }),
      ...(tenant && { tenant }),
      ...(categoryId && { categoryId: parseInt(categoryId) }),
      ...(description !== undefined && { description }),
      ...(note !== undefined && { note }),
    });

    const updatedRevenue = await Revenue.findByPk(revenue.id, {
      include: [
        {
          model: RevenueCategory,
          as: "category",
        },
      ],
    });

    return res.status(200).json({
      message: "Revenue updated successfully",
      data: updatedRevenue,
    });
  } catch (error) {
    console.error("Error updating revenue:", error);
    return res.status(500).json({
      message: "Something went wrong",
      data: error.message,
    });
  }
};

module.exports = { updateRevenue };



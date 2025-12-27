const { RevenueCategory, Revenue } = require("../../Model");

const deleteRevenueCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await RevenueCategory.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Revenue category not found" });
    }

    // Check if category is used in any revenues
    const revenuesCount = await Revenue.count({
      where: {
        categoryId: id,
      },
    });

    if (revenuesCount > 0) {
      return res.status(400).json({
        message: `Cannot delete category. It is used in ${revenuesCount} revenue(s)`,
      });
    }

    await category.destroy();

    return res.status(200).json({
      message: "Revenue category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting revenue category:", error);
    return res.status(500).json({
      message: "Something went wrong",
      data: error.message,
    });
  }
};

module.exports = { deleteRevenueCategory };



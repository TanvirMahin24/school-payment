const { ExpenseCategory } = require("../../Model");

const updateExpenseCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const category = await ExpenseCategory.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Expense category not found" });
    }

    // Check if new name conflicts with existing category for same tenant
    if (name && name !== category.name) {
      const existingCategory = await ExpenseCategory.findOne({
        where: {
          name,
          tenant: category.tenant,
        },
      });

      if (existingCategory) {
        return res.status(400).json({
          message: "Category with this name already exists for this tenant",
        });
      }
    }

    await category.update({
      ...(name && { name }),
      ...(description !== undefined && { description }),
    });

    return res.status(200).json({
      message: "Expense category updated successfully",
      data: category,
    });
  } catch (error) {
    console.error("Error updating expense category:", error);
    return res.status(500).json({
      message: "Something went wrong",
      data: error.message,
    });
  }
};

module.exports = { updateExpenseCategory };



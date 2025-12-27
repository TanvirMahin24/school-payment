const { ExpenseCategory, Expense } = require("../../Model");

const deleteExpenseCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await ExpenseCategory.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Expense category not found" });
    }

    // Check if category is used in any expenses
    const expensesCount = await Expense.count({
      where: {
        categoryId: id,
      },
    });

    if (expensesCount > 0) {
      return res.status(400).json({
        message: `Cannot delete category. It is used in ${expensesCount} expense(s)`,
      });
    }

    await category.destroy();

    return res.status(200).json({
      message: "Expense category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting expense category:", error);
    return res.status(500).json({
      message: "Something went wrong",
      data: error.message,
    });
  }
};

module.exports = { deleteExpenseCategory };



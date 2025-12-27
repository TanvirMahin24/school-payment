const { Expense, ExpenseCategory } = require("../../Model");

const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, month, year, tenant, categoryId, description, note } = req.body;

    const expense = await Expense.findByPk(id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Validate category if provided
    if (categoryId) {
      const category = await ExpenseCategory.findOne({
        where: {
          id: parseInt(categoryId),
          tenant: tenant || expense.tenant,
        },
      });

      if (!category) {
        return res.status(400).json({
          message: "Invalid category or category does not belong to the specified tenant",
        });
      }
    }

    await expense.update({
      ...(amount && { amount: parseFloat(amount) }),
      ...(month && { month }),
      ...(year && { year: parseInt(year) }),
      ...(tenant && { tenant }),
      ...(categoryId && { categoryId: parseInt(categoryId) }),
      ...(description !== undefined && { description }),
      ...(note !== undefined && { note }),
    });

    const updatedExpense = await Expense.findByPk(expense.id, {
      include: [
        {
          model: ExpenseCategory,
          as: "category",
        },
      ],
    });

    return res.status(200).json({
      message: "Expense updated successfully",
      data: updatedExpense,
    });
  } catch (error) {
    console.error("Error updating expense:", error);
    return res.status(500).json({
      message: "Something went wrong",
      data: error.message,
    });
  }
};

module.exports = { updateExpense };



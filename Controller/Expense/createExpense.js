const { Expense, ExpenseCategory } = require("../../Model");

const createExpense = async (req, res) => {
  try {
    const { amount, month, year, tenant, categoryId, description, note } = req.body;

    if (!amount || !month || !year || !tenant || !categoryId) {
      return res.status(400).json({
        message: "Amount, month, year, tenant, and categoryId are required",
      });
    }

    // Validate category exists and belongs to tenant
    const category = await ExpenseCategory.findOne({
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

    const newExpense = await Expense.create({
      amount: parseFloat(amount),
      month,
      year: parseInt(year),
      tenant,
      categoryId: parseInt(categoryId),
      description: description || null,
      note: note || null,
    });

    const expenseWithCategory = await Expense.findByPk(newExpense.id, {
      include: [
        {
          model: ExpenseCategory,
          as: "category",
        },
      ],
    });

    return res.status(200).json({
      message: "Expense created successfully",
      data: expenseWithCategory,
    });
  } catch (error) {
    console.error("Error creating expense:", error);
    return res.status(500).json({
      message: "Something went wrong",
      data: error.message,
    });
  }
};

module.exports = { createExpense };



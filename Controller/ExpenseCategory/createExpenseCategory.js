const { ExpenseCategory } = require("../../Model");

const createExpenseCategory = async (req, res) => {
  try {
    const { name, tenant, description } = req.body;

    if (!name || !tenant) {
      return res.status(400).json({
        message: "Name and tenant are required",
      });
    }

    // Check if category with same name exists for tenant
    const existingCategory = await ExpenseCategory.findOne({
      where: {
        name,
        tenant,
      },
    });

    if (existingCategory) {
      return res.status(400).json({
        message: "Category with this name already exists for this tenant",
      });
    }

    const newCategory = await ExpenseCategory.create({
      name,
      tenant,
      description: description || null,
    });

    return res.status(200).json({
      message: "Expense category created successfully",
      data: newCategory,
    });
  } catch (error) {
    console.error("Error creating expense category:", error);
    return res.status(500).json({
      message: "Something went wrong",
      data: error.message,
    });
  }
};

module.exports = { createExpenseCategory };





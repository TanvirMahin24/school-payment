const { CombinedRevenue } = require("../../Model");

const createCombinedRevenue = async (req, res) => {
  try {
    const { amount, month, year, type, description, note } = req.body;

    if (!amount || !month || !year || !type) {
      return res.status(400).json({
        message: "Amount, month, year, and type are required",
      });
    }

    const newCombinedRevenue = await CombinedRevenue.create({
      amount: parseFloat(amount),
      month,
      year: parseInt(year),
      type: String(type).trim(),
      description: description || null,
      note: note || null,
    });

    return res.status(200).json({
      message: "Combined revenue created successfully",
      data: newCombinedRevenue,
    });
  } catch (error) {
    console.error("Error creating combined revenue:", error);
    return res.status(500).json({
      message: "Something went wrong",
      data: error.message,
    });
  }
};

module.exports = { createCombinedRevenue };

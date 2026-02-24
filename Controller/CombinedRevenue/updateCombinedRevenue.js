const { CombinedRevenue } = require("../../Model");

const updateCombinedRevenue = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, month, year, type, description, note } = req.body;

    const combinedRevenue = await CombinedRevenue.findByPk(id);
    if (!combinedRevenue) {
      return res.status(404).json({ message: "Combined revenue not found" });
    }

    await combinedRevenue.update({
      ...(amount !== undefined && { amount: parseFloat(amount) }),
      ...(month && { month }),
      ...(year !== undefined && { year: parseInt(year) }),
      ...(type !== undefined && { type: String(type).trim() }),
      ...(description !== undefined && { description }),
      ...(note !== undefined && { note }),
    });

    return res.status(200).json({
      message: "Combined revenue updated successfully",
      data: combinedRevenue,
    });
  } catch (error) {
    console.error("Error updating combined revenue:", error);
    return res.status(500).json({
      message: "Something went wrong",
      data: error.message,
    });
  }
};

module.exports = { updateCombinedRevenue };

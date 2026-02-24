const { CombinedRevenue } = require("../../Model");

const deleteCombinedRevenue = async (req, res) => {
  try {
    const { id } = req.params;
    const combinedRevenue = await CombinedRevenue.findByPk(id);
    if (!combinedRevenue) {
      return res.status(404).json({ message: "Combined revenue not found" });
    }

    await combinedRevenue.destroy();

    return res.status(200).json({
      message: "Combined revenue deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting combined revenue:", error);
    return res.status(500).json({
      message: "Something went wrong",
      data: error.message,
    });
  }
};

module.exports = { deleteCombinedRevenue };

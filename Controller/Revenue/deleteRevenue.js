const { Revenue } = require("../../Model");

const deleteRevenue = async (req, res) => {
  try {
    const { id } = req.params;
    const revenue = await Revenue.findByPk(id);
    if (!revenue) {
      return res.status(404).json({ message: "Revenue not found" });
    }

    await revenue.destroy();

    return res.status(200).json({
      message: "Revenue deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting revenue:", error);
    return res.status(500).json({
      message: "Something went wrong",
      data: error.message,
    });
  }
};

module.exports = { deleteRevenue };



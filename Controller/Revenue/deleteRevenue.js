const { Revenue } = require("../../Model");
const { canAccessTenant } = require("../../Utils/permissions");

const deleteRevenue = async (req, res) => {
  try {
    const { id } = req.params;
    const revenue = await Revenue.findByPk(id);
    if (!revenue) {
      return res.status(404).json({ message: "Revenue not found" });
    }

    if (!canAccessTenant(req.user, revenue.tenant)) {
      return res.status(403).json({
        message: `You do not have permission to access ${revenue.tenant} tenant`,
      });
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




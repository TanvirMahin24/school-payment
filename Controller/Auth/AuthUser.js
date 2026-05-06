const { serializeUserPermissions } = require("../../Utils/permissions");

const authUserProfile = async (req, res) => {
  try {
    if (req.user) {
      return res.status(200).json({
        message: "User data",
        data: {
          name: req.user.name,
          email: req.user.email,
          permissions: serializeUserPermissions(req.user),
        },
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      data: error.message,
    });
  }
};

module.exports = { authUserProfile };


const Sequelize = require("sequelize");
const { Payment } = require("../../Model");

const getStudentMonthlyFees = async (req, res) => {
  try {
    const { tenant, year, userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
        data: {},
      });
    }

    if (!year) {
      return res.status(400).json({
        success: false,
        message: "Year is required",
        data: {},
      });
    }

    // Build where clause
    const whereClause = {
      userId: parseInt(userId),
      year: parseInt(year),
    };

    if (tenant) {
      whereClause.tenant = tenant;
    }

    // Fetch all payments for the student for the given year
    const payments = await Payment.findAll({
      where: whereClause,
      order: [["month", "ASC"]],
      attributes: ["id", "month", "year", "amount", "extra_amount", "exam_fee", "total_amount", "createdAt"],
    });

    // Create a map of month to payment status
    const monthlyFees = {};
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    // Initialize all months as unpaid
    monthNames.forEach((month) => {
      monthlyFees[month] = {
        month,
        paid: false,
        amount: 0,
        paymentId: null,
      };
    });

    // Mark paid months
    payments.forEach((payment) => {
      const monthName = payment.month;
      if (monthlyFees[monthName]) {
        monthlyFees[monthName] = {
          month: monthName,
          paid: true,
          amount: parseFloat(payment.total_amount || payment.amount || 0),
          paymentId: payment.id,
        };
      }
    });

    // Convert to array sorted by month order
    const result = monthNames.map((month) => monthlyFees[month]);

    return res.status(200).json({
      success: true,
      message: "Monthly fees retrieved successfully",
      data: {
        year: parseInt(year),
        userId: parseInt(userId),
        monthlyFees: result,
      },
    });
  } catch (error) {
    console.error("Error fetching student monthly fees:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      data: error.message,
    });
  }
};

module.exports = { getStudentMonthlyFees };

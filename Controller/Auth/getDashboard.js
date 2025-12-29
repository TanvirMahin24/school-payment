const { Payment, Expense, Revenue } = require("../../Model");
const { Op, Sequelize } = require("sequelize");

const getDashboard = async (req, res) => {
  try {
    const { tenant } = req.query;
    const d = new Date();
    const currentMonth = d.toLocaleString("default", { month: "long" });
    const currentYear = d.getFullYear();

    // Build where clause with tenant if provided
    const paymentWhere = tenant ? { tenant } : {};
    const expenseWhere = tenant ? { tenant } : {};
    const revenueWhere = tenant ? { tenant } : {};

    // Total Payments
    const paymentCount = await Payment.count({ where: paymentWhere });
    const totalPaymentAmount = await Payment.sum("total_amount", { where: paymentWhere }) || 0;

    // Current Month Payments
    const thisMonthPaymentWhere = {
      ...paymentWhere,
      month: currentMonth,
      year: currentYear,
    };
    const thisMonthPayments = await Payment.count({ where: thisMonthPaymentWhere });
    const thisMonthPaymentAmount = await Payment.sum("total_amount", { where: thisMonthPaymentWhere }) || 0;

    // Current Year Payments
    const thisYearPaymentWhere = {
      ...paymentWhere,
      year: currentYear,
    };
    const thisYearPayments = await Payment.count({ where: thisYearPaymentWhere });
    const thisYearPaymentAmount = await Payment.sum("total_amount", { where: thisYearPaymentWhere }) || 0;

    // Total Expenses
    const expenseCount = await Expense.count({ where: expenseWhere });
    const totalExpenseAmount = await Expense.sum("amount", { where: expenseWhere }) || 0;

    // Current Month Expenses
    const thisMonthExpenseWhere = {
      ...expenseWhere,
      month: currentMonth,
      year: currentYear,
    };
    const thisMonthExpenses = await Expense.count({ where: thisMonthExpenseWhere });
    const thisMonthExpenseAmount = await Expense.sum("amount", { where: thisMonthExpenseWhere }) || 0;

    // Current Year Expenses
    const thisYearExpenseWhere = {
      ...expenseWhere,
      year: currentYear,
    };
    const thisYearExpenseAmount = await Expense.sum("amount", { where: thisYearExpenseWhere }) || 0;

    // Total Revenues
    const revenueCount = await Revenue.count({ where: revenueWhere });
    const totalRevenueAmount = await Revenue.sum("amount", { where: revenueWhere }) || 0;

    // Current Month Revenues
    const thisMonthRevenueWhere = {
      ...revenueWhere,
      month: currentMonth,
      year: currentYear,
    };
    const thisMonthRevenues = await Revenue.count({ where: thisMonthRevenueWhere });
    const thisMonthRevenueAmount = await Revenue.sum("amount", { where: thisMonthRevenueWhere }) || 0;

    // Current Year Revenues
    const thisYearRevenueWhere = {
      ...revenueWhere,
      year: currentYear,
    };
    const thisYearRevenueAmount = await Revenue.sum("amount", { where: thisYearRevenueWhere }) || 0;

    // Calculate totals (Payments + Revenues)
    const totalRevenue = parseFloat(totalPaymentAmount) + parseFloat(totalRevenueAmount);
    const thisMonthTotalRevenue = parseFloat(thisMonthPaymentAmount) + parseFloat(thisMonthRevenueAmount);
    const thisYearTotalRevenue = parseFloat(thisYearPaymentAmount) + parseFloat(thisYearRevenueAmount);

    // Calculate Profit
    const totalProfit = totalRevenue - parseFloat(totalExpenseAmount);
    const thisMonthProfit = thisMonthTotalRevenue - parseFloat(thisMonthExpenseAmount);
    const thisYearProfit = thisYearTotalRevenue - parseFloat(thisYearExpenseAmount);

    return res.status(200).json({
      message: "Dashboard data",
      data: {
        // Payment stats
        payments: paymentCount,
        totalPaymentAmount: parseFloat(totalPaymentAmount).toFixed(2),
        thisMonthPayments,
        thisMonthPaymentAmount: parseFloat(thisMonthPaymentAmount).toFixed(2),
        thisYearPayments,
        thisYearPaymentAmount: parseFloat(thisYearPaymentAmount).toFixed(2),
        
        // Expense stats
        expenses: expenseCount,
        totalExpenseAmount: parseFloat(totalExpenseAmount).toFixed(2),
        thisMonthExpenses,
        thisMonthExpenseAmount: parseFloat(thisMonthExpenseAmount).toFixed(2),
        thisYearExpenseAmount: parseFloat(thisYearExpenseAmount).toFixed(2),
        
        // Revenue stats
        revenues: revenueCount,
        totalRevenueAmount: parseFloat(totalRevenueAmount).toFixed(2),
        thisMonthRevenues,
        thisMonthRevenueAmount: parseFloat(thisMonthRevenueAmount).toFixed(2),
        thisYearRevenueAmount: parseFloat(thisYearRevenueAmount).toFixed(2),
        
        // Combined stats
        totalRevenue: totalRevenue.toFixed(2),
        thisMonthTotalRevenue: thisMonthTotalRevenue.toFixed(2),
        thisYearTotalRevenue: thisYearTotalRevenue.toFixed(2),
        
        // Profit stats
        totalProfit: totalProfit.toFixed(2),
        thisMonthProfit: thisMonthProfit.toFixed(2),
        thisYearProfit: thisYearProfit.toFixed(2),
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return res.status(500).json({
      message: "Something went wrong",
      data: error.message,
    });
  }
};

module.exports = { getDashboard };



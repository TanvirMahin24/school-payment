const { Payment, Expense, Revenue } = require("../../Model");
const { Op, Sequelize } = require("sequelize");

const getDashboard = async (req, res) => {
  try {
    const { tenant, month, year, yearly } = req.query;
    const d = new Date();
    const currentMonth = d.toLocaleString("default", { month: "long" });
    const currentYear = d.getFullYear();
    const monthFilter = month || currentMonth;
    const yearFilter = year ? parseInt(year, 10) : currentYear;
    const yearlyFilter = yearly ? parseInt(yearly, 10) : (year ? parseInt(year, 10) : currentYear);

    // Build where clause with tenant if provided
    const paymentWhere = tenant ? { tenant } : {};
    const expenseWhere = tenant ? { tenant } : {};
    const revenueWhere = tenant ? { tenant } : {};

    // Total Payments
    const paymentCount = await Payment.count({ where: paymentWhere });
    const totalPaymentAmount = await Payment.sum("amount", { where: paymentWhere }) || 0;
    const totalExtraPaymentAmount = await Payment.sum("extra_amount", { where: paymentWhere }) || 0;
    const totalCombinedPaymentAmount = await Payment.sum("total_amount", { where: paymentWhere }) || 0;

    // Monthly Payments (month + year)
    const thisMonthPaymentWhere = {
      ...paymentWhere,
      month: monthFilter,
      year: yearFilter,
    };
    const thisMonthPayments = await Payment.count({ where: thisMonthPaymentWhere });
    const thisMonthPaymentAmount = await Payment.sum("amount", { where: thisMonthPaymentWhere }) || 0;
    const thisMonthExtraPaymentAmount = await Payment.sum("extra_amount", { where: thisMonthPaymentWhere }) || 0;
    const thisMonthCombinedPaymentAmount = await Payment.sum("total_amount", { where: thisMonthPaymentWhere }) || 0;

    // Yearly Payments (year only)
    const thisYearPaymentWhere = {
      ...paymentWhere,
      year: yearlyFilter,
    };
    const thisYearPayments = await Payment.count({ where: thisYearPaymentWhere });
    const thisYearPaymentAmount = await Payment.sum("amount", { where: thisYearPaymentWhere }) || 0;
    const thisYearExtraPaymentAmount = await Payment.sum("extra_amount", { where: thisYearPaymentWhere }) || 0;
    const thisYearCombinedPaymentAmount = await Payment.sum("total_amount", { where: thisYearPaymentWhere }) || 0;

    // Total Expenses
    const expenseCount = await Expense.count({ where: expenseWhere });
    const totalExpenseAmount = await Expense.sum("amount", { where: expenseWhere }) || 0;

    // Monthly Expenses (month + year)
    const thisMonthExpenseWhere = {
      ...expenseWhere,
      month: monthFilter,
      year: yearFilter,
    };
    const thisMonthExpenses = await Expense.count({ where: thisMonthExpenseWhere });
    const thisMonthExpenseAmount = await Expense.sum("amount", { where: thisMonthExpenseWhere }) || 0;

    // Yearly Expenses (year only)
    const thisYearExpenseWhere = {
      ...expenseWhere,
      year: yearlyFilter,
    };
    const thisYearExpenses = await Expense.count({ where: thisYearExpenseWhere });
    const thisYearExpenseAmount = await Expense.sum("amount", { where: thisYearExpenseWhere }) || 0;

    // Total Revenues
    const revenueCount = await Revenue.count({ where: revenueWhere });
    const totalRevenueAmount = await Revenue.sum("amount", { where: revenueWhere }) || 0;

    // Monthly Revenues (month + year)
    const thisMonthRevenueWhere = {
      ...revenueWhere,
      month: monthFilter,
      year: yearFilter,
    };
    const thisMonthRevenues = await Revenue.count({ where: thisMonthRevenueWhere });
    const thisMonthRevenueAmount = await Revenue.sum("amount", { where: thisMonthRevenueWhere }) || 0;

    // Yearly Revenues (year only)
    const thisYearRevenueWhere = {
      ...revenueWhere,
      year: yearlyFilter,
    };
    const thisYearRevenues = await Revenue.count({ where: thisYearRevenueWhere });
    const thisYearRevenueAmount = await Revenue.sum("amount", { where: thisYearRevenueWhere }) || 0;

    // Calculate totals (Payments + Extra Payments + Revenues)
    const totalRevenue = parseFloat(totalCombinedPaymentAmount) + parseFloat(totalRevenueAmount);
    const thisMonthTotalRevenue = parseFloat(thisMonthCombinedPaymentAmount) + parseFloat(thisMonthRevenueAmount);
    const thisYearTotalRevenue = parseFloat(thisYearCombinedPaymentAmount) + parseFloat(thisYearRevenueAmount);

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
        totalExtraPaymentAmount: parseFloat(totalExtraPaymentAmount).toFixed(2),
        totalCombinedPaymentAmount: parseFloat(totalCombinedPaymentAmount).toFixed(2),
        thisMonthPayments,
        thisMonthPaymentAmount: parseFloat(thisMonthPaymentAmount).toFixed(2),
        thisMonthExtraPaymentAmount: parseFloat(thisMonthExtraPaymentAmount).toFixed(2),
        thisMonthCombinedPaymentAmount: parseFloat(thisMonthCombinedPaymentAmount).toFixed(2),
        thisYearPayments,
        thisYearPaymentAmount: parseFloat(thisYearPaymentAmount).toFixed(2),
        thisYearExtraPaymentAmount: parseFloat(thisYearExtraPaymentAmount).toFixed(2),
        thisYearCombinedPaymentAmount: parseFloat(thisYearCombinedPaymentAmount).toFixed(2),
        
        // Expense stats
        expenses: expenseCount,
        totalExpenseAmount: parseFloat(totalExpenseAmount).toFixed(2),
        thisMonthExpenses,
        thisMonthExpenseAmount: parseFloat(thisMonthExpenseAmount).toFixed(2),
        thisYearExpenses,
        thisYearExpenseAmount: parseFloat(thisYearExpenseAmount).toFixed(2),
        
        // Revenue stats
        revenues: revenueCount,
        totalRevenueAmount: parseFloat(totalRevenueAmount).toFixed(2),
        thisMonthRevenues,
        thisMonthRevenueAmount: parseFloat(thisMonthRevenueAmount).toFixed(2),
        thisYearRevenues,
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



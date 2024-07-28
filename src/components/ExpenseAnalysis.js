import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥'
};

function ExpenseAnalysis({ expenses, budget, currency }) {
    const currencySymbol = currencySymbols[currency] || '$';
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const averageExpense = totalExpenses / expenses.length || 0;

    const categoryTotals = expenses.reduce((totals, expense) => {
        totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
        return totals;
    }, {});

    const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

    const predictMonthlyExpense = () => {
        const msPerDay = 24 * 60 * 60 * 1000;
        const dateRange = expenses.length > 1
            ? (new Date(expenses[expenses.length - 1].date) - new Date(expenses[0].date)) / msPerDay
            : 1;
        const dailyAverage = totalExpenses / dateRange;
        return (dailyAverage * 30).toFixed(2);
    }

    // const predictCategoryExpenses = () => {
    //     const predictions = {};
    //     for (const [category, total] of Object.entries(categoryTotals)) {
    //         const categoryExpenses = expenses.filter(e => e.category === category);
    //         const categoryDateRange = categoryExpenses.length > 1
    //             ? (new Date(categoryExpenses[categoryExpenses.length - 1].date) - new Date(categoryExpenses[0].date)) / (24 * 60 * 60 * 1000)
    //             : 1;
    //         const dailyAverage = total / categoryDateRange;
    //         predictions[category] = (dailyAverage * 30).toFixed(2);
    //     }
    //     return predictions;
    // }

    // const categoryPredictions = predictCategoryExpenses();

    const currentMonthExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        const currentDate = new Date();
        return expenseDate.getMonth() === currentDate.getMonth() &&
            expenseDate.getFullYear() === currentDate.getFullYear();
    }).reduce((sum, expense) => sum + expense.amount, 0);

    // const budgetProgress = budget ? (currentMonthExpenses / budget) * 100 : 0;

    return (
        <Box sx={{ mb: 2 }}>
            <Typography variant="h5" gutterBottom>Expense Analysis</Typography>
            <Typography>Total Expenses: {currencySymbol}{totalExpenses.toFixed(2)}</Typography>
            <Typography>Average Expense: {currencySymbol}{averageExpense.toFixed(2)}</Typography>
            <Typography>Top Spending Category: {topCategory ? `${topCategory[0]} (${currencySymbol}${topCategory[1].toFixed(2)})` : 'N/A'}</Typography>
            <Typography>Predicted Monthly Expense: {currencySymbol}{predictMonthlyExpense()}</Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Budget Tracking</Typography>
            <Typography>Overall Monthly Budget: {currencySymbol}{budget.overall.toFixed(2)}</Typography>
            <Typography>Current Month Expenses: {currencySymbol}{currentMonthExpenses.toFixed(2)}</Typography>
            <Typography>Remaining: {currencySymbol}{(budget.overall - currentMonthExpenses).toFixed(2)}</Typography>
            <LinearProgress
                variant="determinate"
                value={Math.min((currentMonthExpenses / budget.overall) * 100, 100)}
                sx={{ mt: 1, mb: 1 }}
            />
            <Typography>
                {currentMonthExpenses > budget.overall
                    ? `Over budget by ${((currentMonthExpenses - budget.overall) / budget.overall * 100).toFixed(2)}%`
                    : `${((currentMonthExpenses / budget.overall) * 100).toFixed(2)}% of budget used`}
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Category Budgets</Typography>
            {Object.entries(budget.categories).map(([category, categoryBudget]) => {
                const categoryExpenses = expenses.filter(e => e.category === category && new Date(e.date).getMonth() === new Date().getMonth())
                    .reduce((sum, e) => sum + e.amount, 0);
                const percentage = (categoryExpenses / categoryBudget) * 100;

                return (
                    <Box key={category} sx={{ mb: 2 }}>
                        <Typography>{category}: {currencySymbol}{categoryExpenses.toFixed(2)} / {currencySymbol}{categoryBudget.toFixed(2)}</Typography>
                        <LinearProgress
                            variant="determinate"
                            value={Math.min(percentage, 100)}
                            sx={{ mt: 1, mb: 1 }}
                        />
                        <Typography>
                            {percentage > 100
                                ? `Over budget by ${(percentage - 100).toFixed(2)}%`
                                : `${percentage.toFixed(2)}% of budget used`}
                        </Typography>
                    </Box>
                );
            })}
        </Box>
    );
}

export default ExpenseAnalysis;
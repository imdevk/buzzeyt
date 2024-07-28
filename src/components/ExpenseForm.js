import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Autocomplete from '@mui/material/Autocomplete';

const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥'
};

function ExpenseForm({ onAddExpense, editingExpense, onUpdateExpense, expenses, currency }) {
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');

    const currencySymbol = currencySymbols[currency] || '$';

    useEffect(() => {
        if (editingExpense) {
            setAmount(editingExpense.amount);
            setCategory(editingExpense.category);
            setDate(editingExpense.date);
        }
    }, [editingExpense]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount || !category || !date) return;

        if (editingExpense) {
            onUpdateExpense({ ...editingExpense, amount: parseFloat(amount), category, date });
        } else {
            onAddExpense({ amount: parseFloat(amount), category, date });
        }

        setAmount('');
        setCategory('');
        setDate('');
    };

    const uniqueCategories = [...new Set(expenses.map(expense => expense.category))];

    return (
        <Paper elevation={3}>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, p: 2 }}>
                <Typography variant="h6" gutterBottom>
                    {editingExpense ? 'Edit Expense' : 'Add New Expense'}
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            label={`Amount (${currencySymbol})`}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Autocomplete
                            freeSolo
                            options={uniqueCategories}
                            value={category}
                            onChange={(event, newValue) => {
                                setCategory(newValue);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Category"
                                    required
                                    onChange={(e) => setCategory(e.target.value)}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            label="Date"
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                    </Grid>
                </Grid>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button type="submit" variant="contained" color="primary">
                        {editingExpense ? 'Update Expense' : 'Add Expense'}
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
}

export default ExpenseForm;
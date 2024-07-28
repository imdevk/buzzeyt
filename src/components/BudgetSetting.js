import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

function BudgetSetting({ onSetBudget, currentBudget, expenses, onSetCurrency, currentCurrency }) {
    const [overallBudget, setOverallBudget] = useState(currentBudget?.overall || '');
    const [categoryBudgets, setCategoryBudgets] = useState(currentBudget?.categories || {});
    const [currency, setCurrency] = useState(currentCurrency || 'USD');

    const uniqueCategories = [...new Set(expenses.map(expense => expense.category))];

    const handleSubmit = (e) => {
        e.preventDefault();
        const newBudget = {
            overall: parseFloat(overallBudget) || 0,
            categories: categoryBudgets
        };
        onSetBudget(newBudget);
        onSetCurrency(currency);
    };

    const handleCategoryBudgetChange = (category, value) => {
        setCategoryBudgets(prev => ({
            ...prev,
            [category]: parseFloat(value) || 0
        }));
    };

    return (
        <Paper elevation={3}>
            <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Budget Settings</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            type="number"
                            value={overallBudget}
                            onChange={(e) => setOverallBudget(e.target.value)}
                            label="Overall Monthly Budget"
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Currency</InputLabel>
                            <Select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                label="Currency"
                            >
                                <MenuItem value="USD">USD ($)</MenuItem>
                                <MenuItem value="EUR">EUR (€)</MenuItem>
                                <MenuItem value="GBP">GBP (£)</MenuItem>
                                <MenuItem value="JPY">JPY (¥)</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    {uniqueCategories.map(category => (
                        <Grid item xs={12} sm={6} key={category}>
                            <TextField
                                fullWidth
                                type="number"
                                value={categoryBudgets[category] || ''}
                                onChange={(e) => handleCategoryBudgetChange(category, e.target.value)}
                                label={`Budget for ${category}`}
                            />
                        </Grid>
                    ))}
                </Grid>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button type="submit" variant="contained" color="primary">
                        Save Settings
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
}

export default BudgetSetting;
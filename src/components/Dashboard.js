import React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import ExpenseChart from './ExpenseChart';
import ExpenseAnalysis from './ExpenseAnalysis';

function Dashboard({ expenses, budget, currency }) {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
                <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <ExpenseChart expenses={expenses} currency={currency} />
                </Paper>
            </Grid>
            <Grid item xs={12} lg={4}>
                <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <ExpenseAnalysis expenses={expenses} budget={budget} currency={currency} />
                </Paper>
            </Grid>
        </Grid>
    );
}

export default Dashboard;
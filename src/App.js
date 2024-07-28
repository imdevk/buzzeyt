import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import BarChartIcon from '@mui/icons-material/BarChart';
import ListIcon from '@mui/icons-material/List';
import SettingsIcon from '@mui/icons-material/Settings';
import Dashboard from './components/Dashboard';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import BudgetSetting from './components/BudgetSetting';
import theme from './theme/theme';

function App() {
  const [expenses, setExpenses] = useState(() => {
    const storedExpenses = localStorage.getItem('expenses');
    return storedExpenses ? JSON.parse(storedExpenses) : [];
  });
  const [budget, setBudget] = useState(() => {
    const storedBudget = localStorage.getItem('budget');
    return storedBudget ? JSON.parse(storedBudget) : { overall: 0, categories: {} };
  });
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('currency') || 'USD';
  });
  const [view, setView] = useState('dashboard');
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
    localStorage.setItem('budget', JSON.stringify(budget));
    localStorage.setItem('currency', currency);
  }, [expenses, budget, currency]);

  const addExpense = (expense) => {
    setExpenses([...expenses, { ...expense, id: Date.now() }]);
    setView('list');
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const editExpense = (id) => {
    const expense = expenses.find(e => e.id === id);
    setEditingExpense(expense);
    setView('form');
  };

  const updateExpense = (updatedExpense) => {
    setExpenses(expenses.map(e => e.id === updatedExpense.id ? updatedExpense : e));
    setEditingExpense(null);
    setView('list');
  };

  const handleSetBudget = (newBudget) => {
    setBudget(newBudget);
  };

  const handleSetCurrency = (newCurrency) => {
    setCurrency(newCurrency);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" color="primary" elevation={0} sx={{ padding: '0' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div">
            Expense Tracker
          </Typography>
          <Box>
            <Button
              color="inherit"
              onClick={() => setView('dashboard')}
              startIcon={<BarChartIcon />}
              sx={{ mr: 1 }}
            >
              Dashboard
            </Button>
            <Button
              color="inherit"
              onClick={() => setView('form')}
              startIcon={<AddIcon />}
              sx={{ mr: 1 }}
            >
              Add
            </Button>
            <Button
              color="inherit"
              onClick={() => setView('list')}
              startIcon={<ListIcon />}
              sx={{ mr: 1 }}
            >
              Expenses
            </Button>
            <Button
              color="inherit"
              onClick={() => setView('settings')}
              startIcon={<SettingsIcon />}
            >
              Settings
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {view === 'dashboard' && <Dashboard expenses={expenses} budget={budget} currency={currency} />}
          {view === 'form' && (
            <ExpenseForm
              onAddExpense={addExpense}
              editingExpense={editingExpense}
              onUpdateExpense={updateExpense}
              expenses={expenses}
              currency={currency}
            />
          )}
          {view === 'list' && (
            <ExpenseList
              expenses={expenses}
              onDeleteExpense={deleteExpense}
              onEditExpense={editExpense}
              currency={currency}
            />
          )}
          {view === 'settings' && (
            <BudgetSetting
              onSetBudget={handleSetBudget}
              currentBudget={budget}
              expenses={expenses}
              onSetCurrency={handleSetCurrency}
              currentCurrency={currency}
            />
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
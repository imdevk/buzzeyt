import React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

function DateRangeFilter({ startDate, endDate, onStartDateChange, onEndDateChange }) {
    return (
        <Box sx={{ mb: 2 }}>
            <TextField
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                label="Start Date"
                InputLabelProps={{ shrink: true }}
                sx={{ mr: 1 }}
            />
            <TextField
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                label="End Date"
                InputLabelProps={{ shrink: true }}
            />
        </Box>
    );
}

export default DateRangeFilter;
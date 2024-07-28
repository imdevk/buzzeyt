import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#3f51b5',
        },
        secondary: {
            main: '#f50057',
        },
        background: {
            default: '#f5f5f5',
            paper: '#ffffff',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h5: {
            fontWeight: 600,
        },
        h6: {
            fontWeight: 600,
        },
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    padding: '24px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    transition: 'box-shadow 0.3s ease-in-out',
                    '&:hover': {
                        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '25px',
                    textTransform: 'none',
                    fontWeight: 500,
                    padding: '10px 20px',
                    transition: 'background-color 0.3s ease-in-out',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        transition: 'box-shadow 0.3s ease-in-out',
                        '&:hover': {
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        },
                        '&.Mui-focused': {
                            boxShadow: '0 4px 8px rgba(63, 81, 181, 0.25)',
                        },
                    },
                },
            },
        },
    },
});

export default theme;
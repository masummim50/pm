

import { Outlet } from 'react-router-dom';

import { ThemeProvider, createTheme } from '@mui/material/styles';
const PrivateProject = () => {
    
    const theme = createTheme();
    return (
        <ThemeProvider theme={theme}>

            <Outlet/>
        </ThemeProvider>
    );
};

export default PrivateProject;
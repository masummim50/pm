
import { Box, Paper, Button } from '@mui/material';
const Header = () => {
    return (
        <Paper sx={{marginBottom:'10px'}} style={{color:'red', background:'transparent', padding:'10px 0'}}>
            <Box sx={{maxWidth:'1100px', margin:'auto', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <div className="logo">logo</div>
                <div className="menu">
                    <Button variant='contained'>Log In</Button>
                    <Button>Register</Button>
                </div>
            </Box>
        </Paper>
    );
};

export default Header;
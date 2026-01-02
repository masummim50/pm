import { Box, Icon, Typography } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import FolderOffIcon  from '@mui/icons-material/FolderOff';

const NoItemFound = ({title}:{title:string}) => {
    return (
        <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              flexDirection: "column",
              justifyContent: "center",
              height: "200px",
              background: blueGrey[200],
              color: blueGrey[900],
            }}
          >
            <Typography>No {title} Found</Typography>
            <Icon>
              <FolderOffIcon />
            </Icon>
          </Box>
    );
};

export default NoItemFound;
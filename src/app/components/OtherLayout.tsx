import * as React from "react";
import Box from "@mui/material/Box";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Link, Outlet, useLocation } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import GroupsIcon from "@mui/icons-material/Groups";
import { Tooltip } from "@mui/material";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import Avatar from "@mui/material/Avatar";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { removeUser } from "../redux/features/user/userSlice";
import { red, blueGrey } from "@mui/material/colors";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useLazyGetTodosQuery } from "../redux/features/todo/todo.api";
import { useLazyGetPersonalProjectsQuery, useLazyGetTeamProjectsQuery } from "../redux/features/project/project.api";
// import ContactPageIcon from '@mui/icons-material/ContactPage';
const drawerWidth = 240;
const openWidth = 1000;
const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));
const links = [
  // { title: "Testing", url: "/test", icon: <PersonIcon /> },
  { title: "Profile", url: "/dashboard", icon: <PersonIcon /> },
  { title: "Todos", url: "/todos", icon: <FormatListBulletedIcon /> },
  {
    title: "Personal Projects",
    url: "/personalprojects",
    icon: <AccountTreeIcon />,
  },
  { title: "Team Projects", url: "/teamprojects", icon: <GroupsIcon /> },
  { title: "Journal", url: "/journal", icon: <MenuBookIcon /> },
  {
    title: "Log Out",
    url: "/",
    logout: "true",
    icon: <LogoutIcon sx={{ color: "red" }} />,
  },
];

const settings = ["LogOut"];

export default function OtherLayout() {

  // data fetch functions
  const [triggerQuery] = useLazyGetTodosQuery(undefined);
  const [triggerPersonalProjectQuery] = useLazyGetPersonalProjectsQuery(undefined);
  const [triggerTeamProjectQuery] = useLazyGetTeamProjectsQuery(undefined)



  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    localStorage.removeItem("project-m-token");
    dispatch(removeUser());
  };
  const [windowSize, setWindowSize] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [open, setOpen] = React.useState(windowSize.width > openWidth);
  React.useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      setOpen(windowSize.width > openWidth);
    };
    const mediaQueryList = window.matchMedia("(min-width: 600px)");
    handleResize();
    // mediaQueryList.addListener(handleResize);
    mediaQueryList.addEventListener("change", handleResize);
    window.addEventListener("resize", handleResize);
    return () => {
      mediaQueryList.removeEventListener("change", handleResize);
      window.removeEventListener("resize", handleResize);
    };
  }, [windowSize.width, open]);
  const theme = useTheme();

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const { pathname } = useLocation();

  return (
    <Box
      sx={{
        display: "flex",
        //  background: blueGrey[900],
        minHeight: "100vh",
      }}
    >
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          // background: blueGrey[800],
        }}
      >
        <Toolbar>
          <Container
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div className="logo">
              <img src="/logo.png" style={{ height: "50px" }} alt="" />
            </div>
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip
                title={
                  <p>
                    {user?.name} <br /> {user?.email}
                  </p>
                }
              >
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={user?.name || "u"}
                    src="/static/images/avatar/2.jpg"
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    {/* <Typography textAlign="center">{setting}</Typography> */}
                    <Button onClick={handleLogout}>Log Out</Button>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Container>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          height: "100vh",
          border: "none",
          // "& .MuiDrawer-paper": { borderWidth: 0 },
        }}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        {/* <Divider /> */}
        <List
          sx={{
            // background: blueGrey[800],
            height: "100vh",
            display: "flex",
            // padding: "5px 5px",
            flexDirection: "column",
            gap: 1,

          }}
        >
          {links.map((link, index) => (
            <Link
              onMouseEnter={() => {
                link.title === 'Todos' ? triggerQuery(undefined, true) : link.title === 'Personal Projects' ? triggerPersonalProjectQuery(undefined, true) : link.title === 'Team Projects' ? triggerTeamProjectQuery(undefined, true) : console.log('hovered hover nothing')
            }}
              onClick={() => {
                link.logout ? handleLogout() : null;
              }}
              style={{
                textDecoration: "none",
                color: link.logout ? red[500] : blueGrey[800],
              }}
              to={link.url}
              key={index}
            >
              <ListItem
                selected={pathname.includes(link.url) && link.url != "/"}
                disablePadding
                sx={{
                  display: "block",
                  transition: "all ease in out",
                  transitionDuration: "300ms",
                  borderRadius: "5px",
                }}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  {!open ? (
                    <Tooltip title={link.title} placement="right">
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : "auto",
                          justifyContent: "center",
                        }}
                      >
                        {link.icon}
                      </ListItemIcon>
                    </Tooltip>
                  ) : (
                    <ListItemIcon
                      sx={{
                        // color: blueGrey[200],
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      {link.icon}
                    </ListItemIcon>
                  )}
                  <ListItemText
                    primary={link.title}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </ListItem>
            </Link>
          ))}
        </List>

        {/* {
  open ? 
  <a style={{textDecoration:'none', textAlign:'center', color:'lime', backgroundColor:blueGrey[700], padding:'10px 0', display:'flex', alignItems:'center', justifyContent:'center'}} href="https://masum-dev.vercel.app/contact" target="_blank"><ContactPageIcon/>Contact Developer</a> :
  <Tooltip title="Contact Developer" placement="right">
    <a style={{textDecoration:'none', textAlign:'center', color:'lime', backgroundColor:blueGrey[700],  padding:'10px 0', display:'flex', alignItems:'center', justifyContent:'center'}} href="https://masum-dev.vercel.app/contact" target="_blank"><ContactPageIcon/></a>
  </Tooltip>
} */}
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          padding: "10px 10px 60px 10px",
          margin: "65px 5px 0",
          borderRadius: "5px",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

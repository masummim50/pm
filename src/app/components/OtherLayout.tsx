import * as React from "react";
import Box from "@mui/material/Box";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
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
import LogoutIcon from "@mui/icons-material/Logout";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { removeUser } from "../redux/features/user/userSlice";
import { red, blueGrey } from "@mui/material/colors";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useLazyGetTodosQuery } from "../redux/features/todo/todo.api";
import { useLazyGetPersonalProjectsQuery, useLazyGetTeamProjectsQuery } from "../redux/features/project/project.api";
import {
  Shield,
  User as UserIcon,
  LogOut
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  { title: "Profile", url: "/dashboard/profile", icon: <PersonIcon /> },
  { title: "Todos", url: "/dashboard/todos", icon: <FormatListBulletedIcon /> },
  {
    title: "Personal Projects",
    url: "/dashboard/personalprojects",
    icon: <AccountTreeIcon />,
  },
  { title: "Team Projects", url: "/dashboard/teamprojects", icon: <GroupsIcon /> },
  { title: "Journal", url: "/dashboard/journal", icon: <MenuBookIcon /> },
  {
    title: "Log Out",
    url: "/",
    logout: "true",
    icon: <LogoutIcon sx={{ color: "red" }} />,
  },
];

// const settings = ["LogOut"];

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
        minHeight: "100vh",
        bgcolor: 'transparent'
      }}
    >
      <CssBaseline />

      {/* Redesigned Header */}
      <header className="fixed top-0 right-0 left-0 h-16 bg-neutral-950/70 backdrop-blur-xl border-b border-neutral-800/50 flex items-center px-6 z-[1300] transition-all">
        <div className="w-full flex justify-between items-center">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Chronova</span>
          </Link>

          {/* Profile Section */}
          <div className="relative">
            <button
              onClick={handleOpenUserMenu}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-neutral-800/50 transition-colors border border-transparent hover:border-neutral-700/50 group"
            >
              <div className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700 overflow-hidden group-hover:border-blue-500/50 transition-all">
                <UserIcon className="w-5 h-5 text-neutral-400 group-hover:text-blue-400" />
              </div>
            </button>

            <AnimatePresence>
              {Boolean(anchorElUser) && (
                <>
                  {/* Backdrop for closing */}
                  <div
                    className="fixed inset-0 z-40 bg-transparent"
                    onClick={handleCloseUserMenu}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 mt-3 w-64 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-2 z-50 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-neutral-800 mb-2">
                      <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                      <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        handleLogout();
                        handleCloseUserMenu();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-xl transition-colors group text-left"
                    >
                      <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      Sign Out
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          height: "100vh",
          "& .MuiDrawer-paper": {
            border: "none",
            bgcolor: 'neutral.950',
            borderRight: '1px solid rgba(255,255,255,0.05)',
            boxShadow: 'none'
          },
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
            px: 1,
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
                  transition: "all 300ms ease-in-out",
                  borderRadius: "12px",
                  mb: 0.5,
                  "&.Mui-selected": {
                    bgcolor: 'rgba(59, 130, 246, 0.1) !important',
                    color: '#60a5fa !important',
                    "& .MuiListItemIcon-root": {
                      color: '#60a5fa',
                    }
                  },
                  "&:hover": {
                    bgcolor: 'rgba(255, 255, 255, 0.03)',
                  }
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


      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          padding: "10px 0px 0px 10px",
          margin: "50px 0px 0px 0px",
          borderRadius: "5px",
        }}
      >
        <div className="bg-neutral-950 p-6 min-h-[calc(100vh+100px)]">

          <Outlet />
        </div>
      </Box>
    </Box>
  );
}

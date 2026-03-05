import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Shield,
    User as UserIcon,
    LogOut,
    ChevronLeft,
    ChevronRight,
    LayoutDashboard,
    CheckSquare,
    Briefcase,
    Users,
    BookOpen,
    Menu,
    X,
    Zap,
    Bell
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { removeUser } from "../redux/features/user/userSlice";
import { useLazyGetTodosQuery } from "../redux/features/todo/todo.api";
import {
    useLazyGetPersonalProjectsQuery,
    useLazyGetTeamProjectsQuery
} from "../redux/features/project/project.api";

const drawerWidth = 260;
const collapsedWidth = 88;

const OtherLayoutTailwind = () => {
    const { pathname } = useLocation();
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user);

    // Data prefetching triggers
    const [triggerTodos] = useLazyGetTodosQuery(undefined);
    const [triggerPersonalProjects] = useLazyGetPersonalProjectsQuery(undefined);
    const [triggerTeamProjects] = useLazyGetTeamProjectsQuery(undefined);

    const [isOpen, setIsOpen] = useState(window.innerWidth > 1024);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 1024) {
                setIsOpen(false);
            } else {
                setIsOpen(true);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("project-m-token");
        dispatch(removeUser());
    };

    const navLinks = [
        { title: "Profile", url: "/dashboard/profile", icon: LayoutDashboard },
        { title: "Todos", url: "/dashboard/todos", icon: CheckSquare, prefetch: () => triggerTodos(undefined, true) },
        { title: "Personal Projects", url: "/dashboard/personalprojects", icon: Briefcase, prefetch: () => triggerPersonalProjects(undefined, true) },
        { title: "Team Projects", url: "/dashboard/teamprojects", icon: Users, prefetch: () => triggerTeamProjects(undefined, true) },
        { title: "Journal", url: "/dashboard/journal", icon: BookOpen },
    ];

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-200 selection:bg-blue-500/30">
            {/* Mobile Top Bar */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-neutral-950/80 backdrop-blur-xl border-b border-white/5 z-50 lg:hidden flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="p-2 hover:bg-white/5 rounded-xl text-neutral-400"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <Link to="/" className="flex items-center gap-2 font-bold text-white tracking-tight">
                        <Shield className="w-5 h-5 text-blue-500" />
                        <span>Chronova</span>
                    </Link>
                </div>

                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-neutral-900 border border-white/5 flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-neutral-500" />
                    </div>
                </div>
            </header>

            {/* Desktop Sidebar */}
            <aside
                className={`fixed left-0 top-0 bottom-0 bg-neutral-950 border-r border-white/5 z-40 transition-all duration-500 ease-in-out hidden lg:block`}
                style={{ width: isOpen ? drawerWidth : collapsedWidth }}
            >
                <div className="flex flex-col h-full p-4">
                    {/* Sidebar Logo */}
                    <div className="flex items-center justify-between h-12 mb-10 px-2">
                        <AnimatePresence mode="wait">
                            {isOpen ? (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="flex items-center gap-3"
                                >
                                    <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                                        <Shield className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="text-xl font-bold tracking-tight text-white">Chronova</span>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="w-10 h-10 bg-neutral-900 rounded-xl flex items-center justify-center mx-auto border border-white/5"
                                >
                                    <Shield className="w-5 h-5 text-blue-500" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 space-y-2 px-1">
                        {navLinks.map((link) => {
                            const isActive = pathname.includes(link.url);
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.title}
                                    to={link.url}
                                    onMouseEnter={link.prefetch}
                                    className={`
                    flex items-center h-12 rounded-2xl transition-all duration-300 group relative
                    ${isActive
                                            ? 'bg-blue-500/10 text-blue-400'
                                            : 'text-neutral-500 hover:text-white hover:bg-white/5'}
                  `}
                                >
                                    <div className={`flex items-center justify-center ${isOpen ? 'w-12 ml-1' : 'w-full'}`}>
                                        <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                                    </div>

                                    {isOpen && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="text-sm font-bold tracking-wide ml-2"
                                        >
                                            {link.title}
                                        </motion.span>
                                    )}

                                    {!isOpen && (
                                        <div className="absolute left-full ml-4 px-3 py-2 bg-neutral-900 border border-white/5 rounded-xl text-xs font-bold text-white opacity-0 whitespace-nowrap pointer-events-none group-hover:opacity-100 group-hover:ml-2 transition-all z-50">
                                            {link.title}
                                        </div>
                                    )}

                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute right-0 w-1 h-5 bg-blue-500 rounded-full mr-1 lg:mr-0"
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Section & Toggle */}
                    <div className="mt-auto space-y-4">
                        <button
                            onClick={toggleSidebar}
                            className="w-full h-10 flex items-center justify-center bg-neutral-900/50 border border-white/5 rounded-xl text-neutral-500 hover:text-white transition-all hover:bg-neutral-800"
                        >
                            {isOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                        </button>

                        <div className={`p-2 rounded-2xl border border-white/5 bg-neutral-900/20 backdrop-blur-sm transition-all overflow-hidden ${isOpen ? 'opacity-100' : 'opacity-0 h-0 p-0'}`}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center border border-white/5">
                                    <UserIcon className="w-5 h-5 text-neutral-400" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-bold text-white truncate">{user?.name}</span>
                                    <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Operator</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="ml-auto p-2 text-neutral-500 hover:text-rose-500 transition-colors"
                                    title="Sign Out"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main
                className="transition-all duration-500 ease-in-out min-h-screen flex flex-col pt-16 lg:pt-0"
                style={{ paddingLeft: window.innerWidth > 1024 ? (isOpen ? drawerWidth : collapsedWidth) : 0 }}
            >
                {/* Top Header - Unified */}
                <header className="hidden lg:flex sticky top-0 h-20 items-center justify-between px-8 bg-neutral-950/40 backdrop-blur-xl border-b border-white/5 z-30">
                    <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-500 fill-amber-500/20" />
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">System Priority: Active</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative p-2 text-neutral-500 hover:text-white transition-colors">
                            <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-500 rounded-full border border-neutral-950" />
                            <Bell className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-4 pl-6 border-l border-white/5">
                            <div className="flex flex-col items-end">
                                <span className="text-xs font-bold text-white">{user?.name}</span>
                                <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Online</span>
                            </div>
                            <div className="w-10 h-10 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-center shadow-lg group cursor-pointer hover:border-blue-500/50 transition-colors bg-gradient-to-br from-neutral-800 to-neutral-950">
                                <UserIcon className="w-5 h-5 text-neutral-400 group-hover:text-blue-400 transition-colors" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dynamic Outlet */}
                <div className="flex-1 p-6 lg:p-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent">
                    <Outlet />
                </div>
            </main>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md z-[60]"
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed left-0 top-0 bottom-0 w-4/5 max-w-sm bg-neutral-950 border-r border-white/10 z-[70] p-6 flex flex-col"
                        >
                            <div className="flex items-center justify-between mb-12">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                                        <Shield className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-xl font-bold text-white tracking-tight">Chronova</span>
                                </div>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-white/5 rounded-xl">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <nav className="space-y-4">
                                {navLinks.map((link) => {
                                    const isActive = pathname.includes(link.url);
                                    const Icon = link.icon;
                                    return (
                                        <Link
                                            key={link.title}
                                            to={link.url}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`flex items-center h-14 px-4 rounded-2xl text-lg font-bold transition-all ${isActive ? 'bg-blue-500 text-white shadow-xl shadow-blue-500/20' : 'text-neutral-500 hover:bg-white/5'}`}
                                        >
                                            <Icon className="w-6 h-6 mr-4" />
                                            {link.title}
                                        </Link>
                                    )
                                })}
                            </nav>

                            <div className="mt-auto space-y-4">
                                <div className="p-4 bg-white/5 rounded-[2rem] border border-white/5">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-2xl bg-neutral-800 flex items-center justify-center">
                                            <UserIcon className="w-6 h-6 text-neutral-500" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-white">{user?.name}</p>
                                            <p className="text-xs text-neutral-500">{user?.email}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center justify-center gap-2 h-14 bg-rose-500/10 text-rose-500 rounded-2xl font-bold hover:bg-rose-500 hover:text-white transition-all"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default OtherLayoutTailwind;

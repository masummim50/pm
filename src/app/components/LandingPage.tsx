import { motion, Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    ArrowRight,
    CheckCircle,
    Users,
    Zap,
    Layout,
    Calendar,
    Shield,
    Sparkles,
    Github,
    Twitter,
    Linkedin,
    User
} from 'lucide-react';
import { useAppSelector } from '../redux/hooks';

const LandingPage = () => {
    const user = useAppSelector((state) => state.user);
    const isLoggedIn = !!user.token;

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 20
            },
        },
    };

    const features = [
        {
            icon: <Layout className="w-6 h-6 text-blue-400" />,
            title: "Task Management",
            desc: "Intuitive todo tracking system to keep your daily work organized and focused.",
            color: "blue"
        },
        {
            icon: <Zap className="w-6 h-6 text-amber-400" />,
            title: "Lightning Performance",
            desc: "Built for speed. No more waiting for project boards to load or sync.",
            color: "amber"
        },
        {
            icon: <Users className="w-6 h-6 text-indigo-400" />,
            title: "Team Collaboration",
            desc: "Seamless communication and shared workspaces for modern remote teams.",
            color: "indigo"
        },
        {
            icon: <Calendar className="w-6 h-6 text-emerald-400" />,
            title: "Work Journals",
            desc: "Document your progress and thoughts in a dedicated journaling module.",
            color: "emerald"
        }
    ];

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-50 font-sans selection:bg-blue-500/30 selection:text-blue-200 selection:backdrop-blur-sm">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[120px] animate-pulse delay-700" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(30,58,138,0.05)_0%,transparent_70%)]" />
            </div>

            <div className="relative z-10">
                {/* Navbar */}
                <nav className="sticky top-0 w-full z-50 transition-all border-b border-neutral-800/50 bg-neutral-950/70 backdrop-blur-xl">
                    <div className="container mx-auto px-6 h-20 flex justify-between items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3"
                        >
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight">Chronova</span>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-6"
                        >
                            {isLoggedIn ? (
                                <Link to="/dashboard" className="flex items-center gap-4 group">
                                    <span className="hidden sm:block text-neutral-400 group-hover:text-white transition-colors font-medium">Dashboard</span>
                                    <div className="w-10 h-10 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center overflow-hidden group-hover:border-blue-500/50 transition-colors">
                                        <User className="w-5 h-5 text-neutral-400 group-hover:text-blue-400 transition-colors" />
                                    </div>
                                </Link>
                            ) : (
                                <>
                                    <Link to="/login" className="text-neutral-400 hover:text-white transition-colors font-medium">Log In</Link>
                                    <Link to="/signup" className="hidden sm:flex px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all shadow-lg shadow-blue-500/25 active:scale-95">
                                        Start for Free
                                    </Link>
                                </>
                            )}
                        </motion.div>
                    </div>
                </nav>

                {/* Hero Section */}
                <header className="container mx-auto px-6 pt-24 pb-32 text-center lg:text-left flex flex-col lg:flex-row items-center gap-16">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex-1 max-w-2xl"
                    >
                        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-8">
                            <Sparkles className="w-4 h-4" />
                            <span>V2.0 is now live</span>
                        </motion.div>

                        <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[1.1]">
                            Manage projects with <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400">radical clarity</span>.
                        </motion.h1>

                        <motion.p variants={itemVariants} className="text-xl text-neutral-400 mb-12 flex flex-col gap-2">
                            <span>Chronova brings your team's tasks, projects, and journals together</span>
                            <span>in one beautiful workspace. Stop jumping between fragmented tools.</span>
                        </motion.p>

                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4">
                            <Link to={isLoggedIn ? "/dashboard" : "/signup"} className="group w-full sm:w-auto px-8 py-4 rounded-full bg-neutral-50 text-neutral-950 font-bold text-lg hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-xl shadow-white/5">
                                {isLoggedIn ? "Go to Dashboard" : "Sign Up Now"}
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            {!isLoggedIn && (
                                <Link to="/login" className="w-full sm:w-auto px-8 py-4 rounded-full border border-neutral-800 hover:bg-neutral-900 text-neutral-300 font-bold text-lg transition-all text-center">
                                    View Demo
                                </Link>
                            )}
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
                        className="flex-1 relative"
                    >
                        <div className="relative rounded-3xl border border-white/10 overflow-hidden shadow-2xl shadow-blue-500/10 bg-neutral-900">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent pointer-events-none" />
                            <div className="h-12 bg-neutral-800/50 border-b border-white/5 flex items-center px-4 gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                            </div>
                            <div className="p-4 sm:p-8 aspect-video flex flex-col justify-center">
                                <div className="space-y-4">
                                    <div className="h-4 w-3/4 bg-neutral-800 rounded animate-pulse" />
                                    <div className="h-4 w-1/2 bg-neutral-800 rounded animate-pulse delay-75" />
                                    <div className="h-4 w-2/3 bg-neutral-800 rounded animate-pulse delay-150" />
                                    <div className="grid grid-cols-3 gap-3 mt-8">
                                        <div className="h-24 bg-neutral-800/50 border border-white/5 rounded-xl" />
                                        <div className="h-24 bg-neutral-800/50 border border-white/5 rounded-xl" />
                                        <div className="h-24 bg-neutral-800/50 border border-white/5 rounded-xl" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Floating Badge */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -bottom-6 -right-6 bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-xl p-4 rounded-2xl hidden md:block"
                        >
                            <div className="flex items-center gap-3">
                                <div className="bg-emerald-500 rounded-full p-1">
                                    <CheckCircle className="w-4 h-4 text-neutral-950" />
                                </div>
                                <span className="text-emerald-400 font-bold text-sm leading-tight">Project Completed<br /><span className="text-neutral-400 font-normal">2 minutes ago</span></span>
                            </div>
                        </motion.div>
                    </motion.div>
                </header>

                {/* Social Proof */}
                <section className="py-20 border-y border-neutral-900 bg-neutral-950/50">
                    <div className="container mx-auto px-6 text-center">
                        <p className="text-neutral-500 font-semibold tracking-wider uppercase text-xs mb-10">Trusted by modern teams globally</p>
                        <div className="flex flex-wrap justify-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
                            <span className="text-2xl font-black">LINEAR</span>
                            <span className="text-2xl font-black tracking-tighter">FIGMA</span>
                            <span className="text-2xl font-black italic">Notion</span>
                            <span className="text-2xl font-black">FRAME</span>
                            <span className="text-2xl font-black">RAYCAST</span>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-32 relative">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-24 max-w-3xl mx-auto">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-4xl md:text-5xl font-bold mb-6"
                            >
                                Built for the way you work.
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="text-neutral-400 text-lg"
                            >
                                We've obsessed over every detail to create the most fluid project management experience imaginable.
                            </motion.p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {features.map((feature, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="group p-8 rounded-3xl bg-neutral-900 border border-neutral-800/50 hover:border-neutral-700 transition-all hover:bg-neutral-800/50"
                                >
                                    <div className="w-12 h-12 bg-neutral-950 rounded-2xl flex items-center justify-center mb-8 border border-neutral-800 shadow-inner group-hover:scale-110 transition-transform">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                                    <p className="text-neutral-400 leading-relaxed">{feature.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-32 px-6">
                    <div className="container mx-auto max-w-5xl rounded-[3rem] bg-gradient-to-br from-blue-600 to-indigo-700 p-12 md:p-24 relative overflow-hidden text-center">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)]" />
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-6xl font-black text-white mb-8">Ready to move faster?</h2>
                            <p className="text-blue-100 text-xl mb-12 max-w-2xl mx-auto">Join thousands of teams shipping better work with Chronova. Get started today for free.</p>
                            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                                <Link to="/signup" className="w-full sm:w-auto px-10 py-5 rounded-full bg-white text-blue-600 font-black text-lg hover:scale-105 transition-transform shadow-2xl active:scale-95">
                                    Get Chronova Free
                                </Link>
                                <span className="text-blue-200/50 text-sm font-semibold">No credit card required.</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="container mx-auto px-6 pt-24 pb-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 border-t border-neutral-900 pt-16 mb-16">
                        <div className="col-span-2">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold tracking-tight">Chronova</span>
                            </div>
                            <p className="text-neutral-500 max-w-xs mb-8">
                                Building the future of project management, one pixel at a time.
                            </p>
                            <div className="flex gap-4">
                                <Twitter className="w-5 h-5 text-neutral-600 hover:text-white cursor-pointer transition-colors" />
                                <Github className="w-5 h-5 text-neutral-600 hover:text-white cursor-pointer transition-colors" />
                                <Linkedin className="w-5 h-5 text-neutral-600 hover:text-white cursor-pointer transition-colors" />
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-300 mb-6">Product</h4>
                            <ul className="space-y-4 text-neutral-500">
                                <li className="hover:text-neutral-300 cursor-pointer transition-colors">Features</li>
                                <li className="hover:text-neutral-300 cursor-pointer transition-colors">Security</li>
                                <li className="hover:text-neutral-300 cursor-pointer transition-colors">Pricing</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-300 mb-6">Company</h4>
                            <ul className="space-y-4 text-neutral-500">
                                <li className="hover:text-neutral-300 cursor-pointer transition-colors">About</li>
                                <li className="hover:text-neutral-300 cursor-pointer transition-colors">Blog</li>
                                <li className="hover:text-neutral-300 cursor-pointer transition-colors">Careers</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-300 mb-6">Legal</h4>
                            <ul className="space-y-4 text-neutral-500">
                                <li className="hover:text-neutral-300 cursor-pointer transition-colors">Privacy</li>
                                <li className="hover:text-neutral-300 cursor-pointer transition-colors">Terms</li>
                                <li className="hover:text-neutral-300 cursor-pointer transition-colors">Cookies</li>
                            </ul>
                        </div>
                    </div>
                    <div className="text-neutral-600 text-sm text-center md:text-left">
                        © {new Date().getFullYear()} Chronova Inc. All rights reserved.
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default LandingPage;


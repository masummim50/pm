import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { Shield } from 'lucide-react';

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    subtitle?: string;
}

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-50 flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[120px] animate-pulse delay-700" />
            </div>

            <div className="relative z-10 w-full max-w-md">
                <div className="flex flex-col items-center mb-8">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/20 mb-4"
                    >
                        <Shield className="w-10 h-10 text-white" />
                    </motion.div>
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl font-black tracking-tight"
                    >
                        {title}
                    </motion.h1>
                    {subtitle && (
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-neutral-400 mt-2 text-center"
                        >
                            {subtitle}
                        </motion.p>
                    )}
                </div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 p-8 rounded-[2.5rem] shadow-2xl"
                >
                    {children}
                </motion.div>
            </div>
        </div>
    );
};

export default AuthLayout;

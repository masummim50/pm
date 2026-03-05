/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useNavigate } from "react-router-dom";
import { useSignUpMutation } from "../../redux/features/user/userApi";
import { useState, useEffect } from "react";
import useDocumentTitle from "../../../UseDocumentTitle";
import AuthLayout from "./AuthLayout";
import { Loader2, ArrowRight } from "lucide-react";

const SignUpTailwind = () => {
    useDocumentTitle({ title: 'Sign Up' });
    const navigate = useNavigate();

    const [signUp, { isLoading, isSuccess, error }] = useSignUpMutation();

    const [signupdata, setSignupdata] = useState({
        name: "",
        email: "",
        password: "",
        isGmail: false,
    });

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        await signUp(signupdata);
        if (error) {
            console.log("sign up error:", error);
        }
    };

    const [showDuplicateError, setShowDuplicateError] = useState(false);

    useEffect(() => {
        if (error && "status" in error) {
            if (error?.status === 409) {
                setShowDuplicateError(true);
                setTimeout(() => {
                    setShowDuplicateError(false);
                }, 1500);
            }
        }
    }, [error]);

    useEffect(() => {
        if (isSuccess) {
            navigate("/");
        }
    }, [isSuccess, navigate]);

    function emailIsValid(email: string): boolean {
        if (email === "") return true;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    const [showError, setShowError] = useState(false);

    const allDataValid = () => {
        return (
            signupdata.name &&
            signupdata.password &&
            emailIsValid(signupdata.email) &&
            signupdata.email !== ""
        );
    };

    return (
        <AuthLayout title="Get Started" subtitle="Join Chronova to streamline your productivity today.">
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-neutral-400 ml-1">Full Name</label>
                    <input
                        type="text"
                        required
                        value={signupdata.name}
                        placeholder="John Doe"
                        onChange={(e) =>
                            setSignupdata((data) => ({ ...data, name: e.target.value }))
                        }
                        className="w-full bg-neutral-950/50 border border-neutral-800 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50 transition-all placeholder:text-neutral-600"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-neutral-400 ml-1">Email Address</label>
                    <input
                        type="email"
                        required
                        value={signupdata.email}
                        placeholder="john@example.com"
                        onChange={(e) => {
                            setShowError(!emailIsValid(e.target.value));
                            setSignupdata((data) => ({ ...data, email: e.target.value }));
                        }}
                        className={`w-full bg-neutral-950/50 border ${showError ? 'border-red-500/50 focus:ring-red-500/40' : 'border-neutral-800 focus:ring-blue-500/40'} rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 transition-all placeholder:text-neutral-600`}
                    />
                    {showError && <p className="text-xs text-red-500 ml-1">Please enter a valid email address.</p>}
                </div>

                {showDuplicateError && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm py-3 px-4 rounded-xl">
                        This email address already exists.
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-neutral-400 ml-1">Password</label>
                    <input
                        type="password"
                        required
                        value={signupdata.password}
                        placeholder="••••••••"
                        onChange={(e) =>
                            setSignupdata((data) => ({ ...data, password: e.target.value }))
                        }
                        className="w-full bg-neutral-950/50 border border-neutral-800 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50 transition-all placeholder:text-neutral-600"
                    />
                </div>

                <button
                    disabled={!allDataValid() || isLoading}
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 group active:scale-[0.98]"
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            Create Account
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>

                {isSuccess && (
                    <div className="text-center py-2 text-emerald-400 font-bold animate-pulse">
                        Signup Successful! Redirecting...
                    </div>
                )}
            </form>

            <div className="mt-10 text-center">
                <p className="text-neutral-500">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-500 hover:text-blue-400 font-bold ml-1 transition-colors">
                        Log In
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
};

export default SignUpTailwind;

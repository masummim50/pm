/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import { Controller, useForm } from "react-hook-form";
import {
    useSignInMutation,
    useSignInWithGmailMutation,
} from "../../redux/features/user/userApi";
import { setUser } from "../../redux/features/user/userSlice";
import { jwtDecode } from "jwt-decode";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { firebaseConfig } from "../../../firebase/firebaseConfig";
import { initializeApp } from "firebase/app";
import useDocumentTitle from "../../../UseDocumentTitle";
import AuthLayout from "./AuthLayout";
import {
    Chrome,
    Github,
    Twitter,
    Facebook,
    Loader2,
    ArrowRight,
    UserCheck
} from "lucide-react";

type signInError = {
    data: {
        message: string;
    };
};

const LoginTailwind = () => {
    useDocumentTitle({ title: "Log In" });

    const dispatch = useAppDispatch();
    const [signin, { data: logindata, isLoading, isSuccess, error }] =
        useSignInMutation();
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        if (error) {
            setShowError(true);
            setTimeout(() => {
                setShowError(false);
            }, 3000);
        }
    }, [error]);

    const [
        signInWithGmail,
        { data: gmailLoginData, isSuccess: gmailLoginSuccess },
    ] = useSignInWithGmailMutation();
    const navigate = useNavigate();

    const { handleSubmit, control, setValue } = useForm();

    const signinFunction = (data: any) => {
        signin(data);
    };

    useEffect(() => {
        if (isSuccess) {
            localStorage.setItem("project-m-token", logindata.token);
            dispatch(
                setUser({
                    id: logindata.data.id,
                    name: logindata.data.name,
                    email: logindata.data.email,
                    token: logindata.token,
                })
            );
            navigate("/dashboard");
        }
        if (gmailLoginSuccess) {
            const decoded: { _id: string; name: string; email: string } = jwtDecode(
                gmailLoginData.token
            );
            localStorage.setItem("project-m-token", gmailLoginData.token);
            dispatch(
                setUser({
                    id: decoded?._id,
                    name: decoded?.name,
                    email: decoded?.email,
                    token: gmailLoginData.token,
                })
            );
            navigate("/dashboard");
        }
    }, [isSuccess, gmailLoginSuccess]);

    const googleAuthProvider = new GoogleAuthProvider();
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    const handleGoogleSignIn = async () => {
        signInWithPopup(auth, googleAuthProvider)
            .then((result) => {
                const data = {
                    email: result?.user?.email,
                    name: result?.user?.displayName,
                    isGmail: true,
                };
                signInWithGmail(data);
            })
            .catch((error) => {
                console.log("sign in with google error: ", error);
            });
    };

    const handleTestingAccountSignIn = () => {
        setValue('email', 'johndoe@gmail.com');
        setValue('password', '1234');
    };

    return (
        <AuthLayout title="Welcome back" subtitle="Please enter your credentials to log in.">
            <div className="mb-8 flex justify-end">
                <button
                    onClick={handleTestingAccountSignIn}
                    className="text-xs font-bold uppercase tracking-wider text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-2 bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20"
                >
                    <UserCheck className="w-3 h-3" />
                    Use Test Account
                </button>
            </div>

            <form onSubmit={handleSubmit((data) => signinFunction(data))} className="space-y-5">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-neutral-400 ml-1">Email</label>
                    <Controller
                        control={control}
                        name="email"
                        defaultValue=""
                        render={({ field: { onChange, value } }) => (
                            <input
                                type="email"
                                onChange={onChange}
                                value={value}
                                required
                                placeholder="you@example.com"
                                className="w-full bg-neutral-950/50 border border-neutral-800 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50 transition-all placeholder:text-neutral-600"
                            />
                        )}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-neutral-400 ml-1">Password</label>
                    <Controller
                        control={control}
                        name="password"
                        defaultValue=""
                        render={({ field: { onChange, value } }) => (
                            <input
                                type="password"
                                onChange={onChange}
                                value={value}
                                required
                                placeholder="••••••••"
                                className="w-full bg-neutral-950/50 border border-neutral-800 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50 transition-all placeholder:text-neutral-600"
                            />
                        )}
                    />
                </div>

                {showError && error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm py-3 px-4 rounded-xl animate-shake">
                        {"data" in error ? (error as signInError).data?.message : "Invalid email or password"}
                    </div>
                )}

                <button
                    disabled={isLoading}
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 group active:scale-[0.98]"
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            Sign In
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-8 flex items-center gap-4">
                <div className="h-[1px] flex-1 bg-neutral-800" />
                <span className="text-neutral-600 font-bold text-xs uppercase tracking-widest">Or continue with</span>
                <div className="h-[1px] flex-1 bg-neutral-800" />
            </div>

            <div className="mt-8 grid grid-cols-4 gap-4">
                <button
                    onClick={handleGoogleSignIn}
                    className="flex items-center justify-center p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 hover:bg-neutral-800 transition-colors group"
                >
                    <Chrome className="w-5 h-5 text-neutral-400 group-hover:text-blue-400" />
                </button>
                <button className="flex items-center justify-center p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 hover:bg-neutral-800 transition-colors group">
                    <Facebook className="w-5 h-5 text-neutral-400 group-hover:text-blue-600" />
                </button>
                <button className="flex items-center justify-center p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 hover:bg-neutral-800 transition-colors group">
                    <Github className="w-5 h-5 text-neutral-400 group-hover:text-white" />
                </button>
                <button className="flex items-center justify-center p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 hover:bg-neutral-800 transition-colors group">
                    <Twitter className="w-5 h-5 text-neutral-400 group-hover:text-sky-400" />
                </button>
            </div>

            <div className="mt-10 text-center">
                <p className="text-neutral-500">
                    New to Chronova?{" "}
                    <Link to="/signup" className="text-blue-500 hover:text-blue-400 font-bold ml-1 transition-colors">
                        Create an account
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
};

export default LoginTailwind;

import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    CreditCard,
    Eye,
    EyeOff,
    Loader2,
    UserPlus,
} from "lucide-react";
import { Form, useActionData, useNavigation } from "react-router";
const Register = () => {
    const navigate = useNavigate();

    const TOAST_ID = "register-toast";

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const actionData = useActionData();
    const navigation = useNavigation();

    const loading =
        navigation.state === "submitting" ||
        navigation.state === "loading";
    const [showPassword, setShowPassword] = useState(false);

    const notify = ({ message, type }) => {
        const safeMessage =
            typeof message === "string" ? message : "Something went wrong.";

        if (toast.isActive(TOAST_ID)) {
            toast.update(TOAST_ID, {
                render: safeMessage,
                type,
                isLoading: type === "info",
                autoClose: type === "info" ? false : 3000,
            });
        } else {
            toast(safeMessage, {
                toastId: TOAST_ID,
                type,
                isLoading: type === "info",
                autoClose: type === "info" ? false : 3000,
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const userData = {
            ...formData,
        };

        notify({
            message: "Creating An account....!",
            type: "info",
        });

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/v1/register/",
                userData
            );

            setFormData({
                username: "",
                email: "",
                password: "",
            });

            if (response?.status === 201) {
                const successMessage = response?.data?.message;

                notify({
                    message: successMessage || "Registration Success!",
                    type: "success",
                });

                navigate("/login");
            }
        } catch (error) {
            console.error("Error registering:", error?.response?.data?.message);

            const errorData = error?.response?.data;

            let errMessage = "Registration failed.";

            if (typeof errorData?.message === "string") {
                errMessage = errorData.message;
            } else if (Array.isArray(errorData?.message)) {
                errMessage = errorData.message[0];
            } else if (typeof errorData?.detail === "string") {
                errMessage = errorData.detail;
            } else {
                const firstField = Object.keys(errorData || {})[0];

                if (firstField && Array.isArray(errorData[firstField])) {
                    errMessage = errorData[firstField][0];
                }
            }

            notify({
                message: errMessage,
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-full bg-slate-100 flex items-center justify-center overflow-hidden">
            <div className="w-full max-w-5xl h-full max-h-[92vh] bg-white shadow-2xl rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
                {/* Left Section - Card Wise Brand */}
                <div className="relative hidden lg:block">
                    <img
                        src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80"
                        alt="Credit card management"
                        className="absolute inset-0 h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-br from-[#111827] via-[#1F2937] to-[#065F46]/90" />

                    <div className="relative z-10 flex h-full flex-col justify-between p-10 text-white">
                        {/* Brand */}
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/20 backdrop-blur">
                                <CreditCard className="h-6 w-6 text-emerald-400" />
                            </div>

                            <div>
                                <p className="text-lg font-semibold">Card Wise</p>
                                <p className="text-sm text-white/70">
                                    Smart credit card management
                                </p>
                            </div>
                        </div>

                        {/* Main Message */}
                        <div>
                            <h1 className="text-4xl font-bold leading-tight">
                                Take control of your credit cards
                            </h1>

                            <p className="mt-4 max-w-sm text-white/80">
                                Track dues, manage limits, and spend wisely with complete clarity.
                            </p>

                            {/* Simple Card Preview */}
                            <div className="mt-8 w-full max-w-xs rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs uppercase tracking-wide text-white/60">
                                        Safe to spend
                                    </p>

                                    <div className="rounded-lg bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300">
                                        Healthy
                                    </div>
                                </div>

                                <p className="mt-2 text-3xl font-bold">₹18,400</p>

                                <div className="mt-4">
                                    <div className="flex items-center justify-between text-xs text-white/70">
                                        <span>Limit used</span>
                                        <span>32%</span>
                                    </div>

                                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/20">
                                        <div className="h-full w-[32%] rounded-full bg-emerald-400" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Tagline */}
                        <p className="text-sm text-white/70">
                            Built for smarter, stress-free financial planning.
                        </p>
                    </div>
                </div>

                {/* Right Section - Register Form */}
                <div className="flex items-center justify-center bg-white px-6 py-8 sm:px-10 lg:px-12 overflow-y-auto">
                    <div className="w-full max-w-md">
                        {/* Mobile Brand */}
                        <div className="mb-5 flex items-center gap-2 lg:hidden">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white">
                                <CreditCard className="h-6 w-6" />
                            </div>

                            <div>
                                <p className="text-lg font-semibold text-slate-900">Card Wise</p>
                                <p className="text-sm text-slate-500">
                                    Smart credit card management
                                </p>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold text-slate-900">Register</h2>

                        <p className="mt-2 text-sm text-slate-500">
                            Create your account to get started.
                        </p>

                        <Form method="post" className="mt-6 space-y-4">
                            <input
                                type="text"
                                name="username"
                                placeholder="Enter your username"
                                disabled={loading}
                                autoComplete="username"
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                            />

                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                disabled={loading}
                                autoComplete="email"
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                            />

                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter your password"
                                disabled={loading}
                                autoComplete="new-password"
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                            />

                            {actionData?.error && (
                                <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">
                                    {actionData.error}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Creating account...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="h-4 w-4" />
                                        Register
                                    </>
                                )}
                            </button>
                        </Form>

                        {/* Divider */}
                        <div className="my-6 flex items-center gap-4">
                            <span className="h-px flex-1 bg-slate-200" />
                            <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                or
                            </span>
                            <span className="h-px flex-1 bg-slate-200" />
                        </div>

                        {/* Login Link */}
                        <p className="text-center text-sm text-slate-600">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="font-semibold text-emerald-600 transition hover:text-emerald-700"
                            >
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnHover
            />
        </div>
    );
};

export default Register;
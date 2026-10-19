import React from "react";
import { useNavigate } from "react-router-dom";
import {
    X,
    Wallet,
    CalendarClock,
    Target,
    ShieldCheck,
    TrendingUp,
} from "lucide-react";

const FinancialProfileModal = ({ open, onClose }) => {
    const navigate = useNavigate();

    if (!open) return null;

    const benefits = [
        {
            icon: Wallet,
            title: "Know your safe spending limit",
            description:
                "We calculate how much you can safely spend after salary, commitments, and savings.",
        },
        {
            icon: CalendarClock,
            title: "Plan bills before due dates",
            description:
                "Get better visibility into upcoming credit-card dues and monthly commitments.",
        },
        {
            icon: Target,
            title: "Set category-wise limits",
            description:
                "Control spending across groceries, fuel, shopping, food, and more.",
        },
        {
            icon: TrendingUp,
            title: "Avoid overspending",
            description:
                "Track your monthly spending against your income and planned savings.",
        },
    ];

    const handleCompleteNow = () => {
        onClose();
        navigate("/profile/financial");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-xl overflow-auto rounded-2xl bg-white shadow-2xl ">
                {/* Header */}
                <div className="relative bg-gradient-to-br from-[#111827] via-[#1F2937] to-[#065F46] px-6 py-6 text-white">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 rounded-lg p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                        aria-label="Close modal"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/20">
                            <ShieldCheck className="h-6 w-6 text-emerald-400" />
                        </div>

                        <div>
                            <h2 className="text-lg font-bold">
                                Financial Profile is pending
                            </h2>
                            <p className="text-sm text-white/70">
                                Complete it to unlock smarter spending insights.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="px-6 py-6 max-h-[65vh] overflow-auto">
                    <p className="text-sm text-slate-600">
                        Your Financial Profile helps Card Wise understand your income,
                        savings, and monthly commitments. With this information, the app
                        can guide you before you overspend.
                    </p>

                    <div className="mt-5 space-y-4">
                        {benefits.map((benefit) => {
                            const Icon = benefit.icon;

                            return (
                                <div
                                    key={benefit.title}
                                    className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4"
                                >
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
                                        <Icon className="h-4 w-4 text-emerald-600" />
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">
                                            {benefit.title}
                                        </p>
                                        <p className="mt-1 text-sm text-slate-600">
                                            {benefit.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex flex-col-reverse gap-3 border-t border-slate-100 px-6 py-5 sm:flex-row sm:justify-end">
                    <button
                        onClick={onClose}
                        className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                        Later
                    </button>

                    <button
                        onClick={handleCompleteNow}
                        className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
                    >
                        Complete now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FinancialProfileModal;
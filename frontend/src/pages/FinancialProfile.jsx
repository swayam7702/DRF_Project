import React, { useEffect, useState } from "react";
import api from "../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    Wallet,
    Pencil,
    X,
    Loader2,
    Save,
    IndianRupee,
    CalendarClock,
    PiggyBank,
    ShieldCheck,
    Plus,
} from "lucide-react";

const currencies = ["INR", "USD", "EUR", "GBP"];

const timezones = [
    "Asia/Kolkata",
    "UTC",
    "America/New_York",
    "Europe/London",
    "Asia/Dubai",
    "Asia/Singapore",
];

const FinancialProfile = () => {
    const [formData, setFormData] = useState({
        monthly_income: "",
        salary_day: "",
        currency: "INR",
        timezone: "Asia/Kolkata",
        planned_monthly_savings: "",
        protected_cash_buffer: "",
    });

    const [profileId, setProfileId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState({});
    const [profileExists, setProfileExists] = useState(false);

    const fetchFinancialProfile = async () => {
        setLoading(true);

        try {
            const res = await api.get("financial-profile/");

            const profileData = res.data.data;

            setProfileExists(true);
            setProfileId(profileData.id);

            setFormData({
                monthly_income: profileData.monthly_income ?? "",
                salary_day: profileData.salary_day ?? "",
                currency: profileData.currency ?? "INR",
                timezone: profileData.timezone ?? "Asia/Kolkata",
                planned_monthly_savings:
                    profileData.planned_monthly_savings ?? "",
                protected_cash_buffer:
                    profileData.protected_cash_buffer ?? "",
            });
        } catch (error) {
            console.error(error);

            if (error?.response?.status === 404) {
                setProfileExists(false);
            } else {
                toast.error("Failed to load financial profile.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFinancialProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const handleCancel = () => {
        setIsEditing(false);
        setErrors({});
        fetchFinancialProfile();
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.monthly_income) {
            newErrors.monthly_income = "Monthly income is required.";
        }

        if (!formData.salary_day) {
            newErrors.salary_day = "Salary day is required.";
        } else if (
            Number(formData.salary_day) < 1 ||
            Number(formData.salary_day) > 31
        ) {
            newErrors.salary_day = "Salary day must be between 1 and 31.";
        }

        if (!formData.planned_monthly_savings) {
            newErrors.planned_monthly_savings =
                "Planned monthly savings is required.";
        }

        if (
            Number(formData.planned_monthly_savings) >
            Number(formData.monthly_income)
        ) {
            newErrors.planned_monthly_savings =
                "Planned savings cannot be more than monthly income.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setUpdating(true);

        const payload = {
            monthly_income: formData.monthly_income,
            salary_day: formData.salary_day,
            currency: formData.currency,
            timezone: formData.timezone,
            planned_monthly_savings: formData.planned_monthly_savings,
            protected_cash_buffer: formData.protected_cash_buffer,
        };

        try {
            const res = await api.patch("financial-profile/", payload);

            const updatedData = res.data.data;

            setFormData({
                monthly_income: updatedData.monthly_income ?? "",
                salary_day: updatedData.salary_day ?? "",
                currency: updatedData.currency ?? "INR",
                timezone: updatedData.timezone ?? "Asia/Kolkata",
                planned_monthly_savings:
                    updatedData.planned_monthly_savings ?? "",
                protected_cash_buffer:
                    updatedData.protected_cash_buffer ?? "",
            });

            toast.success(res.data.message || "Financial profile updated successfully.");
            setIsEditing(false);
        } catch (error) {
            console.error(error);

            const errorData = error?.response?.data;

            let errorMessage =
                errorData?.message || "Failed to update financial profile.";

            if (errorData?.errors) {
                const firstField = Object.keys(errorData.errors)[0];

                if (firstField) {
                    const fieldError = errorData.errors[firstField];

                    errorMessage = Array.isArray(fieldError)
                        ? fieldError[0]
                        : fieldError;

                    setErrors((prev) => ({
                        ...prev,
                        [firstField]: errorMessage,
                    }));
                }
            }

            toast.error(errorMessage);
        } finally {
            setUpdating(false);
        }
    };
    const handleCreate = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setUpdating(true);

        const payload = {
            monthly_income: formData.monthly_income,
            salary_day: formData.salary_day,
            currency: formData.currency,
            timezone: formData.timezone,
            planned_monthly_savings: formData.planned_monthly_savings,
            protected_cash_buffer: formData.protected_cash_buffer,
        };

        try {
            const res = await api.post("financial-profile/", payload);

            const createdData = res.data.data;

            setProfileExists(true);
            setProfileId(createdData.id);

            setFormData({
                monthly_income: createdData.monthly_income ?? "",
                salary_day: createdData.salary_day ?? "",
                currency: createdData.currency ?? "INR",
                timezone: createdData.timezone ?? "Asia/Kolkata",
                planned_monthly_savings:
                    createdData.planned_monthly_savings ?? "",
                protected_cash_buffer:
                    createdData.protected_cash_buffer ?? "",
            });

            toast.success(
                res.data.message || "Financial profile created successfully."
            );

            setIsEditing(false);
        } catch (error) {
            console.error(error);

            const errorData = error?.response?.data;

            let errorMessage =
                errorData?.message || "Failed to create financial profile.";

            if (errorData?.errors) {
                const firstField = Object.keys(errorData.errors)[0];

                if (firstField) {
                    const fieldError = errorData.errors[firstField];

                    errorMessage = Array.isArray(fieldError)
                        ? fieldError[0]
                        : fieldError;

                    setErrors((prev) => ({
                        ...prev,
                        [firstField]: errorMessage,
                    }));
                }
            }

            toast.error(errorMessage);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[300px] items-center justify-center">
                <div className="flex items-center gap-3 text-slate-600">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Loading financial profile...
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100">
                        <Wallet className="h-5 w-5 text-emerald-600" />
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            Financial Profile
                        </h2>
                        <p className="text-sm text-slate-500">
                            Manage your income, savings, and planning preferences.
                        </p>
                    </div>
                </div>

                {/* {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                        <Pencil className="h-4 w-4" />
                        Edit
                    </button>
                )} */}
            </div>

            {/* Form */}
            <form
                onSubmit={profileExists ? handleSubmit : handleCreate}
                className="space-y-5 px-6 py-6"
            >
                {/* Income and Salary Day */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                        <label
                            htmlFor="monthly_income"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Monthly Income
                        </label>

                        <div className="relative">
                            <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                            <input
                                id="monthly_income"
                                type="number"
                                name="monthly_income"
                                placeholder="Enter monthly income"
                                value={formData.monthly_income}
                                onChange={handleChange}
                                disabled={(profileExists && !isEditing) || updating}
                                className={`w-full rounded-xl border bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:bg-white disabled:cursor-not-allowed disabled:opacity-70 ${errors.monthly_income
                                    ? "border-rose-500"
                                    : "border-slate-300 focus:border-emerald-500"
                                    }`}
                            />
                        </div>

                        {errors.monthly_income && (
                            <p className="mt-2 text-sm text-rose-600">
                                {errors.monthly_income}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="salary_day"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Salary Day
                        </label>

                        <div className="relative">
                            <CalendarClock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                            <input
                                id="salary_day"
                                type="number"
                                min="1"
                                max="31"
                                name="salary_day"
                                placeholder="Enter salary day"
                                value={formData.salary_day}
                                onChange={handleChange}
                                disabled={(profileExists && !isEditing) || updating}
                                className={`w-full rounded-xl border bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:bg-white disabled:cursor-not-allowed disabled:opacity-70 ${errors.salary_day
                                    ? "border-rose-500"
                                    : "border-slate-300 focus:border-emerald-500"
                                    }`}
                            />
                        </div>

                        {errors.salary_day && (
                            <p className="mt-2 text-sm text-rose-600">
                                {errors.salary_day}
                            </p>
                        )}
                    </div>
                </div>

                {/* Currency and Timezone */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                        <label
                            htmlFor="currency"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Currency
                        </label>

                        <select
                            id="currency"
                            name="currency"
                            value={formData.currency}
                            onChange={handleChange}
                            disabled={(profileExists && !isEditing) || updating}
                            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {currencies.map((currency) => (
                                <option key={currency} value={currency}>
                                    {currency}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="timezone"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Timezone
                        </label>

                        <select
                            id="timezone"
                            name="timezone"
                            value={formData.timezone}
                            onChange={handleChange}
                            disabled={(profileExists && !isEditing) || updating}
                            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {timezones.map((timezone) => (
                                <option key={timezone} value={timezone}>
                                    {timezone}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Savings and Buffer */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                        <label
                            htmlFor="planned_monthly_savings"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Planned Monthly Savings
                        </label>

                        <div className="relative">
                            <PiggyBank className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                            <input
                                id="planned_monthly_savings"
                                type="number"
                                name="planned_monthly_savings"
                                placeholder="Enter planned savings"
                                value={formData.planned_monthly_savings}
                                onChange={handleChange}
                                disabled={(profileExists && !isEditing) || updating}
                                className={`w-full rounded-xl border bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:bg-white disabled:cursor-not-allowed disabled:opacity-70 ${errors.planned_monthly_savings
                                    ? "border-rose-500"
                                    : "border-slate-300 focus:border-emerald-500"
                                    }`}
                            />
                        </div>

                        {errors.planned_monthly_savings && (
                            <p className="mt-2 text-sm text-rose-600">
                                {errors.planned_monthly_savings}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="protected_cash_buffer"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Protected Cash Buffer
                        </label>

                        <div className="relative">
                            <ShieldCheck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                            <input
                                id="protected_cash_buffer"
                                type="number"
                                name="protected_cash_buffer"
                                placeholder="Enter protected cash buffer"
                                value={formData.protected_cash_buffer}
                                onChange={handleChange}
                                disabled={(profileExists && !isEditing) || updating}
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white disabled:cursor-not-allowed disabled:opacity-70"
                            />
                        </div>

                        <p className="mt-2 text-xs text-slate-500">
                            This amount will be protected from spending suggestions.
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-2">
                    {!profileExists && (
                        <button
                            type="submit"
                            disabled={updating}
                            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {updating ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Plus className="h-4 w-4" />
                                    Create Financial Profile
                                </>
                            )}
                        </button>
                    )}

                    {profileExists && !isEditing && (
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                            <Pencil className="h-4 w-4" />
                            Edit
                        </button>
                    )}

                    {profileExists && isEditing && (
                        <>
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={updating}
                                className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <X className="h-4 w-4" />
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={updating}
                                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {updating ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </>
                    )}
                </div>
            </form>

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

export default FinancialProfile;
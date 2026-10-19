import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  ArrowLeft,
  CreditCard,
  Loader2,
  Save,
  Landmark,
  Hash,
  IndianRupee,
} from "lucide-react";

const AddCard = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    bank_name: "",
    card_name: "",
    last_four_digits: "",
    credit_limit: "",
    current_outstanding: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.bank_name.trim()) {
      newErrors.bank_name = "Bank name is required.";
    }

    if (!formData.last_four_digits) {
      newErrors.last_four_digits = "Last four digits are required.";
    } else if (!/^\d{4}$/.test(formData.last_four_digits)) {
      newErrors.last_four_digits = "Enter exactly 4 digits.";
    }

    if (!formData.credit_limit) {
      newErrors.credit_limit = "Credit limit is required.";
    } else if (Number(formData.credit_limit) <= 0) {
      newErrors.credit_limit = "Credit limit must be greater than 0.";
    }

    if (
      formData.current_outstanding &&
      Number(formData.current_outstanding) < 0
    ) {
      newErrors.current_outstanding =
        "Outstanding amount cannot be negative.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const payload = {
      bank_name: formData.bank_name.trim(),
      card_name: formData.card_name.trim(),
      last_four_digits: formData.last_four_digits,
      credit_limit: formData.credit_limit,
      current_outstanding: formData.current_outstanding || 0,
    };

    try {
      const res = await api.post("cards/", payload);

      toast.success(res.data.message || "Card added successfully.");

      navigate(`/cards/${res.data.data.id}`);
    } catch (error) {
      console.error(error);

      const errorData = error?.response?.data;

      let errorMessage = errorData?.message || "Failed to add card.";

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
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#F9FAFB]">
      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        {/* Back */}
        <Link
          to="/cards"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-emerald-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to cards
        </Link>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Header */}
          <div className="border-b border-slate-100 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100">
                <CreditCard className="h-5 w-5 text-emerald-600" />
              </div>

              <div>
                <h1 className="text-lg font-semibold text-slate-900">
                  Add New Card
                </h1>
                <p className="text-sm text-slate-500">
                  Add a credit card to track its limit and spending.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
            <div>
              <label
                htmlFor="bank_name"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Bank Name
              </label>

              <div className="relative">
                <Landmark className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  id="bank_name"
                  type="text"
                  name="bank_name"
                  placeholder="Enter bank name"
                  value={formData.bank_name}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full rounded-xl border bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:bg-white disabled:cursor-not-allowed disabled:opacity-70 ${
                    errors.bank_name
                      ? "border-rose-500"
                      : "border-slate-300 focus:border-emerald-500"
                  }`}
                />
              </div>

              {errors.bank_name && (
                <p className="mt-2 text-sm text-rose-600">
                  {errors.bank_name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="card_name"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Card Name
              </label>

              <input
                id="card_name"
                type="text"
                name="card_name"
                placeholder="Example: HDFC Millennia"
                value={formData.card_name}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white disabled:cursor-not-allowed disabled:opacity-70"
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="last_four_digits"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Last 4 Digits
                </label>

                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    id="last_four_digits"
                    type="text"
                    name="last_four_digits"
                    maxLength={4}
                    placeholder="1234"
                    value={formData.last_four_digits}
                    onChange={handleChange}
                    disabled={loading}
                    className={`w-full rounded-xl border bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:bg-white disabled:cursor-not-allowed disabled:opacity-70 ${
                      errors.last_four_digits
                        ? "border-rose-500"
                        : "border-slate-300 focus:border-emerald-500"
                    }`}
                  />
                </div>

                {errors.last_four_digits && (
                  <p className="mt-2 text-sm text-rose-600">
                    {errors.last_four_digits}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="credit_limit"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Credit Limit
                </label>

                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    id="credit_limit"
                    type="number"
                    name="credit_limit"
                    placeholder="Enter credit limit"
                    value={formData.credit_limit}
                    onChange={handleChange}
                    disabled={loading}
                    className={`w-full rounded-xl border bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:bg-white disabled:cursor-not-allowed disabled:opacity-70 ${
                      errors.credit_limit
                        ? "border-rose-500"
                        : "border-slate-300 focus:border-emerald-500"
                    }`}
                  />
                </div>

                {errors.credit_limit && (
                  <p className="mt-2 text-sm text-rose-600">
                    {errors.credit_limit}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="current_outstanding"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Current Outstanding
              </label>

              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  id="current_outstanding"
                  type="number"
                  name="current_outstanding"
                  placeholder="Enter current outstanding amount"
                  value={formData.current_outstanding}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full rounded-xl border bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:bg-white disabled:cursor-not-allowed disabled:opacity-70 ${
                    errors.current_outstanding
                      ? "border-rose-500"
                      : "border-slate-300 focus:border-emerald-500"
                  }`}
                />
              </div>

              {errors.current_outstanding && (
                <p className="mt-2 text-sm text-rose-600">
                  {errors.current_outstanding}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding card...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Add Card
                </>
              )}
            </button>
          </form>
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

export default AddCard;
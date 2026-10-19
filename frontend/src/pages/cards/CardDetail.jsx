    import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  ArrowLeft,
  CreditCard,
  Loader2,
  Wallet,
  AlertTriangle,
  Landmark,
} from "lucide-react";

const CardDetail = () => {
  const { id } = useParams();

  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCard = async () => {
      setLoading(true);

      try {
        const res = await api.get(`cards/${id}/`);

        setCard(res.data.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load card details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading card details...
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-slate-600">Card not found.</p>
      </div>
    );
  }

  const usagePercentage =
    card.credit_limit > 0
      ? Math.round(
          (Number(card.current_outstanding || 0) /
            Number(card.credit_limit)) *
            100
        )
      : 0;

  const availableLimit =
    Number(card.credit_limit || 0) -
    Number(card.current_outstanding || 0);

  return (
    <div className="w-full bg-[#F9FAFB]">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <Link
          to="/cards"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-emerald-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to cards
        </Link>

        {/* Card Preview */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#111827] via-[#1F2937] to-[#065F46] p-6 text-white shadow-2xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-white/70">Bank</p>
              <p className="text-xl font-bold">{card.bank_name}</p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
              <CreditCard className="h-6 w-6 text-emerald-400" />
            </div>
          </div>

          <p className="mt-8 text-2xl font-bold tracking-widest">
            •••• •••• •••• {card.last_four_digits}
          </p>

          <div className="mt-6 flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-white/60">
                Card holder
              </p>
              <p className="mt-1 font-semibold">
                {card.card_name || "Card Wise User"}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs uppercase tracking-wide text-white/60">
                Credit limit
              </p>
              <p className="mt-1 font-semibold">
                ₹{Number(card.credit_limit || 0).toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>

        {/* Card Stats */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <p className="text-sm text-slate-500">Outstanding</p>
            </div>

            <p className="mt-3 text-2xl font-bold text-slate-900">
              ₹
              {Number(
                card.current_outstanding || 0
              ).toLocaleString("en-IN")}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                <Wallet className="h-5 w-5 text-emerald-600" />
              </div>
              <p className="text-sm text-slate-500">Available limit</p>
            </div>

            <p className="mt-3 text-2xl font-bold text-slate-900">
              ₹{availableLimit.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                <Landmark className="h-5 w-5 text-slate-700" />
              </div>
              <p className="text-sm text-slate-500">Limit used</p>
            </div>

            <p className="mt-3 text-2xl font-bold text-slate-900">
              {usagePercentage}%
            </p>

            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${
                  usagePercentage >= 80
                    ? "bg-rose-500"
                    : usagePercentage >= 50
                    ? "bg-amber-500"
                    : "bg-emerald-500"
                }`}
                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card Information */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4">
            <h2 className="font-semibold text-slate-900">Card information</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 px-6 py-5 sm:grid-cols-2">
            <div>
              <p className="text-sm text-slate-500">Bank name</p>
              <p className="mt-1 font-medium text-slate-900">
                {card.bank_name}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Card name</p>
              <p className="mt-1 font-medium text-slate-900">
                {card.card_name || "—"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Last four digits</p>
              <p className="mt-1 font-medium text-slate-900">
                •••• {card.last_four_digits}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Status</p>
              <p className="mt-1 font-medium capitalize text-slate-900">
                {card.status || "Active"}
              </p>
            </div>
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

export default CardDetail;
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  CreditCard,
  Plus,
  Loader2,
  ArrowUpRight,
  Wallet,
  AlertTriangle,
} from "lucide-react";

const GetAllCards = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCards = async () => {
    setLoading(true);

    try {
      const res = await api.get("cards/");

      const cardData = res.data.data;

      setCards(Array.isArray(cardData) ? cardData : cardData?.results ?? []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load cards.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const totalCreditLimit = cards.reduce(
    (sum, card) => sum + Number(card.credit_limit || 0),
    0
  );

  const totalOutstanding = cards.reduce(
    (sum, card) => sum + Number(card.current_outstanding || 0),
    0
  );

  const availableLimit = totalCreditLimit - totalOutstanding;

  return (
    <div className="w-full bg-[#F9FAFB]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Cards</h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage your credit cards, limits, and outstanding balances.
            </p>
          </div>

          <Link
            to="/cards/new"
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" />
            Add New Card
          </Link>
        </div>

        {/* Summary */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-gradient-to-br from-[#111827] to-[#065F46] p-5 text-white shadow-lg">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                <Wallet className="h-5 w-5 text-emerald-300" />
              </div>
              <p className="text-sm text-white/70">Total credit limit</p>
            </div>
            <p className="mt-3 text-2xl font-bold">
              ₹{totalCreditLimit.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <p className="text-sm text-slate-500">Total outstanding</p>
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-900">
              ₹{totalOutstanding.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                <CreditCard className="h-5 w-5 text-emerald-600" />
              </div>
              <p className="text-sm text-slate-500">Available limit</p>
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-900">
              ₹{availableLimit.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex min-h-[200px] items-center justify-center">
            <div className="flex items-center gap-3 text-slate-600">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading cards...
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && cards.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100">
              <CreditCard className="h-7 w-7 text-emerald-600" />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              No cards added yet
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Add your first credit card to start tracking limits, dues, and
              spending.
            </p>

            <Link
              to="/cards/new"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4" />
              Add New Card
            </Link>
          </div>
        )}

        {/* Cards Grid */}
        {!loading && cards.length > 0 && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {cards.map((card) => {
              const usagePercentage =
                card.credit_limit > 0
                  ? Math.round(
                      (Number(card.current_outstanding || 0) /
                        Number(card.credit_limit)) *
                        100
                    )
                  : 0;

              return (
                <Link
                  key={card.id}
                  to={`/cards/${card.id}`}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#111827] to-[#065F46]">
                        <CreditCard className="h-5 w-5 text-emerald-400" />
                      </div>

                      <div>
                        <p className="font-semibold text-slate-900">
                          {card.bank_name}
                        </p>
                        <p className="text-sm text-slate-500">
                          •••• {card.last_four_digits}
                        </p>
                      </div>
                    </div>

                    <ArrowUpRight className="h-5 w-5 text-slate-400 transition group-hover:text-emerald-600" />
                  </div>

                  <div className="mt-5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Outstanding</span>
                      <span className="font-semibold text-slate-900">
                        ₹
                        {Number(
                          card.current_outstanding || 0
                        ).toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${
                          usagePercentage >= 80
                            ? "bg-rose-500"
                            : usagePercentage >= 50
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                        }`}
                        style={{
                          width: `${Math.min(usagePercentage, 100)}%`,
                        }}
                      />
                    </div>

                    <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                      <span>Credit limit used</span>
                      <span>{usagePercentage}%</span>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
                    <div>
                      <p className="text-slate-500">Credit limit</p>
                      <p className="font-semibold text-slate-900">
                        ₹
                        {Number(
                          card.credit_limit || 0
                        ).toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-slate-500">Available</p>
                      <p className="font-semibold text-emerald-600">
                        ₹
                        {(
                          Number(card.credit_limit || 0) -
                          Number(card.current_outstanding || 0)
                        ).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
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

export default GetAllCards;
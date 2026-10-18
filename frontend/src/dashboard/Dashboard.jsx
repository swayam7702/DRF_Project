import React from "react";
import { Link } from "react-router-dom";
import {
  CreditCard,
  Wallet,
  CalendarClock,
  TrendingUp,
  ArrowUpRight,
  AlertTriangle,
  Plus,
  Receipt,
  Target,
} from "lucide-react";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user?.username || "User";

  // Replace these with your real API data later
  const dashboardData = {
    safeToSpend: 18400,
    totalDues: 12500,
    activeCards: 4,
    monthlySpending: 32450,
    monthlyLimit: 50000,
    upcomingDues: [
      {
        id: 1,
        bank: "HDFC Bank",
        card: "•••• 4821",
        amount: 6500,
        dueDate: "Oct 24",
        status: "due-soon",
      },
      {
        id: 2,
        bank: "ICICI Bank",
        card: "•••• 9032",
        amount: 6000,
        dueDate: "Oct 28",
        status: "upcoming",
      },
    ],
    categorySpending: [
      { name: "Groceries", amount: 9500, percentage: 29 },
      { name: "Fuel", amount: 6200, percentage: 19 },
      { name: "Shopping", amount: 8300, percentage: 26 },
      { name: "Food & Dining", amount: 8450, percentage: 26 },
    ],
    recentTransactions: [
      {
        id: 1,
        title: "BigBasket",
        category: "Groceries",
        amount: -2450,
        card: "HDFC •••• 4821",
        date: "Today",
      },
      {
        id: 2,
        title: "Indian Oil",
        category: "Fuel",
        amount: -1800,
        card: "ICICI •••• 9032",
        date: "Yesterday",
      },
      {
        id: 3,
        title: "Amazon",
        category: "Shopping",
        amount: -3200,
        card: "Axis •••• 1174",
        date: "Oct 17",
      },
    ],
  };

  const spendingPercentage = Math.round(
    (dashboardData.monthlySpending / dashboardData.monthlyLimit) * 100
  );

  return (
    <div className="w-full bg-[#F9FAFB]">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-4 bg-white border-b border-slate-200">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Hello, <span className="capitalize">{userName}</span> 👋
            </h1>
            <p className="text-sm text-slate-500">
              Here is your financial overview for this month.
            </p>
          </div>

          <button className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700">
            <Plus className="h-4 w-4" />
            Add Transaction
          </button>
        </header>

        {/* Scrollable Dashboard Content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
          {/* Summary Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* Safe to Spend */}
            <div className="rounded-2xl bg-gradient-to-br from-[#111827] to-[#065F46] p-5 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                  <Wallet className="h-5 w-5 text-emerald-300" />
                </div>
                <span className="rounded-lg bg-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                  Healthy
                </span>
              </div>

              <p className="mt-4 text-sm text-white/70">Safe to spend</p>
              <p className="mt-1 text-2xl font-bold">
                ₹{dashboardData.safeToSpend.toLocaleString("en-IN")}
              </p>
            </div>

            {/* Total Dues */}
            <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
                  <CalendarClock className="h-5 w-5 text-amber-600" />
                </div>
                <span className="rounded-lg bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                  2 upcoming
                </span>
              </div>

              <p className="mt-4 text-sm text-slate-500">Total upcoming dues</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                ₹{dashboardData.totalDues.toLocaleString("en-IN")}
              </p>
            </div>

            {/* Active Cards */}
            <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                  <CreditCard className="h-5 w-5 text-emerald-600" />
                </div>
                <Link
                  to="/cards"
                  className="flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700"
                >
                  View all
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>

              <p className="mt-4 text-sm text-slate-500">Active credit cards</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {dashboardData.activeCards}
              </p>
            </div>

            {/* Monthly Spending */}
            <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                  <TrendingUp className="h-5 w-5 text-slate-700" />
                </div>
                <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                  {spendingPercentage}% used
                </span>
              </div>

              <p className="mt-4 text-sm text-slate-500">Monthly spending</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                ₹{dashboardData.monthlySpending.toLocaleString("en-IN")}
              </p>

              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${spendingPercentage}%` }}
                />
              </div>
            </div>
          </section>

          {/* Middle Section */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Upcoming Dues */}
            <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <div className="flex items-center gap-2">
                  <CalendarClock className="h-5 w-5 text-amber-600" />
                  <h2 className="font-semibold text-slate-900">
                    Upcoming dues
                  </h2>
                </div>

                <Link
                  to="/dues"
                  className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                >
                  View all
                </Link>
              </div>

              <div className="divide-y divide-slate-100">
                {dashboardData.upcomingDues.map((due) => (
                  <div
                    key={due.id}
                    className="flex items-center justify-between px-5 py-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                        <CreditCard className="h-5 w-5 text-slate-600" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {due.bank}
                        </p>
                        <p className="text-xs text-slate-500">{due.card}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900">
                        ₹{due.amount.toLocaleString("en-IN")}
                      </p>
                      <p
                        className={`text-xs font-medium ${
                          due.status === "due-soon"
                            ? "text-amber-600"
                            : "text-slate-500"
                        }`}
                      >
                        Due on {due.dueDate}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Spending */}
            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
                <Target className="h-5 w-5 text-emerald-600" />
                <h2 className="font-semibold text-slate-900">
                  Spending by category
                </h2>
              </div>

              <div className="space-y-4 px-5 py-5">
                {dashboardData.categorySpending.map((category) => (
                  <div key={category.name}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">
                        {category.name}
                      </span>
                      <span className="text-slate-500">
                        ₹{category.amount.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Recent Transactions */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-emerald-600" />
                <h2 className="font-semibold text-slate-900">
                  Recent transactions
                </h2>
              </div>

              <Link
                to="/transactions"
                className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
              >
                View all
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {dashboardData.recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between px-5 py-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                      <Receipt className="h-5 w-5 text-slate-600" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {transaction.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {transaction.category} • {transaction.card}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">
                      ₹{Math.abs(transaction.amount).toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-slate-500">
                      {transaction.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Financial Tip */}
          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-600" />

              <div>
                <p className="font-semibold text-amber-900">
                  Keep your monthly spending below 70%
                </p>
                <p className="mt-1 text-sm text-amber-800">
                  You have used {spendingPercentage}% of your monthly limit.
                  Try to keep some balance for upcoming bills and emergency
                  expenses.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
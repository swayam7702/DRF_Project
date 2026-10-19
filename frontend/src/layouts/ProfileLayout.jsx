import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { User, Wallet } from "lucide-react";

const ProfileLayout = () => {
  const tabs = [
    {
      title: "Basic Profile",
      to: "/profile/basic",
      icon: User,
    },
    {
      title: "Financial Profile",
      to: "/profile/financial",
      icon: Wallet,
    },
  ];

  return (
    <div className="w-full bg-[#F9FAFB]">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your account and financial planning details.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 rounded-xl bg-white p-1.5 shadow-sm border border-slate-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <NavLink
                key={tab.to}
                to={tab.to}
                className={({ isActive }) =>
                  `flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {tab.title}
              </NavLink>
            );
          })}
        </div>

        {/* Active Tab Content */}
        <Outlet />
      </div>
    </div>
  );
};

export default ProfileLayout;
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { PanelLeftOpen } from "lucide-react";

function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F9FAFB]">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
              aria-label="Open sidebar"
            >
              <PanelLeftOpen className="h-5 w-5" />
            </button>

            <div>
              <h1 className="text-lg font-semibold text-slate-900">
                Card Wise
              </h1>
              <p className="hidden text-sm text-slate-500 sm:block">
                Manage cards, dues, and spending wisely
              </p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
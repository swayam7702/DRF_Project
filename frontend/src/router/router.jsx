import { createBrowserRouter } from "react-router";

import MainLayout from "../layouts/MainLayout";
import Dashboard from "../dashboard/Dashboard";
import About from "../pages/About";
import Profile from "../pages/Profile";
import LogInPage from "../pages/LogInPage";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";

import { authLoader } from "./loaders/authLoader";
import { guestLoader } from "./loaders/guestLoader";
import { dashboardLoader } from "./loaders/dashboardLoader";

import { loginAction } from "./actions/loginAction";
import { registerAction } from "./actions/registerAction";
import { Navigate } from "react-router";
import ProfileLayout from "../layouts/ProfileLayout";
import FinancialProfile from "../pages/FinancialProfile";
import GetAllCards from "../pages/cards/GetAllCards";
import AddCard from "../pages/cards/AddCard";
import CardDetail from "../pages/cards/CardDetail";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    loader: authLoader,
    children: [
      {
        index: true,
        element: <Dashboard />,
        loader: dashboardLoader,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "profile",
        element: <ProfileLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/profile/basic" replace />,
          },
          {
            path: "basic",
            element: <Profile />,
          },
          {
            path: "financial",
            element: <FinancialProfile />,
          },
        ],
      },
      {
        path: "cards",
        element: <GetAllCards />,
      },
      {
        path: "cards/new",
        element: <AddCard />,
      },
      {
        path: "cards/:id",
        element: <CardDetail />,
      },
    ],
  },

  {
    path: "/login",
    element: <LogInPage />,
    loader: guestLoader,
    action: loginAction,
  },

  {
    path: "/register",
    element: <Register />,
    loader: guestLoader,
    action: registerAction,
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);
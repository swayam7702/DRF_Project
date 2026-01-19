import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Register from "./pages/Register";
import LogInPage from "./pages/LogInPage";
import PublicRoutes from "./router_layers/PublicRoutes";
import ProtectedRoutes from "./router_layers/ProtectedRoutes";
import Profile from "./pages/Profile";

function App() {
  return (
    <Routes>

      {/* Public Routes */}
      <Route element={<PublicRoutes />}>
        <Route path="/login" element={<LogInPage />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<MainLayout />}>
        {/* Protected Routes */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />

        </Route>
      </Route>
    </Routes>
  );
}

export default App;

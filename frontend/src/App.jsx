import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Register from "./pages/Register";
import LogInPage from "./pages/LogInPage";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<LogInPage />} />
      </Route>
    </Routes>
  );
}

export default App;

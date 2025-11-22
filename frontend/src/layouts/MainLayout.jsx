import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

function MainLayout() {
  return (
    <>
      <Header />
      <main style={{ padding: "20px", height:"75vh" }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default MainLayout;

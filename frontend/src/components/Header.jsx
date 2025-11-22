import { Link } from "react-router-dom";

function Header() {
  return (
    <header
      style={{
        padding: "15px",
        background: "#333",
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      <h2>MyApp</h2>

      <nav style={{ display: "flex", gap: "20px" }}>
        <Link style={{ color: "white" }} to="/">Home</Link>
        <Link style={{ color: "white" }} to="/about">About</Link>
        <Link style={{ color: "white" }} to="/login">Login</Link>
        <Link style={{ color: "white" }} to="/register">Register</Link>
      </nav>
    </header>
  );
}

export default Header;

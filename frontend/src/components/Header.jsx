import { Link, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  const handleOut = () => {
    localStorage.removeItem("authUser");
    navigate("/login")
  };
  
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
        <button onClick={handleOut}>Logout</button>
      </nav>
    </header>
  );
}

export default Header;

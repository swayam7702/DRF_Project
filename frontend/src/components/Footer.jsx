function Footer() {
  return (
    <footer
      style={{
        marginTop: "40px",
        padding: "15px",
        background: "#222",
        color: "#fff",
        textAlign: "center"
      }}
    >
      <p>© {new Date().getFullYear()} MyApp. All rights reserved.</p>
    </footer>
  );
}

export default Footer;

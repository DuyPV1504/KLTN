import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; 
import axios from "axios";
import "../../styles/auth.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    console.log("Login button clicked!");
    console.log("Email:", email);
    console.log("Password:", password);

    if (!email || !password) {
      alert("Please enter both email and password!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/login", { email, password });

      console.log("Server Response:", res.data);
      localStorage.setItem("token", res.data.token);

      if (res.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "❌ Invalid credentials");
    }
  };

  return (
    <div
      className="auth-container"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL + "/background.jpg"})`, 
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="auth-box"
      >
        <motion.img 
          src="/doraemon.jpg" 
          alt="Doraemon" 
          className="auth-image"
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
        <h2>Welcome Back!</h2>

        <motion.input 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          whileFocus={{ scale: 1.05 }}
        />
        <motion.input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          whileFocus={{ scale: 1.05 }}
        />
        <motion.button 
          onClick={handleLogin}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          Login
        </motion.button>

        <p>Don't have an account? <span onClick={() => navigate("/register")}>Sign Up</span></p>
      </motion.div>
    </div>
  );
}

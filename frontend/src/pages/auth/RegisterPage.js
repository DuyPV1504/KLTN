import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import "../../styles/auth.css";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeField, setActiveField] = useState(null);
  const navigate = useNavigate();
  
  const usernameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  useEffect(() => {
    const authBox = document.querySelector('.auth-box');
    const doraemonImg = document.querySelector('.auth-image');
    
    if (authBox) {
      authBox.classList.add('login-animation');
      
      setTimeout(() => {
        authBox.classList.remove('login-animation');
      }, 1000);
    }
    
    if (doraemonImg) {
      doraemonImg.addEventListener('click', () => {
        doraemonImg.classList.add('doraemon-clicked');
        setTimeout(() => {
          doraemonImg.classList.remove('doraemon-clicked');
        }, 1000);
      });
    }
  }, []);

  const handleRegister = async (e) => {
    if (e) e.preventDefault();
    
    if (!username || !email || !password) {
      alert("Please fill in all fields!");
      return;
    }

    try {
      const API_URL = "http://localhost:5000";
      const response = await axios.post(`${API_URL}/register`, { 
        username, // Đảm bảo gửi username
        email, 
        password 
      });
      
      console.log("Register response:", response.data);
      alert("Registration successful! Please login.");
      navigate("/");
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "❌ Registration failed");
    }
  };

  const getDoraemonAnimation = () => {
    if (activeField === 'password') {
      return {
        rotateY: 80,
        scale: 1.05,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      };
    } else if (activeField === 'email') {
      return {
        rotateY: 0,
        y: [0, -3, 0],
        transition: { 
          y: { repeat: Infinity, duration: 1.5 },
          rotateY: { type: "spring", stiffness: 300, damping: 20 }
        }
      };
    } else if (activeField === 'username') {
      return {
        rotateY: 0,
        scale: 1.1,
        rotate: [0, 10, 0],
        transition: { 
          rotate: { duration: 1 },
          scale: { type: "spring", stiffness: 300, damping: 20 }
        }
      };
    } else {
      return {
        rotateY: 0,
        y: 0,
        rotate: [0, 5, 0, -5, 0],
        transition: { rotate: { repeat: Infinity, duration: 8, ease: "linear" } }
      };
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
        <div className="doraemon-container">
          <motion.img
            src="/doraemon.jpg"
            alt="Doraemon"
            className="auth-image"
            initial={{ rotateY: 0 }}
            animate={getDoraemonAnimation()}
          />
          <AnimatePresence>
            {activeField === 'password' && (
              <motion.div
                className="doraemon-paws"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <img src="/doraemon_paws.png" alt="Paws" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <h2>Create Account</h2>

        <form className="auth-form" onSubmit={handleRegister}>
          <div className="input-group">
            <label className="input-label">Username</label>
            <motion.input
              ref={usernameInputRef}
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setActiveField('username')}
              onBlur={() => setActiveField(null)}
              whileFocus={{ scale: 1.02 }}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Email</label>
            <motion.input
              ref={emailInputRef}
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setActiveField('email')}
              onBlur={() => setActiveField(null)}
              whileFocus={{ scale: 1.02 }}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <motion.input
              ref={passwordInputRef}
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setActiveField('password')}
              onBlur={() => setActiveField(null)}
              whileFocus={{ scale: 1.02 }}
              required
            />
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Create Account
          </motion.button>
        </form>

        <div className="form-footer">
          Already have an account? <span className="auth-link" onClick={() => navigate("/login")}>Sign In</span>
        </div>
      </motion.div>
    </div>
  );
}
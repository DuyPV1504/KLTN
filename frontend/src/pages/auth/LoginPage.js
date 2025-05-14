import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; 
import axios from "axios";
import "../../styles/auth.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeField, setActiveField] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  useEffect(() => {
    const authBox = document.querySelector('.auth-box');
    const doraemonImg = document.querySelector('.auth-image');
    
    authBox.classList.add('login-animation');
    
    setTimeout(() => {
      authBox.classList.remove('login-animation');
    }, 1000);
    
    if (doraemonImg) {
      doraemonImg.addEventListener('click', () => {
        doraemonImg.classList.add('doraemon-clicked');
        setTimeout(() => {
          doraemonImg.classList.remove('doraemon-clicked');
        }, 1000);
      });
    }
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("Please enter both email and password!");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
      console.log("Sending login request to:", `${API_URL}/login`);
      
      const res = await axios.post(`${API_URL}/login`, { email, password });
      console.log("Login response:", res.data);
      
      if (res.data && res.data.token) {
        localStorage.setItem("token", res.data.token);
        console.log("LoginPage - token saved:", res.data.token);
        if (res.data.role && res.data.role.toLowerCase() === "admin") {
          navigate("/admin");
        } else {
          navigate("/user");
        }
      } else {
        setErrorMessage("Login failed: Invalid response from server");
      }
    } catch (err) {
      console.error("Login error details:", err);
      setErrorMessage(err.response?.data?.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGuestLogin = () => {
    setIsLoading(true);
    localStorage.setItem("token", "guest-token");
    setTimeout(() => {
      navigate("/practice");
      setIsLoading(false);
    }, 500);
  };
  
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
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
        <h2>Welcome Back!</h2>

        <div className="auth-form">
          {errorMessage && (
            <div className="error-message">
              {errorMessage}
            </div>
          )}
          
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
              onKeyPress={handleKeyPress}
              whileFocus={{ scale: 1.02 }}
            />
          </div>
          
          <div className="input-group">
            <label className="input-label">Password</label>
            <motion.input 
              ref={passwordInputRef}
              type="password" 
              placeholder="Enter your password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setActiveField('password')}
              onBlur={() => setActiveField(null)}
              onKeyPress={handleKeyPress}
              whileFocus={{ scale: 1.02 }}
            />
            <a href="#" className="forgot-password auth-link">Forgot password?</a>
          </div>
          
          <motion.button 
            onClick={handleLogin}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </motion.button>
          
          <div className="guest-login-container">
            <span className="guest-login-divider">or</span>
            <motion.button 
              className="guest-login-button"
              onClick={handleGuestLogin}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading}
            >
              Continue without create an account
            </motion.button>
          </div>
        </div>

        <div className="form-footer">
          Don't have an account? <span className="auth-link" onClick={() => navigate("/register")}>Sign Up</span>
        </div>
      </motion.div>
    </div>
  );
}
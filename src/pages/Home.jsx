import React, { useState } from "react";
import styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebase"; // Ensure this is correctly configured
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Home() {
  const [loginModal, setLoginModal] = useState(false);
  const [registerModal, setRegisterModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const toggleLoginModal = () => {
    setLoginModal(!loginModal);
    if (registerModal) setRegisterModal(false);
    resetForm();
  };

  const toggleRegisterModal = () => {
    setRegisterModal(!registerModal);
    if (loginModal) setLoginModal(false);
    resetForm();
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setError("");
  };

  const handleRegister = async () => {
    try {

      const domain = "@dhvsu.edu.ph";
      if (!email.endsWith(domain)) {
        toast.warning("Invalid email. Only DHVSU emails are allowed.");
        return;
      }

      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
      // Get the user's unique ID
      const userId = userCredential.user.uid;
  
      // Add user data to Firestore
      const userDoc = {
        username: "Student",
        profileImage: "",
        about: "",
        email: email,
        id: userId,
        createdAt: new Date(),
      };
  
      await setDoc(doc(db, "users", userId), userDoc);
  
      toast.success("Account created successfully!");
      setRegisterModal(false);
      resetForm();
    } catch (err) {
      toast.error(err.message);
    }
  };
  

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged in successfully!");
      navigate("/home");
    } catch (err) {
      toast.error("Error logging in: ");
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>DHVSTUDY</h1>
          <div className={styles.buttonHolder}>
            <div className={styles.button} onClick={toggleLoginModal}>
              Log In
            </div>
            <div className={styles.button} onClick={toggleRegisterModal}>
              Create account
            </div>
          </div>
        </div>
        <div className={styles.footer}>
          <span
            className={styles.footerButton}
            onClick={() => navigate("/about")}
          >
            About us
          </span>
          <span>Copyright ©2024 . Designed by GR1</span>
        </div>

        {loginModal && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <div className={styles.top}>
                <span>DHVSTUDY</span>
                <i className="fa-solid fa-x" onClick={() => setLoginModal(false)}></i>
              </div>
              <div className={styles.middle}>
                <div className={styles.headerSection}>
                  <span style={{ fontSize: "3rem" }}>Welcome Back!</span>
                  <span style={{ fontSize: "1.2rem", fontFamily: "Poppins, sans-serif" }}>
                    Enter your email and password to login
                  </span>
                </div>
                <div className={styles.inputSection}>
                  <span style={{ fontSize: ".8rem", fontWeight: "bold" }}>Email</span>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <span style={{ fontSize: ".8rem", marginTop: "1rem", fontWeight: "bold" }}>Password</span>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && <div className={styles.error}>{error}</div>}
                <div className={styles.buttonSection}>
                  <div className={styles.continueButton} onClick={handleLogin}>
                    Continue
                  </div>
                </div>
              </div>
              <div className={styles.bottom}>
                <span style={{ fontSize: "1.2rem" }}>Don't have an account?</span>
                <span
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    textDecoration: "underline",
                    fontStyle: "italic",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setLoginModal(false);
                    setRegisterModal(true);
                  }}
                >
                  Sign up
                </span>
              </div>
            </div>
          </div>
        )}

        {registerModal && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <div className={styles.top}>
                <span>DHVSTUDY</span>
                <i className="fa-solid fa-x" onClick={() => setRegisterModal(false)}></i>
              </div>
              <div className={styles.middle}>
                <div className={styles.headerSection}>
                  <span style={{ fontSize: "3rem" }}>Create Account!</span>
                  <span style={{ fontSize: "1.2rem", fontFamily: "Poppins, sans-serif" }}>
                    Enter your email and password to create your account
                  </span>
                </div>
                <div className={styles.inputSection}>
                  <span style={{ fontSize: ".8rem", fontWeight: "bold" }}>Email</span>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <span style={{ fontSize: ".8rem", marginTop: "1rem", fontWeight: "bold" }}>Password</span>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && <div className={styles.error}>{error}</div>}
                <div className={styles.buttonSection}>
                  <div className={styles.continueButton} onClick={handleRegister}>
                    Create account
                  </div>
                </div>
              </div>
              <div className={styles.bottom}>
                <span style={{ fontSize: "1.2rem" }}>Already have an account?</span>
                <span
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    textDecoration: "underline",
                    fontStyle: "italic",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setRegisterModal(false);
                    setLoginModal(true);
                  }}
                >
                  Login
                </span>
              </div>
            </div>
          </div>
        )}
        <ToastContainer/>
      </div>
    </>
  );
}

export default Home;

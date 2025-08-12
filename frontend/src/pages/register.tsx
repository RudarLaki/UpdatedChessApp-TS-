// pages/Register.tsx
import { useState } from "react";
import "../styles/Auth.css";
import { AuthService } from "../services/auth-service";
import { useNavigate } from "react-router-dom";

const Register = () => {
  //const [userName, setUserName] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const authService = new AuthService();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Register:  ${name}${lastName}`, { email, password });
    await authService.register(name, lastName, email, password);
    navigate("/");
  };

  return (
    <div className="container forms">
      <div className="form signup">
        <div className="form-content">
          <header>Signup</header>
          <form action="#">
            <div className="field input-field">
              <input
                type="name"
                placeholder="Name"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="field input-field">
              <input
                type="lastName"
                placeholder="Last Name"
                className="input"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="field input-field">
              <input
                type="email"
                placeholder="Email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="field input-field">
              <input
                type="password"
                placeholder="Create password"
                className="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <i className="bx bx eye-icon"></i>
            </div>
            <div className="field button-field">
              <button onClick={handleSubmit}>Signup</button>
            </div>
          </form>
          <div className="form-link">
            <span>
              Already have an account?{" "}
              <a href="#" className="link login-link">
                Login
              </a>
            </span>
          </div>
        </div>
        <div className="line"></div>
        <div className="media-options">
          <a href="#" className="field facebook">
            <i className="bx bxl-facebook facebook-icon"></i>
            <span>Login with Facebook</span>
          </a>
        </div>
        <div className="media-options">
          <a href="#" className="field google">
            <img src="images/google.png" alt="Google" className="google-img" />
            <span>Login with Google</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;

import { useState } from "react";
import "../styles/Auth.css";
import { authService } from "../services/auth-service";
import { useNavigate } from "react-router-dom";
import type { RegisterRequest } from "../../../sharedGameLogic/types/auth";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const registerRequest: RegisterRequest = { userName, email, password };
    await authService.register(registerRequest);
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
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
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
              <Link to="/login" className="link login-link">
                Login
              </Link>
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

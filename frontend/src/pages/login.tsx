import { useState } from "react";
import "../styles/Auth.css";
import { authService } from "../services/auth-service";
import { useNavigate } from "react-router-dom";
import type { LoginRequest } from "../../../sharedGameLogic/types/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const loginRequest: LoginRequest = { email, password };
      const response = await authService.login(loginRequest);
      localStorage.setItem("loginInfo", JSON.stringify(response));
      navigate("/home");
    } catch (err) {
      // Type checking for error
      if (err instanceof Error) {
        //setError(err.message);
      } else {
        //setError("An unexpected error occurred");
      }
    } finally {
      //setIsLoading(false);
    }
  };

  return (
    <div className="container forms">
      <div className="form login">
        <div className="form-content">
          <header>Login</header>
          <form action="#">
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
                placeholder="Password"
                className="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <i className="bx bx-hide eye-icon"></i>
            </div>
            <div className="form-link">
              <a href="#" className="forgot-pass">
                Forgot password?
              </a>
            </div>
            <div className="field button-field">
              <button onClick={handleSubmit}>Login</button>
            </div>
          </form>
          <div className="form-link">
            <span>
              Don't have an account?{" "}
              <a href="#" className="link signup-link">
                Signup
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
            <img src="images/google.png" alt="" className="google-img" />
            <span>Login with Google</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;

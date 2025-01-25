import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { toast } from "react-toastify";
import axios from "axios";
// css
import "../../../Styles/Home/Forms.css";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, setLogin } from "../../../App/Features/Users/authSlice";
import Spinner from "../Spinner/Spinner";

const Login = ({ switchToRegister, switchToOptSend }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const user_role = useSelector((state) => state.users.userRole);

  const [values, setValues] = useState({
    user_id: "",
    user_password: "",
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [isSaving, setIsSaving] = useState(false);

  // Check if login details are stored in localStorage when the component mounts
  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    const storedPassword = localStorage.getItem("user_password");
    const storedRememberMe = localStorage.getItem("rememberMe");

    if (storedUserId && storedPassword && storedRememberMe === "true") {
      setValues({
        user_id: storedUserId,
        user_password: storedPassword,
      });
      setRememberMe(true); // Set the checkbox to checked if credentials were stored
    }
  }, []);

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  axios.defaults.baseURL = import.meta.env.VITE_BASE_URI;
  axios.defaults.withCredentials = true;

  //   const handleLogin = (e) => {
  //     e.preventDefault();
  //     setIsSaving(true);
  //     console.log(isSaving);
  //     axios
  //       .post("/login", values)
  //       .then((res) => {
  //         const { user_role } = res.data;
  //
  //         // If "Remember Me" is checked, store credentials in localStorage
  //         if (rememberMe) {
  //           localStorage.setItem("user_id", values.user_id);
  //           localStorage.setItem("user_password", values.user_password);
  //           localStorage.setItem("rememberMe", "true");
  //         } else {
  //           // If "Remember Me" is not checked, remove credentials from localStorage
  //           localStorage.removeItem("user_id");
  //           localStorage.removeItem("user_password");
  //           localStorage.removeItem("rememberMe");
  //         }
  //
  //         const userRole = user_role.toLowerCase();
  //         dispatch(setLogin({ userRole: userRole }));
  //         localStorage.setItem("userRole", userRole);
  //         // Redirect based on user_role
  //         if (userRole === "customer") {
  //           navigate("/customer/dashboard");
  //           toast.success(`Login Successful`);
  //         } else if (
  //           userRole === "admin" ||
  //           userRole === "manager" ||
  //           userRole === "milkcollector" ||
  //           userRole === "mobilecollector" ||
  //           userRole === "salesman"
  //         ) {
  //           navigate("/mainapp/home");
  //           toast.success(`Login Successful`);
  //         } else if (userRole === "super_admin") {
  //           navigate("/adminpanel");
  //           toast.success(`Login Successful`);
  //         } else {
  //           toast.error("Unexpected user type!");
  //         }
  //       })
  //       .catch((err) => {
  //         if (err.response) {
  //           console.error(`Error during login: ${err.response.data.message}`);
  //           toast.error(err.response.data.message);
  //         } else {
  //           console.error(`Error during login: ${err.message}`);
  //           toast.error("An error occurred during login.");
  //         }
  //       });
  //     setIsSaving(false);
  //     console.log(isSaving);
  //   };

  const handleLogin = (e) => {
    e.preventDefault();
    setIsSaving(true);
    axios
      .post("/login", values)
      .then((res) => {
        const { user_role } = res.data;

        // Handle "Remember Me" functionality
        if (rememberMe) {
          localStorage.setItem("user_id", values.user_id);
          localStorage.setItem("user_password", values.user_password);
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("user_id");
          localStorage.removeItem("user_password");
          localStorage.removeItem("rememberMe");
        }

        const userRole = user_role.toLowerCase();
        dispatch(setLogin({ userRole: userRole }));
        localStorage.setItem("userRole", userRole);

        // Redirect based on user_role
        if (userRole === "customer") {
          navigate("/customer/dashboard");
          toast.success("Login Successful");
        } else if (
          userRole === "admin" ||
          userRole === "manager" ||
          userRole === "milkcollector" ||
          userRole === "mobilecollector" ||
          userRole === "salesman"
        ) {
          navigate("/mainapp/home");
          toast.success("Login Successful");
        } else if (userRole === "super_admin") {
          navigate("/adminpanel");
          toast.success("Login Successful");
        } else {
          toast.error("Unexpected user type!");
        }
      })
      .catch((err) => {
        if (err.response) {
          console.error(`Error during login: ${err.response.data.message}`);
          toast.error(err.response.data.message);
        } else {
          console.error(`Error during login: ${err.message}`);
          toast.error("An error occurred during login.");
        }
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  return (
    <div className="form-container w50 h1 d-flex-col p10">
      <div className="form-title w100 h10 d-flex-col t-center">
        <span className="title">Login Now</span>
      </div>
      <form onSubmit={handleLogin} className="login-form w100 h1 d-flex-col">
        <div className="data-div w100">
          <span className="text">Enter User ID</span>
          <input
            type="text"
            name="user_id"
            className="data password-input-container pass"
            required
            value={values.user_id}
            onChange={handleInputs}
          />
        </div>
        <div className="data-div w100">
          <span className="text">Enter Password</span>
          <div className="password-input-container d-flex a-center">
            <input
              type={showPassword ? "text" : "password"}
              name="user_password"
              className="pass w90"
              required
              value={values.user_password}
              onChange={handleInputs}
            />
            <span
              className="eye-icon w10 d-flex a-center"
              onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
            >
              {showPassword ? (
                <IoMdEyeOff className="pss-eye" />
              ) : (
                <IoMdEye className="pss-eye" />
              )}
            </span>
          </div>
        </div>
        <div className="remember-me-div w100 d-flex j-start a-center py10">
          <input
            className="checkbx"
            type="checkbox"
            checked={rememberMe}
            onChange={handleRememberMeChange}
          />
          <span className="px10 heading">Remember me!</span>
        </div>
        <button className="form-btn" type="submit" disabled={isSaving}>
          {isSaving ? "Loging..." : "Login"}
        </button>
        {isSaving ? (
          <div className="loaging-spinner w100 d-flex center">
            {" "}
            <Spinner />
          </div>
        ) : (
          ""
        )}
        <div className="account-check-div">
          <h2 className="text">
            <button
              disabled
              onClick={switchToOptSend}
              className="info-text swith-form-button">
              Forget Password?
            </button>
          </h2>
        </div>
        <div className="account-check-div">
          <h2 className="text">
            I don't have an account{" "}
            <button onClick={switchToRegister} className="swith-form-button">
              Register
            </button>{" "}
            Now!
          </h2>
        </div>
      </form>
    </div>
  );
};

export default Login;

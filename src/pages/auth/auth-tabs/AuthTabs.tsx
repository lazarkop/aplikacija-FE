import { useEffect, useState } from "react";
import "src/pages/auth/auth-tabs/AuthTabs.scss";
import Login from "src/pages/auth/login/Login";
import Register from "src/pages/auth/register/Register";
import useLocalStorage from "src/hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";

const AuthTabs = () => {
  const [type, setType] = useState("Sign In");
  const keepLoggedIn = useLocalStorage("keepLoggedIn", "get");
  const navigate = useNavigate();

  useEffect(() => {
    if (keepLoggedIn) navigate("/app/social/streams");
  }, [keepLoggedIn, navigate]);

  return (
    <>
      <div className="container-wrapper">
        <div className="container-wrapper-auth">
          <div className="tabs">
            <div className="tabs-auth">
              <ul className="tab-group">
                <li
                  className={`tab ${type === "Sign In" ? "active" : ""}`}
                  onClick={() => setType("Sign In")}
                >
                  <button className="login">Sign In</button>
                </li>
                <li
                  className={`tab ${type === "Sign Up" ? "active" : ""}`}
                  onClick={() => setType("Sign Up")}
                >
                  <button className="signup">Sign Up</button>
                </li>
              </ul>
              {type === "Sign In" && (
                <div className="tab-item">
                  <Login />
                </div>
              )}
              {type === "Sign Up" && (
                <div className="tab-item">
                  <Register />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthTabs;

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "./App.css";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  const signUpFormik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          "http://localhost:3000/users",
          values
        );
        console.log(response.data);
        // Store the token in local storage
        localStorage.setItem("token", response.data.token);
        // Handle successful sign-up, e.g., redirect to another page
        navigate("/home");
      } catch (error) {
        console.error(error);
        // Handle sign-up error, e.g., show an error message
      }
    },
  });

  const logInFormik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          "http://localhost:3000/users/login",
          values,
          { withCredentials: true }
        );
        console.log(response.data);
        // Store the token from the response data in local storage
        const token = response.data.token;
        localStorage.setItem("token", token);
        // Handle successful login, e.g., redirect to another page
        navigate("/home");
      } catch (error) {
        console.error(error);
        // Handle login error, e.g., show an error message
      }
    },
  });

  return (
    <div className="App">
      <div className="leftSide">
        <h1>Role-Playing Generator</h1>
      </div>
      <div className="rightSide">
        {/* Sign Up Form */}
        <div className="authForm">
          <h2>Sign Up</h2>
          <form onSubmit={signUpFormik.handleSubmit}>
            <input
              type="text"
              placeholder="Email"
              name="email"
              value={signUpFormik.values.email}
              onChange={signUpFormik.handleChange}
              onBlur={signUpFormik.handleBlur}
            />
            {signUpFormik.touched.email && signUpFormik.errors.email && (
              <div className="error">{signUpFormik.errors.email}</div>
            )}
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={signUpFormik.values.password}
              onChange={signUpFormik.handleChange}
              onBlur={signUpFormik.handleBlur}
            />
            {signUpFormik.touched.password && signUpFormik.errors.password && (
              <div className="error">{signUpFormik.errors.password}</div>
            )}
            <button type="submit">Sign Up</button>
          </form>
        </div>
        {/* Log In Form */}
        <div className="authForm">
          <h2>Log In</h2>
          <form onSubmit={logInFormik.handleSubmit}>
            <input
              type="text"
              placeholder="Email"
              name="email"
              value={logInFormik.values.email}
              onChange={logInFormik.handleChange}
              onBlur={logInFormik.handleBlur}
            />
            {logInFormik.touched.email && logInFormik.errors.email && (
              <div className="error">{logInFormik.errors.email}</div>
            )}
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={logInFormik.values.password}
              onChange={logInFormik.handleChange}
              onBlur={logInFormik.handleBlur}
            />
            {logInFormik.touched.password && logInFormik.errors.password && (
              <div className="error">{logInFormik.errors.password}</div>
            )}
            <button type="submit">Log In</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;

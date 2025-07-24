// src/pages/Login.jsx
import { useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { FaApple } from "react-icons/fa";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setErrorMsg(error.message);
    else navigate("/dashboard");
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left panel - Form */}
      <div className="flex flex-col justify-center px-8 md:px-20">
        <div className="mb-10">
          <img src="/logo.svg" alt="CareBridge Logo" className="h-7 mb-4" />
          <h1 className="text-2xl font-semibold text-gray-800">
            Login to Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Fill the below form to login
          </p>
        </div>

        {errorMsg && <p className="text-red-500 text-sm mb-4">{errorMsg}</p>}

        <div className="flex gap-3 mb-6">
          <button className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2 w-full hover:bg-gray-50 cursor-pointer">
            <FcGoogle size={20} />
            <span className="text-sm text-gray-700">Sign in with Google</span>
          </button>
          <button className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2 w-full hover:bg-gray-50 cursor-pointer">
            <FaApple size={20} />
            <span className="text-sm text-gray-700">Sign in with Apple</span>
          </button>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="text-gray-400 text-xs">OR</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              placeholder="Enter email address"
              className="w-full px-4 py-2 border border-gray-300 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="text-right">
            <button
              type="button"
              className="text-blue-600 text-sm hover:underline cursor-pointer"
              onClick={() => alert("Coming soon")}
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-blue-300 text-white w-full py-2 rounded-md font-medium hover:opacity-90 transition cursor-pointer"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don’t have an account yet?{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="text-blue-600 hover:underline font-medium cursor-pointer"
          >
            Register for free
          </button>
        </p>
      </div>

      {/* Right panel - Background image or app preview */}
      <div className="hidden lg:block">
        <img
          src="https://www.digitalhealth.net/wp-content/uploads/2024/12/AI-medical.jpg"
          alt="CareBridge App Preview"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

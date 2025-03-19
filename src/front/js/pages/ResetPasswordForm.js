import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const ResetPasswordForm = () => {
    const { token } = useParams(); // Captura el token desde la URL
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      if (password !== confirmPassword) {
        alert("Passwords don't match");
        return;
      }
  
      try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/update-password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, password }),
        });
  
        const result = await response.json();
        if (response.ok) {
          alert("¡Password changed!");
          navigate("/login"); // Redirige al login después del éxito
        } else {
          alert(result.msg || "Failed to change password");
        }
      } catch (error) {
        console.error("Error interno:", error);
        alert("Error interno. Por favor, intenta de nuevo.");
      }
    };
  
    return (
      <div className="container">
        <h2>Don't worry... Reset your password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">New Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter a New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              placeholder="Confirma tu New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary mb-5">Change Password</button>
        </form>
      </div>
    );
  };